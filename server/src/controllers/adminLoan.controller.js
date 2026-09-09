const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách hồ sơ vay cho Admin
 * Route: GET /api/admin/loan-record
 */
async function getLoanRecords(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { status, search } = req.query;

    let whereClause = '1=1';
    const params = [];

    if (status !== undefined && status !== '' && status !== 'Choose') {
      whereClause += ' AND r.status = ?';
      params.push(Number(status));
    }

    if (search && search.trim()) {
      whereClause += ' AND (u.account LIKE ? OR u.real_name LIKE ? OR c.name LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM fa_loan_record r 
       JOIN fa_user u ON r.user_id = u.id 
       LEFT JOIN fa_loan_config c ON r.config_id = c.id 
       WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT r.*, u.account, u.real_name, c.name as configName, 
              DATE_FORMAT(r.borrow_time, '%Y-%m-%d %H:%i:%s') as borrowTime,
              DATE_FORMAT(r.due_time, '%Y-%m-%d %H:%i:%s') as dueTime,
              DATE_FORMAT(r.repay_time, '%Y-%m-%d %H:%i:%s') as repayTime,
              r.remaining_days as remainingDays,
              r.total_repay as totalRepay
       FROM fa_loan_record r 
       JOIN fa_user u ON r.user_id = u.id 
       LEFT JOIN fa_loan_config c ON r.config_id = c.id 
       WHERE ${whereClause} 
       ORDER BY r.id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return success(res, 'Lấy danh sách hồ sơ vay thành công', { total, rows, page, limit });
  } catch (err) {
    return error(res, 'Lỗi lấy danh sách vay: ' + err.message);
  }
}

/**
 * Thao tác duyệt giải ngân hoặc từ chối hồ sơ vay
 * Route: POST /api/admin/loan-record/action
 */
async function actionLoanRecord(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id, action } = req.body; // action: 'disburse' (duyệt giải ngân), 'reject' (từ chối), 'repay' (tất toán)

    const [records] = await connection.query(
      'SELECT * FROM fa_loan_record WHERE id = ? FOR UPDATE',
      [id]
    );

    if (records.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Không tìm thấy hồ sơ vay');
    }

    const rec = records[0];

    if (action === 'disburse') {
      if (rec.status !== 0) {
        await connection.rollback();
        connection.release();
        return error(res, 'Hồ sơ này không ở trạng thái chờ duyệt');
      }

      // Cộng tiền giải ngân vào tài khoản user
      const [users] = await connection.query(
        'SELECT id, money FROM fa_user WHERE id = ? FOR UPDATE',
        [rec.user_id]
      );

      const currentMoney = parseFloat(users[0].money);
      const disburseAmount = parseFloat(rec.amount);
      const newMoney = currentMoney + disburseAmount;

      await connection.query('UPDATE fa_user SET money = ? WHERE id = ?', [newMoney, rec.user_id]);

      // Ghi sổ cái
      await connection.query(
        `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, ext_id, created_at)
         VALUES (?, 'MYR', 'loan_disburse', ?, ?, ?, ?, ?, NOW())`,
        [rec.user_id, disburseAmount, currentMoney, newMoney, `Giải ngân khoản vay thành công (+${disburseAmount.toFixed(2)})`, rec.id]
      );

      // Cập nhật hồ sơ vay sang trạng thái 1 (đang vay)
      await connection.query(
        `UPDATE fa_loan_record 
         SET status = 1, borrow_time = NOW(), due_time = DATE_ADD(NOW(), INTERVAL ? DAY), audit_admin_id = ? 
         WHERE id = ?`,
        [rec.days, req.admin.id, id]
      );
    } else if (action === 'reject') {
      await connection.query(
        `UPDATE fa_loan_record SET status = 4, audit_admin_id = ? WHERE id = ?`,
        [req.admin.id, id]
      );
    } else if (action === 'repay') {
      // Đánh dấu đã trả nợ tất toán
      await connection.query(
        `UPDATE fa_loan_record SET status = 2, repay_time = NOW(), remaining_days = 0 WHERE id = ?`,
        [id]
      );
    }

    await connection.commit();
    connection.release();

    return success(res, 'Thao tác hồ sơ vay thành công');
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Thao tác thất bại: ' + err.message);
  }
}

/**
 * Quản lý Cấu hình gói vay
 * Route: GET /api/admin/loan-config
 */
async function getLoanConfigs(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM fa_loan_config ORDER BY weigh ASC');
    return success(res, 'Lấy danh sách cấu hình vay thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm hoặc sửa gói vay
 * Route: POST /api/admin/loan-config
 */
async function saveLoanConfig(req, res) {
  try {
    const { id, name, days, daily_rate, min_amount, max_amount, weigh = 1, status = 1 } = req.body;

    if (!name || !days) {
      return error(res, 'Vui lòng nhập tên gói và số ngày vay');
    }

    if (id) {
      await pool.query(
        `UPDATE fa_loan_config 
         SET name = ?, days = ?, daily_rate = ?, min_amount = ?, max_amount = ?, weigh = ?, status = ? 
         WHERE id = ?`,
        [name, days, daily_rate, min_amount, max_amount, weigh, status, id]
      );
      return success(res, 'Cập nhật cấu hình vay thành công');
    } else {
      const [result] = await pool.query(
        `INSERT INTO fa_loan_config (name, days, daily_rate, min_amount, max_amount, weigh, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [name, days, daily_rate, min_amount, max_amount, weigh, status]
      );
      return success(res, 'Thêm cấu hình vay thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lưu cấu hình thất bại: ' + err.message);
  }
}

/**
 * Xóa gói vay
 * Route: DELETE /api/admin/loan-config/:id
 */
async function deleteLoanConfig(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_loan_config WHERE id = ?', [id]);
    return success(res, 'Đã xóa gói vay thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getLoanRecords,
  actionLoanRecord,
  getLoanConfigs,
  saveLoanConfig,
  deleteLoanConfig,
};
