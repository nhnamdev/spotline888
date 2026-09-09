const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { error } = require('../utils/response');

async function adminAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Vui lòng đăng nhập quyền quản trị', null, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'spotline888_fortrade_admin_jwt_secret_key_2026');

    const [admins] = await pool.query(
      `SELECT id, username, nickname, email, avatar, status 
       FROM fa_admin WHERE id = ?`,
      [decoded.id]
    );

    if (admins.length === 0) {
      return error(res, 'Tài khoản quản trị không tồn tại', null, 401);
    }

    const admin = admins[0];
    if (admin.status !== 'normal') {
      return error(res, 'Tài khoản quản trị đã bị vô hiệu hóa', null, 403);
    }

    req.admin = admin;
    next();
  } catch (err) {
    return error(res, 'Phiên quản trị viên đã hết hạn', null, 401);
  }
}

module.exports = adminAuthMiddleware;
