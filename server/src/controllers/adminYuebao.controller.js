const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách đơn gửi quỹ Yu'e Bao cho Admin
 * Route: GET /api/admin/yuebao-order
 */
async function getYuebaoOrders(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM fa_yuebao_order');
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT o.*, 
              COALESCE(u.account, u.username, CONCAT('User_', o.user_id)) as username, 
              COALESCE(u.real_name, u.account, '-') as real_name 
       FROM fa_yuebao_order o 
       LEFT JOIN fa_user u ON o.user_id = u.id 
       ORDER BY o.id DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return success(res, 'Lấy danh sách lệnh Yu\'e Bao thành công', { total, rows, page, limit });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Lấy danh sách cấu hình gói Yu'e Bao cho Admin
 * Route: GET /api/admin/yuebao-config
 */
async function getYuebaoConfigs(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM fa_yuebao_config ORDER BY day ASC');
    return success(res, 'Lấy cấu hình Yu\'e Bao thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm hoặc cập nhật cấu hình gói Yu'e Bao
 * Route: POST /api/admin/yuebao-config
 */
async function saveYuebaoConfig(req, res) {
  try {
    const { id, title, day, radio, min_rate, max_rate, min_money, status = 1 } = req.body;

    if (!title || !day) {
      return error(res, 'Vui lòng điền đủ tiêu đề và số ngày');
    }

    if (id) {
      await pool.query(
        `UPDATE fa_yuebao_config 
         SET title = ?, day = ?, radio = ?, min_rate = ?, max_rate = ?, min_money = ?, status = ? 
         WHERE id = ?`,
        [title, day, radio || '', min_rate || 0.01, max_rate || 0.02, min_money || '', status, id]
      );
      return success(res, 'Cập nhật cấu hình thành công');
    } else {
      const [result] = await pool.query(
        `INSERT INTO fa_yuebao_config (title, day, radio, min_rate, max_rate, min_money, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [title, day, radio || '', min_rate || 0.01, max_rate || 0.02, min_money || '', status]
      );
      return success(res, 'Thêm cấu hình thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lưu cấu hình thất bại: ' + err.message);
  }
}

/**
 * Xóa cấu hình gói Yu'e Bao
 * Route: DELETE /api/admin/yuebao-config/:id
 */
async function deleteYuebaoConfig(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_yuebao_config WHERE id = ?', [id]);
    return success(res, 'Đã xóa cấu hình thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getYuebaoOrders,
  getYuebaoConfigs,
  saveYuebaoConfig,
  deleteYuebaoConfig,
};
