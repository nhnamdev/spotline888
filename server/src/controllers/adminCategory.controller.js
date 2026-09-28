const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách banner / category cho Admin
 * Route: GET /api/admin/category
 */
async function getCategories(req, res) {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM fa_category WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY weigh DESC, id DESC';

    const [rows] = await pool.query(query, params);
    return success(res, 'Lấy danh sách thành công', rows);
  } catch (err) {
    return error(res, 'Lỗi lấy danh mục: ' + err.message);
  }
}

/**
 * Thêm mới hoặc cập nhật banner / category
 * Route: POST /api/admin/category
 */
async function saveCategory(req, res) {
  try {
    const { id, pid = 0, type = 'banner', name, image, url = '', weigh = 0, status = 'normal' } = req.body;

    if (!name || !name.trim()) {
      return error(res, 'Tên danh mục không được để trống');
    }

    if (id) {
      // Cập nhật
      await pool.query(
        `UPDATE fa_category 
         SET pid = ?, type = ?, name = ?, image = ?, url = ?, weigh = ?, status = ?, updated_at = NOW() 
         WHERE id = ?`,
        [Number(pid) || 0, type, name.trim(), image || '', url || '', Number(weigh) || 0, status, Number(id)]
      );
      return success(res, 'Cập nhật danh mục thành công', { id: Number(id) });
    } else {
      // Thêm mới
      const [result] = await pool.query(
        `INSERT INTO fa_category (pid, type, name, image, url, weigh, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [Number(pid) || 0, type, name.trim(), image || '', url || '', Number(weigh) || 0, status]
      );
      return success(res, 'Thêm mới danh mục thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lỗi lưu danh mục: ' + err.message);
  }
}

/**
 * Cập nhật category theo ID
 * Route: PUT /api/admin/category/:id
 */
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { pid = 0, type = 'banner', name, image, url = '', weigh = 0, status = 'normal' } = req.body;

    if (!name || !name.trim()) {
      return error(res, 'Tên danh mục không được để trống');
    }

    await pool.query(
      `UPDATE fa_category 
       SET pid = ?, type = ?, name = ?, image = ?, url = ?, weigh = ?, status = ?, updated_at = NOW() 
       WHERE id = ?`,
      [Number(pid) || 0, type, name.trim(), image || '', url || '', Number(weigh) || 0, status, Number(id)]
    );

    return success(res, 'Cập nhật danh mục thành công', { id: Number(id) });
  } catch (err) {
    return error(res, 'Lỗi cập nhật danh mục: ' + err.message);
  }
}

/**
 * Xóa category theo ID
 * Route: DELETE /api/admin/category/:id
 */
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    if (!id) return error(res, 'Thiếu ID danh mục');

    await pool.query('DELETE FROM fa_category WHERE id = ?', [Number(id)]);
    return success(res, 'Xóa danh mục thành công');
  } catch (err) {
    return error(res, 'Lỗi xóa danh mục: ' + err.message);
  }
}

/**
 * Bật / Tắt trạng thái normal / hidden
 * Route: POST /api/admin/category/toggle-status
 */
async function toggleStatus(req, res) {
  try {
    const { id, status } = req.body;
    if (!id) return error(res, 'Thiếu ID danh mục');

    const newStatus = status === 'hidden' ? 'hidden' : 'normal';
    await pool.query('UPDATE fa_category SET status = ?, updated_at = NOW() WHERE id = ?', [newStatus, Number(id)]);
    return success(res, 'Cập nhật trạng thái thành công');
  } catch (err) {
    return error(res, 'Lỗi cập nhật trạng thái: ' + err.message);
  }
}

module.exports = {
  getCategories,
  saveCategory,
  updateCategory,
  deleteCategory,
  toggleStatus,
};
