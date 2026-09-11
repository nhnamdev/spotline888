const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách đơn rút tiền cho Admin
 * Route: GET /api/admin/downmark
 */
async function getDownmarks(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { status, search } = req.query;

    let whereClause = '1=1';
    const params = [];

    if (status && status !== 'Choose' && status !== 'all') {
      let dbStatus = status;
      if (status === '0' || status === 0) dbStatus = 'pending';
      if (status === '1' || status === 1) dbStatus = 'approved';
      if (status === '2' || status === 2) dbStatus = 'rejected';
      whereClause += ' AND d.status = ?';
      params.push(dbStatus);
    }

    if (search && search.trim()) {
      whereClause += ' AND (d.order_sn LIKE ? OR u.account LIKE ? OR d.real_name LIKE ? OR d.card_number LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword, keyword);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM fa_downmark d 
       JOIN fa_user u ON d.user_id = u.id 
       WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT d.*, 
              d.amount as money, 
              d.actual_amount as real_money, 
              d.card_number as bank_card, 
              d.note as remark,
              u.account as username, 
              u.phone, 
              u.money as current_balance 
       FROM fa_downmark d 
       JOIN fa_user u ON d.user_id = u.id 
       WHERE ${whereClause} 
       ORDER BY d.id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return success(res, 'Lấy danh sách rút tiền thành công', {
      total,
      rows,
      page,
      limit,
    });
  } catch (err) {
    return error(res, 'Lỗi lấy danh sách rút tiền: ' + err.message);
  }
}

/**
 * Duyệt hoặc từ chối đơn rút tiền
 * Route: POST /api/admin/downmark/check
 */
async function checkDownmark(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id, note } = req.body;
    const rawStatus = req.body.status;
    let status = 'pending';
    if (rawStatus === 1 || rawStatus === '1' || rawStatus === 'approved' || rawStatus === 'pass') {
      status = 'approved';
    } else if (rawStatus === 2 || rawStatus === '2' || rawStatus === 'rejected' || rawStatus === 'refuse') {
      status = 'rejected';
    }

    if (!id || !['approved', 'rejected'].includes(status)) {
      connection.release();
      return error(res, 'Dữ liệu xét duyệt không hợp lệ');
    }

    // Khóa dòng đơn rút tiền
    const [marks] = await connection.query(
      'SELECT * FROM fa_downmark WHERE id = ? FOR UPDATE',
      [id]
    );

    if (marks.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Không tìm thấy đơn rút tiền');
    }

    const mark = marks[0];
    if (mark.status !== 'pending') {
      await connection.rollback();
      connection.release();
      return error(res, `Đơn này đã được xử lý trước đó (${mark.status})`);
    }

    const withdrawAmount = parseFloat(mark.amount);

    // Lấy thông tin user
    const [users] = await connection.query(
      'SELECT id, money, freeze_funds FROM fa_user WHERE id = ? FOR UPDATE',
      [mark.user_id]
    );

    if (users.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Hội viên không tồn tại');
    }

    const user = users[0];
    const currentFreeze = parseFloat(user.freeze_funds || 0);
    const newFreeze = Math.max(0, currentFreeze - withdrawAmount);

    if (status === 'approved') {
      // 1. Phê duyệt thành công: Trừ số tiền đóng băng
      await connection.query(
        'UPDATE fa_user SET freeze_funds = ? WHERE id = ?',
        [newFreeze, mark.user_id]
      );

      // Cập nhật đơn rút
      await connection.query(
        `UPDATE fa_downmark SET status = 'approved', check_admin_id = ?, check_time = NOW(), note = ? WHERE id = ?`,
        [req.admin.id, note || '审核通过', id]
      );
    } else {
      // 2. Từ chối: Hoàn lại tiền vào số dư khả dụng và giảm đóng băng
      const currentBalance = parseFloat(user.money);
      const refundedBalance = currentBalance + withdrawAmount;

      await connection.query(
        'UPDATE fa_user SET money = ?, usdt = ?, freeze_funds = ? WHERE id = ?',
        [refundedBalance, refundedBalance, newFreeze, mark.user_id]
      );

      // Ghi sổ cái hoàn tiền
      await connection.query(
        `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, ext_id, created_at)
         VALUES (?, 'USDT', 'withdraw_refund', ?, ?, ?, ?, ?, NOW())`,
        [mark.user_id, withdrawAmount, currentBalance, refundedBalance, `提现失败退款 (${note || '拒绝'})`, id]
      );

      // Cập nhật đơn rút
      await connection.query(
        `UPDATE fa_downmark SET status = 'rejected', check_admin_id = ?, check_time = NOW(), note = ? WHERE id = ?`,
        [req.admin.id, note || '提现申请已拒绝', id]
      );
    }

    await connection.commit();
    connection.release();

    return success(res, status === 'approved' ? 'Đã duyệt đơn rút tiền thành công' : 'Đã từ chối và hoàn tiền về số dư hội viên');
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Duyệt đơn rút thất bại: ' + err.message);
  }
}

module.exports = {
  getDownmarks,
  checkDownmark,
};
