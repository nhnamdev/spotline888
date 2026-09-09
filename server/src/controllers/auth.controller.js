const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { success, error } = require('../utils/response');
const { hashPassword, comparePassword } = require('../utils/hash');

/**
 * Đăng ký tài khoản hội viên mới
 * Route: POST /api/login/register
 */
async function register(req, res) {
  try {
    const rawAccount = req.body.account || req.body.username;
    const rawPasswd = req.body.passwd || req.body.password;
    const rawMpasswd = req.body.mpasswd || req.body.fundPassword || rawPasswd;
    const rawPhone = req.body.phone || ('09' + Math.floor(10000000 + Math.random() * 90000000));
    const invitecode = req.body.invitecode || req.body.inviteCode;

    if (!rawAccount || !rawAccount.trim()) {
      return error(res, 'Vui lòng nhập tên tài khoản');
    }
    if (!rawPasswd || !rawPasswd.trim()) {
      return error(res, 'Vui lòng nhập mật khẩu đăng nhập');
    }

    const cleanAccount = rawAccount.trim();
    const cleanPhone = rawPhone.trim();
    const passwd = rawPasswd.trim();
    const mpasswd = rawMpasswd.trim();

    // 1. Kiểm tra tài khoản đã tồn tại chưa
    const [existing] = await pool.query(
      'SELECT id FROM fa_user WHERE account = ? LIMIT 1',
      [cleanAccount]
    );
    if (existing.length > 0) {
      return error(res, 'Tên tài khoản này đã được sử dụng');
    }

    // 2. Kiểm tra mã giới thiệu (nếu có)
    let parentAgentId = 0;
    if (invitecode && invitecode.trim()) {
      const [inviter] = await pool.query(
        'SELECT id FROM fa_user WHERE invite_code = ? LIMIT 1',
        [invitecode.trim()]
      );
      if (inviter.length > 0) {
        parentAgentId = inviter[0].id;
      }
    }

    // 3. Băm mật khẩu
    const hashedPassword = await hashPassword(passwd.trim());
    const hashedMpassword = await hashPassword(mpasswd.trim());

    // 4. Sinh mã mời ngẫu nhiên
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const myInviteCode = 'YH' + Math.floor(100 + Math.random() * 900) + randomSuffix;

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    // 5. Thêm vào database
    const [insertResult] = await pool.query(
      `INSERT INTO fa_user (
        account, username, password, mpassword, phone, 
        money, usdt, freeze_funds, yuebao_balance, 
        credit_score, level, invite_code, agent_id, 
        status, is_auth, reg_ip, reg_time
      ) VALUES (?, ?, ?, ?, ?, 0.00, 0.00, 0.00, 0.00, 100, 1, ?, ?, 1, 0, ?, NOW())`,
      [cleanAccount, cleanAccount, hashedPassword, hashedMpassword, cleanPhone, myInviteCode, parentAgentId, clientIp]
    );

    const newUserId = insertResult.insertId;

    // 6. Sinh token JWT
    const token = jwt.sign(
      { id: newUserId, account: cleanAccount },
      process.env.JWT_SECRET || 'spotline888_fortrade_user_jwt_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const userPayload = {
      id: newUserId,
      account: cleanAccount,
      username: cleanAccount,
      phone: cleanPhone,
      money: '0.00',
      usdt: '0.0000',
      credit_score: 100,
      level: 1,
      invite_code: myInviteCode,
      is_auth: 0,
      token,
    };

    return success(res, 'Đăng ký tài khoản thành công', userPayload);
  } catch (err) {
    console.error('Lỗi đăng ký hội viên:', err);
    return error(res, 'Đăng ký thất bại: ' + err.message);
  }
}

/**
 * Đăng nhập hội viên
 * Route: POST /api/login/login
 */
async function login(req, res) {
  try {
    const { username, password, account } = req.body;
    const loginAccount = (username || account || '').trim();
    const loginPassword = (password || '').trim();

    if (!loginAccount || !loginPassword) {
      return error(res, 'Vui lòng nhập tài khoản và mật khẩu');
    }

    // Tìm tài khoản theo account hoặc phone
    const [users] = await pool.query(
      `SELECT * FROM fa_user WHERE account = ? OR phone = ? LIMIT 1`,
      [loginAccount, loginAccount]
    );

    if (users.length === 0) {
      return error(res, 'Tài khoản hoặc mật khẩu không chính xác');
    }

    const user = users[0];

    // Kiểm tra trạng thái tài khoản
    if (user.status !== 1) {
      return error(res, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ CSKH.');
    }

    // Kiểm tra mật khẩu
    const isMatch = await comparePassword(loginPassword, user.password, user.salt);
    if (!isMatch) {
      return error(res, 'Tài khoản hoặc mật khẩu không chính xác');
    }

    // Cập nhật thông tin đăng nhập
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    await pool.query(
      `UPDATE fa_user SET last_login_time = NOW(), last_login_ip = ? WHERE id = ?`,
      [clientIp, user.id]
    );

    // Sinh JWT token
    const token = jwt.sign(
      { id: user.id, account: user.account },
      process.env.JWT_SECRET || 'spotline888_fortrade_user_jwt_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const userPayload = {
      id: user.id,
      account: user.account,
      username: user.username,
      real_name: user.real_name,
      phone: user.phone,
      avatar: user.avatar,
      money: user.money,
      usdt: user.usdt,
      freeze_funds: user.freeze_funds,
      yuebao_balance: user.yuebao_balance,
      credit_score: user.credit_score,
      level: user.level,
      invite_code: user.invite_code,
      is_auth: user.is_auth,
      token,
    };

    return success(res, 'Đăng nhập thành công', userPayload);
  } catch (err) {
    console.error('Lỗi đăng nhập hội viên:', err);
    return error(res, 'Đăng nhập thất bại: ' + err.message);
  }
}

/**
 * Lấy thông tin tài khoản hiện tại
 * Route: GET /api/user/profile
 */
async function getProfile(req, res) {
  try {
    const user = req.user;
    return success(res, 'Lấy thông tin thành công', user);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Đổi mật khẩu đăng nhập hoặc mật khẩu rút tiền
 * Route: POST /api/user/change-password
 */
async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const oldPassword = req.body.oldPassword || req.body.old_password || req.body.oldPasswd || '';
    const newPassword = req.body.newPassword || req.body.new_password || req.body.newPasswd || '';
    const type = req.body.type || 'login';

    if (!newPassword || newPassword.trim().length < 6) {
      return error(res, 'Mật khẩu mới phải có ít nhất 6 ký tự');
    }

    const isPayment = type === 'payment' || type === 'fund' || type === 'withdraw' || type === 'mpassword';
    const field = isPayment ? 'mpassword' : 'password';

    const [rows] = await pool.query(`SELECT ${field}, salt FROM fa_user WHERE id = ?`, [userId]);
    if (rows.length === 0) {
      return error(res, 'Hội viên không tồn tại');
    }

    const currentHash = rows[0][field];
    const salt = rows[0].salt;

    if (currentHash) {
      const isMatch = await comparePassword(oldPassword, currentHash, salt);
      if (!isMatch) {
        return error(res, 'Mật khẩu cũ không chính xác');
      }
    }

    const newHashed = await hashPassword(newPassword.trim());
    await pool.query(`UPDATE fa_user SET ${field} = ? WHERE id = ?`, [newHashed, userId]);

    return success(res, isPayment ? 'Đổi mật khẩu rút tiền thành công' : 'Đổi mật khẩu đăng nhập thành công');
  } catch (err) {
    return error(res, 'Đổi mật khẩu thất bại: ' + err.message);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
};
