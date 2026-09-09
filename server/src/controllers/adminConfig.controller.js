const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy toàn bộ cấu hình hệ thống
 * Route: GET /api/admin/general/config
 */
async function getAllConfigs(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM fa_config ORDER BY `group` ASC, id ASC');
    const groupMap = {};
    rows.forEach((item) => {
      if (!groupMap[item.group]) groupMap[item.group] = [];
      groupMap[item.group].push(item);
    });
    return success(res, 'Lấy cấu hình thành công', { list: rows, grouped: groupMap });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Cập nhật cấu hình hệ thống
 * Route: POST /api/admin/general/config
 */
async function updateConfigs(req, res) {
  try {
    const configs = req.body; // { min_chongzhi: '100', usdt_cny_rate: '4.07', ... }

    for (const [key, val] of Object.entries(configs)) {
      await pool.query('UPDATE fa_config SET value = ? WHERE name = ?', [String(val), key]);
    }

    return success(res, 'Cập nhật cấu hình thành công');
  } catch (err) {
    return error(res, 'Lỗi cập nhật cấu hình: ' + err.message);
  }
}

/**
 * Quản lý IP Whitelist
 * Route: GET /api/admin/ipwhitelist
 */
async function getIpWhitelist(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM fa_ip_filter WHERE type = 'whitelist' ORDER BY id DESC");
    return success(res, 'Lấy IP whitelist thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm IP Whitelist
 * Route: POST /api/admin/ipwhitelist
 */
async function addIpWhitelist(req, res) {
  try {
    const { ip, remark } = req.body;
    if (!ip) return error(res, 'Vui lòng nhập IP');

    const [result] = await pool.query(
      "INSERT INTO fa_ip_filter (ip, type, remark, status, created_at) VALUES (?, 'whitelist', ?, 1, NOW())",
      [ip.trim(), remark || '']
    );

    return success(res, 'Thêm IP thành công', { id: result.insertId });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Xóa IP Whitelist
 * Route: DELETE /api/admin/ipwhitelist/:id
 */
async function deleteIpWhitelist(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_ip_filter WHERE id = ?', [id]);
    return success(res, 'Đã xóa IP khỏi whitelist');
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getAllConfigs,
  updateConfigs,
  getIpWhitelist,
  addIpWhitelist,
  deleteIpWhitelist,
};
