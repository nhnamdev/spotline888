const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách thông báo cho Admin
 * Route: GET /api/admin/notice
 */
async function getNotices(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id, type, title, url, short_content, content, \`rank\`, status,
             DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as ctime,
             DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as rtime
      FROM fa_notice
      ORDER BY \`rank\` DESC, id DESC
    `);
    return success(res, 'Lấy danh sách thông báo thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm hoặc sửa thông báo
 * Route: POST /api/admin/notice
 */
async function saveNotice(req, res) {
  try {
    const { id, type = 1, title, url = null, short_content = '', content = '', rank = 1000, status = 1 } = req.body;

    if (!title || !title.trim()) {
      return error(res, 'Vui lòng nhập tiêu đề thông báo');
    }

    if (id) {
      await pool.query(`
        UPDATE fa_notice 
        SET type = ?, title = ?, url = ?, short_content = ?, content = ?, \`rank\` = ?, status = ?, updated_at = NOW()
        WHERE id = ?
      `, [Number(type), title.trim(), url, short_content, content, Number(rank), Number(status), id]);
      return success(res, 'Cập nhật thông báo thành công');
    } else {
      const [result] = await pool.query(`
        INSERT INTO fa_notice (type, title, url, short_content, content, \`rank\`, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `, [Number(type), title.trim(), url, short_content, content, Number(rank), Number(status)]);
      return success(res, 'Thêm thông báo thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lưu thông báo thất bại: ' + err.message);
  }
}

/**
 * Xóa thông báo
 * Route: DELETE /api/admin/notice/:id
 */
async function deleteNotice(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_notice WHERE id = ?', [id]);
    return success(res, 'Đã xóa thông báo thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getNotices,
  saveNotice,
  deleteNotice,
};
