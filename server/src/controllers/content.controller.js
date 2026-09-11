const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách banner trang chủ
 * Route: GET /api/content/banners
 */
async function getBanners(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, image, url, weigh 
       FROM fa_category 
       WHERE type = 'banner' AND status = 'normal' 
       ORDER BY weigh DESC, id DESC`
    );

    // Nếu chưa có, tự động seed banner
    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO fa_category (type, name, image, weigh, status) VALUES 
        ('banner', 'Banner 1', '/uploads/20251210/8a7d4cc4edbf1cdb3930b5ff016135f0.jpg', 1, 'normal'),
        ('banner', 'Banner 2', '/uploads/20251210/777d251a0c52a4e2f4fe5f35d7e69434.jpg', 2, 'normal'),
        ('banner', 'Banner 3', '/uploads/20251210/08eb6192fb91135fd27da0022175af7a.jpg', 3, 'normal')
      `);
      const [seeded] = await pool.query("SELECT * FROM fa_category WHERE type = 'banner' ORDER BY weigh DESC");
      return success(res, 'Lấy danh sách banner thành công', seeded);
    }

    return success(res, 'Lấy danh sách banner thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Lấy danh sách tin tức, thông báo, chính sách bảo mật
 * Route: GET /api/content/notices
 */
async function getNotices(req, res) {
  try {
    const { type } = req.query; // 1: tin tức/thông báo, 2: giới thiệu, 3: chính sách riêng tư
    let query = 'SELECT id, type, title, short_content, content, created_at FROM fa_notice WHERE status = 1';
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(Number(type));
    }

    query += ' ORDER BY `rank` DESC, id DESC';

    const [rows] = await pool.query(query, params);
    return success(res, 'Lấy danh sách thông báo thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Lấy danh sách tin nhắn hộp thư của User
 * Route: GET /api/user/messages
 */
async function getUserMessages(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, title, content, is_read, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as date 
       FROM fa_message 
       WHERE user_id = ? OR user_id = 0 
       ORDER BY id DESC`,
      [userId]
    );

    // Nếu chưa có tin nhắn nào, tạo tin nhắn chào mừng mặc định
    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO fa_message (user_id, title, content, is_read, created_at) VALUES 
         (?, 'Welcome to SPOT', 'Welcome to SPOT! Thank you for choosing our platform. If you have any questions, please feel free to contact online customer service.', 0, NOW()),
         (?, 'Security Reminder', 'Security Reminder: Do not disclose your login password or withdrawal fund password to anyone.', 1, NOW())`,
        [userId, userId]
      );
      const [seeded] = await pool.query(
        `SELECT id, title, content, is_read, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as date FROM fa_message WHERE user_id = ? ORDER BY id DESC`,
        [userId]
      );
      return success(res, 'Lấy danh sách tin nhắn thành công', seeded);
    }

    return success(res, 'Lấy danh sách tin nhắn thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Đánh dấu toàn bộ tin nhắn đã đọc
 * Route: POST /api/user/messages/read-all
 */
async function markMessagesAsRead(req, res) {
  try {
    const userId = req.user.id;
    await pool.query('UPDATE fa_message SET is_read = 1 WHERE user_id = ? OR user_id = 0', [userId]);
    return success(res, 'Đã đánh dấu tất cả là đã đọc');
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Lấy cấu hình công khai toàn trang (Logo, Tên sàn, Hotline CSKH, Tỷ giá)
 * Route: GET /api/config/public
 */
async function getPublicConfig(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT name, value FROM fa_config 
       WHERE name IN ('name', 'web_name', 'currency_code', 'currency_short', 'kefu_url', 'usdt_cny_rate', 'web_icon', 'company_desc')`
    );

    const config = {};
    rows.forEach((r) => {
      config[r.name] = r.value;
    });

    return success(res, 'Lấy cấu hình thành công', {
      site_name: config['web_name'] || config['name'] || 'SPOTLINE888',
      currency: config['currency_code'] || 'MYR',
      currency_symbol: config['currency_short'] || 'RM',
      kefu_url: config['kefu_url'] || 'https://wa.me/6287713795721',
      usdt_rate: parseFloat(config['usdt_cny_rate'] || '4.07'),
      company_desc: config['company_desc'] || '',
    });
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getBanners,
  getNotices,
  getUserMessages,
  markMessagesAsRead,
  getPublicConfig,
};
