const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách hội viên cho Admin
 * Route: GET /api/admin/user
 */
async function getUsers(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const { search, status, is_auth, level } = req.query;

    let whereClause = '1=1';
    const params = [];

    if (search && search.trim()) {
      whereClause += ' AND (account LIKE ? OR phone LIKE ? OR real_name LIKE ? OR reg_ip LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword, keyword);
    }

    if (status !== undefined && status !== '' && status !== 'Choose') {
      whereClause += ' AND status = ?';
      params.push(Number(status));
    }

    if (is_auth !== undefined && is_auth !== '' && is_auth !== 'Choose') {
      whereClause += ' AND is_auth = ?';
      params.push(Number(is_auth));
    }

    if (level !== undefined && level !== '') {
      whereClause += ' AND level = ?';
      params.push(Number(level));
    }

    // Đếm tổng số bản ghi
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM fa_user WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Lấy danh sách
    const [users] = await pool.query(
      `SELECT id, account, username, real_name, phone, avatar, money, usdt, 
              freeze_funds, credit_score, level, invite_code, status, fund_status, 
              say_limit, kong_style, is_auth, reg_ip, reg_time, last_login_time, remark
       FROM fa_user 
       WHERE ${whereClause} 
       ORDER BY id DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return success(res, 'Lấy danh sách người dùng thành công', {
      total,
      rows: users,
      page,
      limit,
    });
  } catch (err) {
    return error(res, 'Lỗi lấy danh sách người dùng: ' + err.message);
  }
}

/**
 * Lấy chi tiết một hội viên
 * Route: GET /api/admin/user/:id
 */
async function getUserDetail(req, res) {
  try {
    const userId = req.params.id;

    const [users] = await pool.query('SELECT * FROM fa_user WHERE id = ?', [userId]);
    if (users.length === 0) {
      return error(res, 'Không tìm thấy hội viên');
    }

    const user = users[0];
    delete user.password;
    delete user.mpassword;

    // Lấy thẻ ngân hàng liên kết
    const [banks] = await pool.query('SELECT * FROM fa_user_bank WHERE user_id = ?', [userId]);

    // Lấy hồ sơ KYC
    const [verify] = await pool.query('SELECT * FROM fa_user_verify WHERE user_id = ?', [userId]);

    return success(res, 'Lấy chi tiết thành công', {
      user,
      banks,
      verify: verify[0] || null,
    });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Nạp / Trừ điểm trực tiếp cho hội viên (上下分 - Điều chỉnh số dư)
 * Route: POST /api/admin/user/score
 * Route: POST /api/admin/user/balance
 */
async function adjustScore(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const rawUserId = req.body.userId ?? req.body.id ?? req.body.uid;
    const rawAmount = req.body.amount ?? req.body.money;
    const rawType = String(req.body.type || 'add').toLowerCase();
    const isSub = rawType === 'sub' || rawType === '-' || rawType === 'dec' || rawType === 'reduce';
    const type = isSub ? 'sub' : 'add';
    const memo = req.body.memo || req.body.remark || '';

    if (!rawUserId) {
      connection.release();
      return error(res, 'Vui lòng cung cấp ID hội viên');
    }

    const numAmount = Math.abs(parseFloat(rawAmount));
    if (isNaN(numAmount) || numAmount <= 0) {
      connection.release();
      return error(res, 'Số tiền điều chỉnh không hợp lệ (phải lớn hơn 0)');
    }

    // Khóa dòng user để chống race condition
    const [users] = await connection.query(
      'SELECT id, money, usdt, account FROM fa_user WHERE id = ? FOR UPDATE',
      [rawUserId]
    );

    if (users.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Hội viên không tồn tại');
    }

    const currentMoney = parseFloat(users[0].money) || 0;
    let newMoney = currentMoney;
    let diffMoney = 0;

    if (type === 'add') {
      newMoney = parseFloat((currentMoney + numAmount).toFixed(2));
      diffMoney = numAmount;
    } else {
      if (currentMoney < numAmount) {
        await connection.rollback();
        connection.release();
        return error(res, `Số dư hiện tại (${currentMoney.toFixed(2)}) không đủ để trừ ${numAmount.toFixed(2)}`);
      }
      newMoney = parseFloat((currentMoney - numAmount).toFixed(2));
      diffMoney = -numAmount;
    }

    // Cập nhật số dư fa_user
    await connection.query(
      'UPDATE fa_user SET money = ? WHERE id = ?',
      [newMoney, rawUserId]
    );

    // Ghi sổ cái fa_user_money_log
    const actionMemo = memo || (type === 'add' ? `管理员加款: +${numAmount}` : `管理员扣款: -${numAmount}`);
    await connection.query(
      `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, created_at)
       VALUES (?, 'MYR', 'admin_adjust', ?, ?, ?, ?, NOW())`,
      [rawUserId, diffMoney, currentMoney, newMoney, actionMemo]
    );

    // Ghi log quản trị
    await connection.query(
      `INSERT INTO fa_admin_log (admin_id, username, url, title, content, ip, created_at)
       VALUES (?, ?, '/api/admin/user/score', '调整会员余额', ?, ?, NOW())`,
      [
        req.admin?.id || 1,
        req.admin?.username || 'admin',
        JSON.stringify({ userId: rawUserId, type, diffMoney, before: currentMoney, after: newMoney, memo: actionMemo }),
        req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
      ]
    );

    await connection.commit();
    connection.release();

    return success(res, 'Điều chỉnh số dư thành công', {
      user_id: Number(rawUserId),
      type,
      amount: numAmount,
      before_balance: currentMoney,
      after_balance: newMoney,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Lỗi điều chỉnh số dư: ' + err.message);
  }
}

/**
 * Điều chỉnh điểm số tín nhiệm cho hội viên (信誉分)
 * Route: POST /api/admin/user/credit-score
 * Route: POST /api/admin/user/score/credit
 */
async function adjustCreditScore(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const rawUserId = req.body.userId ?? req.body.id ?? req.body.uid;
    const rawScore = req.body.score ?? req.body.credit_score ?? req.body.amount;
    const rawType = String(req.body.type || 'add').toLowerCase();
    const memo = req.body.memo || req.body.remark || '';

    if (!rawUserId) {
      connection.release();
      return error(res, 'Vui lòng cung cấp ID hội viên');
    }

    const numScore = parseFloat(rawScore);
    if (isNaN(numScore)) {
      connection.release();
      return error(res, 'Điểm số không hợp lệ');
    }

    // Khóa dòng user
    const [users] = await connection.query(
      'SELECT id, credit_score, account FROM fa_user WHERE id = ? FOR UPDATE',
      [rawUserId]
    );

    if (users.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Hội viên không tồn tại');
    }

    const currentScore = parseInt(users[0].credit_score, 10) || 100;
    let newScore = currentScore;

    if (rawType === 'set') {
      // Đặt điểm trực tiếp
      newScore = Math.max(0, Math.min(100, Math.round(numScore)));
    } else if (rawType === 'sub' || rawType === '-' || rawType === 'dec' || rawType === 'reduce') {
      // Trừ điểm
      newScore = Math.max(0, Math.min(100, currentScore - Math.round(Math.abs(numScore))));
    } else {
      // Mặc định: Cộng điểm (tăng điểm)
      newScore = Math.max(0, Math.min(100, currentScore + Math.round(Math.abs(numScore))));
    }

    // Cập nhật điểm tín nhiệm vào fa_user
    await connection.query(
      'UPDATE fa_user SET credit_score = ? WHERE id = ?',
      [newScore, rawUserId]
    );

    // Ghi log quản trị
    const actionMemo = memo || `调整信誉分 (${rawType}): ${currentScore} -> ${newScore}`;
    await connection.query(
      `INSERT INTO fa_admin_log (admin_id, username, url, title, content, ip, created_at)
       VALUES (?, ?, '/api/admin/user/credit-score', '调整会员信誉分', ?, ?, NOW())`,
      [
        req.admin?.id || 1,
        req.admin?.username || 'admin',
        JSON.stringify({ userId: rawUserId, rawType, before: currentScore, after: newScore, memo: actionMemo }),
        req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
      ]
    );

    await connection.commit();
    connection.release();

    return success(res, 'Điều chỉnh điểm tín nhiệm thành công', {
      user_id: Number(rawUserId),
      type: rawType,
      before_score: currentScore,
      after_score: newScore,
      credit_score: newScore,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Lỗi điều chỉnh điểm tín nhiệm: ' + err.message);
  }
}

/**
 * Điều khiển rủi ro và trạng thái tài khoản hội viên
 * Route: POST /api/admin/user/control
 */
async function updateUserControl(req, res) {
  try {
    const rawUserId = req.body.userId ?? req.body.id ?? req.body.uid;
    if (!rawUserId) {
      return error(res, 'Vui lòng cung cấp ID hội viên');
    }

    const { kong_style, credit_score, fund_status, say_limit, status, level, remark } = req.body;

    const updates = [];
    const params = [];

    if (kong_style !== undefined) {
      updates.push('kong_style = ?');
      params.push(Number(kong_style)); // 0: thường, 1: luôn thắng, 2: luôn thua
    }
    if (credit_score !== undefined) {
      const validatedScore = Math.max(0, Math.min(100, Math.round(Number(credit_score))));
      updates.push('credit_score = ?');
      params.push(validatedScore);
    }
    if (fund_status !== undefined) {
      updates.push('fund_status = ?');
      params.push(Number(fund_status));
    }
    if (say_limit !== undefined) {
      updates.push('say_limit = ?');
      params.push(Number(say_limit));
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(Number(status));
    }
    if (level !== undefined) {
      updates.push('level = ?');
      params.push(Number(level));
    }
    if (remark !== undefined) {
      updates.push('remark = ?');
      params.push(remark);
    }

    if (updates.length === 0) {
      return error(res, 'Không có dữ liệu thay đổi');
    }

    params.push(rawUserId);
    await pool.query(`UPDATE fa_user SET ${updates.join(', ')} WHERE id = ?`, params);

    return success(res, 'Cập nhật cấu hình hội viên thành công');
  } catch (err) {
    return error(res, 'Lỗi cập nhật cấu hình: ' + err.message);
  }
}

/**
 * Gửi tin nhắn hệ thống cho hội viên
 * Route: POST /api/admin/user/message
 */
async function sendMessage(req, res) {
  try {
    const rawUserId = req.body.userId ?? req.body.id ?? req.body.uid;
    const title = (req.body.title || '系统通知').trim();
    const content = (req.body.content || '').trim();

    if (!content) {
      return error(res, 'Vui lòng nhập nội dung tin nhắn');
    }

    const targetUserId = rawUserId !== undefined && rawUserId !== null ? Number(rawUserId) : 0;

    let targetAccount = 'Toàn bộ hội viên';
    if (targetUserId > 0) {
      const [users] = await pool.query('SELECT id, account FROM fa_user WHERE id = ?', [targetUserId]);
      if (users.length === 0) {
        return error(res, 'Không tìm thấy hội viên nhận tin nhắn');
      }
      targetAccount = users[0].account;
    }

    const [result] = await pool.query(
      `INSERT INTO fa_message (user_id, title, content, is_read, created_at)
       VALUES (?, ?, ?, 0, NOW())`,
      [targetUserId, title, content]
    );

    // Ghi log quản trị
    await pool.query(
      `INSERT INTO fa_admin_log (admin_id, username, url, title, content, ip, created_at)
       VALUES (?, ?, '/api/admin/user/message', '向会员发送系统消息', ?, ?, NOW())`,
      [
        req.admin?.id || 1,
        req.admin?.username || 'admin',
        JSON.stringify({ targetUserId, targetAccount, title, content, messageId: result.insertId }),
        req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
      ]
    );

    return success(res, 'Gửi tin nhắn thành công', {
      id: result.insertId,
      user_id: targetUserId,
      account: targetAccount,
      title,
      content,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
  } catch (err) {
    return error(res, 'Lỗi gửi tin nhắn: ' + err.message);
  }
}

/**
 * Lấy lịch sử tin nhắn đã gửi cho hội viên (phía Admin)
 * Route: GET /api/admin/user/:id/messages
 */
async function getUserMessagesForAdmin(req, res) {
  try {
    const userId = Number(req.params.id);
    if (!userId) {
      return error(res, 'ID hội viên không hợp lệ');
    }

    const [rows] = await pool.query(
      `SELECT id, user_id, title, content, is_read, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
       FROM fa_message
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT 50`,
      [userId]
    );

    return success(res, 'Lấy lịch sử tin nhắn thành công', rows);
  } catch (err) {
    return error(res, 'Lỗi lấy tin nhắn: ' + err.message);
  }
}

/**
 * Xóa tin nhắn hệ thống (phía Admin)
 * Route: DELETE /api/admin/message/:id
 */
async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return error(res, 'Vui lòng cung cấp ID tin nhắn');
    }

    await pool.query('DELETE FROM fa_message WHERE id = ?', [Number(id)]);
    return success(res, 'Xóa tin nhắn thành công');
  } catch (err) {
    return error(res, 'Lỗi xóa tin nhắn: ' + err.message);
  }
}

module.exports = {
  getUsers,
  getUserDetail,
  adjustScore,
  adjustCreditScore,
  updateUserControl,
  sendMessage,
  getUserMessagesForAdmin,
  deleteMessage,
};
