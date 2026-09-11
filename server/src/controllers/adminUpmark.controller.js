const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách đơn nạp tiền cho Admin
 * Route: GET /api/admin/upmark
 */
async function getUpmarks(req, res) {
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
      whereClause += ' AND m.status = ?';
      params.push(dbStatus);
    }

    if (search && search.trim()) {
      whereClause += ' AND (m.order_sn LIKE ? OR u.account LIKE ? OR u.real_name LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM fa_upmark m 
       JOIN fa_user u ON m.user_id = u.id 
       WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT m.*, u.account as username, u.real_name, u.money as current_balance 
       FROM fa_upmark m 
       JOIN fa_user u ON m.user_id = u.id 
       WHERE ${whereClause} 
       ORDER BY m.id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return success(res, 'Lấy danh sách nạp tiền thành công', {
      total,
      rows,
      page,
      limit,
    });
  } catch (err) {
    return error(res, 'Lỗi lấy danh sách nạp tiền: ' + err.message);
  }
}

/**
 * Duyệt hoặc từ chối đơn nạp tiền
 * Route: POST /api/admin/upmark/check
 */
async function checkUpmark(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.body;
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

    // Khóa đơn nạp tiền
    const [marks] = await connection.query(
      'SELECT * FROM fa_upmark WHERE id = ? FOR UPDATE',
      [id]
    );

    if (marks.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Không tìm thấy đơn nạp tiền');
    }

    const mark = marks[0];
    if (mark.status !== 'pending') {
      await connection.rollback();
      connection.release();
      return error(res, `Đơn này đã được xử lý trước đó (${mark.status})`);
    }

    const adminName = `${req.admin.username}(管理编号:${req.admin.id})`;

    if (status === 'approved') {
      // 1. Cộng tiền vào tài khoản user
      const [users] = await connection.query(
        'SELECT id, money FROM fa_user WHERE id = ? FOR UPDATE',
        [mark.user_id]
      );

      if (users.length === 0) {
        await connection.rollback();
        connection.release();
        return error(res, 'Hội viên không tồn tại');
      }

      const beforeBalance = parseFloat(users[0].money);
      const addMoney = parseFloat(mark.money);
      const afterBalance = beforeBalance + addMoney;

      await connection.query(
        'UPDATE fa_user SET money = ? WHERE id = ?',
        [afterBalance, mark.user_id]
      );

      // 2. Ghi sổ cái fa_user_money_log
      await connection.query(
        `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, ext_id, created_at)
         VALUES (?, 'MYR', 'recharge', ?, ?, ?, ?, ?, NOW())`,
        [mark.user_id, addMoney, beforeBalance, afterBalance, `充值成功 (订单号: ${mark.order_sn})`, mark.id]
      );

      // 3. Cập nhật đơn nạp
      await connection.query(
        `UPDATE fa_upmark SET status = 'approved', balance = ?, check_account = ?, check_time = NOW() WHERE id = ?`,
        [afterBalance, adminName, id]
      );
    } else {
      // Từ chối nạp tiền
      await connection.query(
        `UPDATE fa_upmark SET status = 'rejected', check_account = ?, check_time = NOW() WHERE id = ?`,
        [adminName, id]
      );
    }

    await connection.commit();
    connection.release();

    return success(res, status === 'approved' ? 'Đã duyệt đơn nạp tiền thành công' : 'Đã từ chối đơn nạp tiền');
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Duyệt đơn nạp thất bại: ' + err.message);
  }
}

module.exports = {
  getUpmarks,
  checkUpmark,
};
