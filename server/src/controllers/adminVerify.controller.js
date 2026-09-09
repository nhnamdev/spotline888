const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách hồ sơ KYC cho Admin
 * Route: GET /api/admin/verify
 */
async function getVerifies(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { status, search } = req.query;

    let whereClause = '1=1';
    const params = [];

    if (status !== undefined && status !== '' && status !== 'Choose' && status !== 'all') {
      let dbStatus = Number(status);
      if (status === 'pending' || status === '0' || status === 0) dbStatus = 1;
      if (status === 'approved') dbStatus = 2;
      if (status === 'rejected') dbStatus = 3;
      whereClause += ' AND v.status = ?';
      params.push(dbStatus);
    }

    if (search && search.trim()) {
      whereClause += ' AND (u.account LIKE ? OR v.real_name LIKE ? OR v.id_card LIKE ? OR u.phone LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword, keyword);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total 
       FROM fa_user_verify v 
       LEFT JOIN fa_user u ON v.user_id = u.id 
       WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT v.*, 
              COALESCE(u.account, u.username, v.real_name) as account, 
              COALESCE(u.phone, v.id_card, '-') as phone, 
              COALESCE(u.money, 0) as money, 
              COALESCE(u.usdt, 0) as usdt, 
              COALESCE(u.credit_score, 100) as credit_score, 
              u.avatar
       FROM fa_user_verify v
       LEFT JOIN fa_user u ON v.user_id = u.id
       WHERE ${whereClause}
       ORDER BY v.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return success(res, 'Lấy danh sách hồ sơ KYC thành công', {
      total,
      rows,
      page,
      limit,
    });
  } catch (err) {
    return error(res, 'Lỗi lấy danh sách xác minh: ' + err.message);
  }
}

/**
 * Duyệt hoặc từ chối hồ sơ KYC
 * Route: POST /api/admin/verify/audit
 */
async function auditVerify(req, res) {
  try {
    const targetId = req.body.verifyId || req.body.id;
    const rawStatus = req.body.status;
    const error_reason = req.body.error_reason || req.body.remark;

    let auditStatus = 2; // mặc định duyệt thành công
    if (rawStatus === 1 || rawStatus === '1' || rawStatus === 2 || rawStatus === '2' || rawStatus === 'approved' || rawStatus === 'pass') {
      auditStatus = 2;
    } else if (rawStatus === 3 || rawStatus === '3' || rawStatus === 'rejected' || rawStatus === 'refuse') {
      auditStatus = 3;
    }

    if (!targetId) {
      return error(res, 'Vui lòng cung cấp ID hồ sơ xác minh');
    }

    const [rows] = await pool.query('SELECT user_id, real_name FROM fa_user_verify WHERE id = ?', [targetId]);
    if (rows.length === 0) {
      return error(res, 'Hồ sơ xác minh không tồn tại');
    }

    const { user_id, real_name } = rows[0];

    await pool.query(
      `UPDATE fa_user_verify 
       SET status = ?, error_reason = ?, audit_admin_id = ?, audit_time = NOW(), updated_at = NOW() 
       WHERE id = ?`,
      [auditStatus, auditStatus === 3 ? (error_reason || 'Thông tin không khớp') : null, req.admin.id, targetId]
    );

    // Cập nhật trạng thái người dùng
    await pool.query(
      `UPDATE fa_user SET is_auth = ?, real_name = ? WHERE id = ?`,
      [auditStatus, real_name, user_id]
    );

    return success(res, auditStatus === 2 ? 'Đã duyệt hồ sơ KYC thành công' : 'Đã từ chối hồ sơ KYC');
  } catch (err) {
    return error(res, 'Xét duyệt thất bại: ' + err.message);
  }
}

module.exports = {
  getVerifies,
  auditVerify,
};
