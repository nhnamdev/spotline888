const { pool } = require('../config/db');
const { success, error } = require('../utils/response');
const { getPublicUrl } = require('../utils/r2');

/**
 * Lấy danh sách sản phẩm cho Admin
 * Route: GET /api/admin/product
 */
async function getProducts(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM fa_product');
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT p.*, t.name as type_name 
       FROM fa_product p 
       LEFT JOIN fa_product_type t ON p.type_id = t.id 
       ORDER BY p.weigh DESC, p.id DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return success(res, 'Lấy danh sách sản phẩm thành công', { total, rows, page, limit });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm hoặc sửa sản phẩm
 * Route: POST /api/admin/product
 */
async function saveProduct(req, res) {
  try {
    const { id, code, title, type_id = 1, price = 0, image, weigh = 0, is_open = 1, status = 1 } = req.body;

    if (!code || !title) {
      return error(res, 'Vui lòng nhập mã và tiêu đề sản phẩm');
    }

    const finalImage = image ? getPublicUrl(image) : null;

    if (id) {
      // Cập nhật
      await pool.query(
        `UPDATE fa_product 
         SET code = ?, title = ?, type_id = ?, price = ?, image = ?, weigh = ?, is_open = ?, status = ?, updated_at = NOW() 
         WHERE id = ?`,
        [code.trim(), title.trim(), type_id, price, finalImage, weigh, is_open, status, id]
      );
      return success(res, 'Cập nhật sản phẩm thành công');
    } else {
      // Thêm mới
      const [result] = await pool.query(
        `INSERT INTO fa_product (code, title, type_id, price, image, weigh, is_open, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [code.trim(), title.trim(), type_id, price, finalImage, weigh, is_open, status]
      );
      return success(res, 'Thêm sản phẩm thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lưu sản phẩm thất bại: ' + err.message);
  }
}

/**
 * Xóa sản phẩm
 * Route: DELETE /api/admin/product/:id
 */
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_product WHERE id = ?', [id]);
    return success(res, 'Đã xóa sản phẩm thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Quản lý Phân loại sản phẩm (Product Types)
 * Route: GET /api/admin/product-type
 */
async function getProductTypes(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM fa_product_type ORDER BY `rank` DESC, id ASC');
    if (rows.length === 0) {
      // Seed mặc định
      await pool.query(`
        INSERT INTO fa_product_type (id, name, rank, status) VALUES 
        (1, 'Tiền mã hóa (Crypto)', 1000, 1),
        (2, 'Ngoại hối (Forex)', 1000, 1),
        (3, 'Hàng hóa (Commodities)', 1000, 1)
      `);
      const [seeded] = await pool.query('SELECT * FROM fa_product_type ORDER BY `rank` DESC');
      return success(res, 'Lấy danh mục thành công', seeded);
    }
    return success(res, 'Lấy phân loại sản phẩm thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm hoặc sửa phân loại sản phẩm
 * Route: POST /api/admin/product-type
 */
async function saveProductType(req, res) {
  try {
    const { id, name, rank = 1000, status = 1 } = req.body;
    if (!name || !name.trim()) {
      return error(res, 'Vui lòng nhập tên phân loại');
    }

    if (id) {
      await pool.query(
        'UPDATE fa_product_type SET name = ?, `rank` = ?, status = ?, updated_at = NOW() WHERE id = ?',
        [name.trim(), Number(rank), Number(status), id]
      );
      return success(res, 'Cập nhật phân loại thành công');
    } else {
      const [result] = await pool.query(
        'INSERT INTO fa_product_type (name, `rank`, status, created_at) VALUES (?, ?, ?, NOW())',
        [name.trim(), Number(rank), Number(status)]
      );
      return success(res, 'Thêm phân loại thành công', { id: result.insertId });
    }
  } catch (err) {
    return error(res, 'Lưu phân loại thất bại: ' + err.message);
  }
}

/**
 * Xóa phân loại sản phẩm
 * Route: DELETE /api/admin/product-type/:id
 */
async function deleteProductType(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_product_type WHERE id = ?', [id]);
    return success(res, 'Xóa phân loại thành công');
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getProducts,
  saveProduct,
  deleteProduct,
  getProductTypes,
  saveProductType,
  deleteProductType,
};

