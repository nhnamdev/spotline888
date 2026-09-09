const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { error } = require('../utils/response');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Vui lòng đăng nhập để tiếp tục', null, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'spotline888_fortrade_user_jwt_secret_key_2026');

    // Lấy thông tin user mới nhất từ DB
    const [users] = await pool.query(
      `SELECT id, account, username, real_name, phone, email, avatar, 
              money, usdt, freeze_funds, yuebao_balance, credit_score, 
              level, invite_code, status, fund_status, is_auth 
       FROM fa_user WHERE id = ?`,
      [decoded.id]
    );

    if (users.length === 0) {
      return error(res, 'Tài khoản không tồn tại', null, 401);
    }

    const user = users[0];
    if (user.status !== 1) {
      return error(res, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ CSKH.', null, 403);
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ', null, 401);
  }
}

module.exports = authMiddleware;
