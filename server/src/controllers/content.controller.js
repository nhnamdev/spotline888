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

    // Lấy cấu hình tin nhắn chào mừng từ fa_config
    const [cfgRows] = await pool.query(
      "SELECT name, value FROM fa_config WHERE name IN ('register_message_enable', 'register_message_content', 'web_name', 'name')"
    );
    const cfgMap = {};
    cfgRows.forEach((r) => {
      cfgMap[r.name] = r.value;
    });

    const siteName = cfgMap['web_name'] || cfgMap['name'] || 'Fortrade';
    const isMsgEnabled = cfgMap['register_message_enable'] !== '0';
    const welcomeTitle = `Welcome to ${siteName}`;
    const welcomeContent = cfgMap['register_message_content'] || 
      `Welcome to ${siteName}! Thank you for choosing our platform. If you have any questions, please feel free to contact online customer service.`;

    // Cập nhật các tin nhắn cũ từ SPOT sang Fortrade
    await pool.query(
      `UPDATE fa_message 
       SET title = REPLACE(title, 'SPOT', ?), 
           content = REPLACE(content, 'SPOT', ?) 
       WHERE user_id = ? AND (title LIKE '%SPOT%' OR content LIKE '%SPOT%')`,
      [siteName, siteName, userId]
    );

    const [rows] = await pool.query(
      `SELECT id, title, content, is_read, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as date 
       FROM fa_message 
       WHERE user_id = ? OR user_id = 0 
       ORDER BY id DESC`,
      [userId]
    );

    // Nếu chưa có tin nhắn nào và cấu hình cho phép, tạo tin nhắn chào mừng theo cấu hình Admin
    if (rows.length === 0) {
      if (isMsgEnabled) {
        await pool.query(
          `INSERT INTO fa_message (user_id, title, content, is_read, created_at) VALUES 
           (?, ?, ?, 0, NOW()),
           (?, 'Security Reminder', 'Security Reminder: Do not disclose your login password or withdrawal fund password to anyone.', 1, NOW())`,
          [userId, welcomeTitle, welcomeContent, userId]
        );
      }
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
       WHERE name IN (
         'name', 'web_name', 'currency_code', 'currency_short', 'currency_name',
         'kefu_url', 'kefu_script', 'usdt_cny_rate', 'web_icon', 'company_desc',
         'invite_code_enable', 'alert_notice', 'trade_time', 'version', 'quick_amounts'
       )`
    );

    const config = {};
    rows.forEach((r) => {
      config[r.name] = r.value;
    });

    const activeKefuUrl = config['kefu_url'] || config['kefu_script'] || 'https://wa.me/447838456993';

    return success(res, 'Lấy cấu hình thành công', {
      site_name: config['web_name'] || config['name'] || 'Fortrade',
      currency: config['currency_code'] || 'USD',
      currency_symbol: config['currency_short'] || '$',
      currency_name: config['currency_name'] || 'US Dollar',
      kefu_url: activeKefuUrl,
      kefu_script: config['kefu_script'] || activeKefuUrl,
      usdt_rate: parseFloat(config['usdt_cny_rate'] || '4.07'),
      company_desc: config['company_desc'] || '',
      invite_code_enable: config['invite_code_enable'] || '0',
      alert_notice: config['alert_notice'] || '',
      trade_time: config['trade_time'] || '00:00-24:00',
      version: config['version'] || '1.0.65',
      quick_amounts: config['quick_amounts'] || '100,500,1000,2000,5000,10000',
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
