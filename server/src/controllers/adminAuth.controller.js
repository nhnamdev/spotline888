const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { success, error } = require('../utils/response');
const { getPublicUrl } = require('../utils/r2');
const { comparePassword } = require('../utils/hash');

// Bộ nhớ tạm lưu captcha theo session/token
const captchaStore = new Map();

/**
 * Lấy mã Captcha ngẫu nhiên cho màn hình đăng nhập admin
 * Route: GET /api/admin/captcha
 */
function getCaptcha(req, res) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let captchaCode = '';
  for (let i = 0; i < 4; i++) {
    captchaCode += chars[Math.floor(Math.random() * chars.length)];
  }

  const captchaKey = Math.random().toString(36).substring(2, 10);
  captchaStore.set(captchaKey, {
    code: captchaCode.toLowerCase(),
    expires: Date.now() + 5 * 60 * 1000, // Hết hạn sau 5 phút
  });

  return success(res, 'Tạo captcha thành công', {
    key: captchaKey,
    text: captchaCode,
    code: captchaCode,
  });
}

/**
 * Đăng nhập quản trị viên
 * Route: POST /api/admin/login
 */
async function login(req, res) {
  try {
    const { username, password, captcha, captchaKey, captchaCode } = req.body;
    const inputCaptcha = (captcha || captchaCode || '').toLowerCase().trim();

    if (!username || !username.trim()) {
      return error(res, 'Vui lòng nhập tên đăng nhập');
    }
    if (!password || !password.trim()) {
      return error(res, 'Vui lòng nhập mật khẩu');
    }

    // Kiểm tra captcha nếu có gửi key
    if (captchaKey && captchaStore.has(captchaKey)) {
      const stored = captchaStore.get(captchaKey);
      if (Date.now() > stored.expires) {
        captchaStore.delete(captchaKey);
        return error(res, 'Mã xác nhận đã hết hạn, vui lòng thử lại');
      }
      if (stored.code !== inputCaptcha) {
        return error(res, 'Mã xác nhận không chính xác');
      }
      captchaStore.delete(captchaKey);
    }

    // Tìm tài khoản trong fa_admin
    const [admins] = await pool.query(
      'SELECT * FROM fa_admin WHERE username = ? LIMIT 1',
      [username.trim()]
    );

    if (admins.length === 0) {
      return error(res, 'Tên đăng nhập hoặc mật khẩu không chính xác');
    }

    const admin = admins[0];

    if (admin.status !== 'normal') {
      return error(res, 'Tài khoản quản trị viên này đã bị khóa');
    }

    // So khớp mật khẩu
    const isMatch = await comparePassword(password.trim(), admin.password, admin.salt);
    if (!isMatch) {
      // Tăng số lần đăng nhập sai
      await pool.query('UPDATE fa_admin SET login_failure = login_failure + 1 WHERE id = ?', [admin.id]);
      return error(res, 'Tên đăng nhập hoặc mật khẩu không chính xác');
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Cập nhật thời gian đăng nhập và reset login_failure
    await pool.query(
      `UPDATE fa_admin SET logintime = NOW(), loginip = ?, login_failure = 0 WHERE id = ?`,
      [clientIp, admin.id]
    );

    // Ghi nhật ký vào fa_admin_log
    await pool.query(
      `INSERT INTO fa_admin_log (admin_id, username, url, title, content, ip, useragent, created_at)
       VALUES (?, ?, '/api/admin/login', 'Quản trị viên đăng nhập hệ thống', ?, ?, ?, NOW())`,
      [admin.id, admin.username, JSON.stringify({ ip: clientIp }), clientIp, userAgent]
    );

    // Sinh Admin JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.ADMIN_JWT_SECRET || 'spotline888_fortrade_admin_jwt_secret_key_2026',
      { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1d' }
    );

    const adminPayload = {
      id: admin.id,
      username: admin.username,
      nickname: admin.nickname,
      avatar: admin.avatar ? getPublicUrl(admin.avatar) : getPublicUrl('/sites/spotline888-org/admin-login/avatar.png'),
      email: admin.email,
      token,
    };

    return success(res, 'Đăng nhập trang quản trị thành công', adminPayload);
  } catch (err) {
    console.error('Lỗi đăng nhập quản trị viên:', err);
    return error(res, 'Đăng nhập thất bại: ' + err.message);
  }
}

/**
 * Lấy thông tin cá nhân Admin
 * Route: GET /api/admin/profile
 */
async function getProfile(req, res) {
  try {
    const admin = req.admin;
    return success(res, 'Lấy thông tin quản trị viên thành công', admin);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getCaptcha,
  login,
  getProfile,
};
