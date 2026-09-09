const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách tệp đính kèm cho Admin
 * Route: GET /api/admin/attachment
 */
async function getAttachments(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM fa_attachment');
    const total = countResult[0].total;

    const [rows] = await pool.query(`
      SELECT id, admin_id, user_id, url, imagewidth, imageheight, imagetype, imageframes,
             filesize, mimetype, extparam, storage, sha1,
             UNIX_TIMESTAMP(created_at) as createtime,
             UNIX_TIMESTAMP(updated_at) as updatetime,
             UNIX_TIMESTAMP(created_at) as uploadtime,
             url as fullurl
      FROM fa_attachment
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    return success(res, 'Lấy danh sách tệp đính kèm thành công', { total, rows, page, limit });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Xóa tệp đính kèm
 * Route: DELETE /api/admin/attachment/:id
 */
async function deleteAttachment(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_attachment WHERE id = ?', [id]);
    return success(res, 'Đã xóa tệp đính kèm thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getAttachments,
  deleteAttachment,
};
