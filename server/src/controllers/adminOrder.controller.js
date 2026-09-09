const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách toàn bộ đơn cược cho Admin
 * Route: GET /api/admin/order
 */
async function getOrders(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { status, kong_type, search } = req.query;

    let whereClause = '1=1';
    const params = [];

    if (status && status !== 'Choose') {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    if (kong_type && kong_type !== 'Choose') {
      whereClause += ' AND o.kong_type = ?';
      params.push(kong_type);
    }

    if (search && search.trim()) {
      whereClause += ' AND (u.account LIKE ? OR u.real_name LIKE ? OR o.product_title LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM fa_order o 
       LEFT JOIN fa_user u ON o.user_id = u.id 
       WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT o.*, 
              COALESCE(u.account, u.username, CONCAT('User_', o.user_id)) as username, 
              COALESCE(u.real_name, u.account, '-') as real_name, 
              COALESCE(u.money, 0) as current_balance 
       FROM fa_order o 
       LEFT JOIN fa_user u ON o.user_id = u.id 
       WHERE ${whereClause} 
       ORDER BY o.id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return success(res, 'Lấy danh sách đơn cược thành công', {
      total,
      rows,
      page,
      limit,
    });
  } catch (err) {
    return error(res, 'Lỗi lấy danh sách đơn cược: ' + err.message);
  }
}

/**
 * Can thiệp kết quả đơn cược (Win / Loss / Default)
 * Route: POST /api/admin/order/control
 */
async function controlOrder(req, res) {
  try {
    const orderId = req.body.orderId || req.body.id;
    let kong_type = req.body.kong_type || req.body.controlResult;
    if (kong_type === 'lose') kong_type = 'loss';

    if (!orderId || !['default', 'win', 'loss', 'closed'].includes(kong_type)) {
      return error(res, 'Tham số can thiệp không hợp lệ');
    }

    const [result] = await pool.query(
      `UPDATE fa_order SET kong_type = ? WHERE id = ?`,
      [kong_type, orderId]
    );

    if (result.affectedRows === 0) {
      return error(res, 'Không thể can thiệp (lệnh không tồn tại)');
    }

    return success(res, `Đã đặt chế độ can thiệp cho lệnh: ${kong_type.toUpperCase()}`);
  } catch (err) {
    return error(res, 'Can thiệp thất bại: ' + err.message);
  }
}

module.exports = {
  getOrders,
  controlOrder,
};
