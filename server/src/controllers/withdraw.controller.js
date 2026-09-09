const { pool } = require('../config/db');
const { success, error } = require('../utils/response');
const { comparePassword } = require('../utils/hash');

/**
 * Gửi yêu cầu rút tiền (Downmark)
 * Route: POST /api/withdraw/submit
 */
async function submitWithdraw(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const rawAmount = req.body.amount || req.body.money;
    const rawPassword = req.body.password || req.body.fundPassword || req.body.mpasswd;
    const withdraw_type = req.body.withdraw_type || req.body.type || 'bank_card';
    const bank_account_id = req.body.bank_account_id || req.body.bankId;

    const numAmount = parseFloat(rawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      connection.release();
      return error(res, 'Số tiền rút không hợp lệ');
    }

    if (!rawPassword || !rawPassword.trim()) {
      connection.release();
      return error(res, 'Vui lòng nhập mật khẩu rút tiền');
    }

    // 1. Kiểm tra trạng thái khóa ví của User
    const [users] = await connection.query(
      'SELECT id, money, mpassword, salt, fund_status, freeze_funds FROM fa_user WHERE id = ? FOR UPDATE',
      [userId]
    );

    if (users.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Tài khoản không tồn tại');
    }

    const user = users[0];

    if (user.fund_status === 1) {
      await connection.rollback();
      connection.release();
      return error(res, 'Tài khoản của bạn đang bị đóng băng quỹ, không thể thực hiện rút tiền');
    }

    // 2. Xác thực mật khẩu rút tiền
    if (!user.mpassword) {
      await connection.rollback();
      connection.release();
      return error(res, 'Bạn chưa thiết lập mật khẩu rút tiền. Vui lòng vào Cài đặt để tạo.');
    }

    const isMatch = await comparePassword(rawPassword.trim(), user.mpassword, user.salt);
    if (!isMatch) {
      await connection.rollback();
      connection.release();
      return error(res, 'Mật khẩu rút tiền không chính xác');
    }

    // 3. Kiểm tra số dư khả dụng
    const currentBalance = parseFloat(user.money);
    if (currentBalance < numAmount) {
      await connection.rollback();
      connection.release();
      return error(res, `Số dư khả dụng (${currentBalance.toFixed(2)}) không đủ để rút ${numAmount.toFixed(2)}`);
    }

    // 4. Lấy thông tin tài khoản ngân hàng hoặc ví rút tiền
    let bankQuery = 'SELECT * FROM fa_user_bank WHERE user_id = ?';
    const bankParams = [userId];
    if (bank_account_id) {
      bankQuery += ' AND id = ?';
      bankParams.push(bank_account_id);
    } else {
      bankQuery += ' ORDER BY is_default DESC, id DESC LIMIT 1';
    }

    const [banks] = await connection.query(bankQuery, bankParams);
    if (banks.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Bạn chưa liên kết tài khoản ngân hàng hoặc ví nhận tiền');
    }

    const bank = banks[0];

    // 5. Trừ số dư khả dụng và tăng số dư đóng băng tạm thời
    const newBalance = currentBalance - numAmount;
    const newFreeze = parseFloat(user.freeze_funds || 0) + numAmount;

    await connection.query(
      'UPDATE fa_user SET money = ?, freeze_funds = ? WHERE id = ?',
      [newBalance, newFreeze, userId]
    );

    // 6. Tạo mã đơn rút và thêm vào fa_downmark
    const orderSn = 'WTD' + Date.now() + Math.floor(100 + Math.random() * 900);
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const [result] = await connection.query(
      `INSERT INTO fa_downmark (
        order_sn, user_id, amount, fee, actual_amount, withdraw_type,
        real_name, bank_name, card_number, bank_branch,
        balance_before, balance_after, status, source_ip, created_at
      ) VALUES (?, ?, ?, 0.00, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
      [
        orderSn,
        userId,
        numAmount,
        numAmount, // fee = 0
        withdraw_type,
        bank.account_holder,
        bank.bank_name || (withdraw_type === 'usdt' ? 'USDT' : 'Bank'),
        bank.card_number,
        bank.bank_branch || '',
        currentBalance,
        newBalance,
        clientIp,
      ]
    );

    // 7. Ghi sổ cái fa_user_money_log
    await connection.query(
      `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, created_at)
       VALUES (?, 'MYR', 'withdraw', ?, ?, ?, 'Yêu cầu rút tiền', NOW())`,
      [userId, -numAmount, currentBalance, newBalance]
    );

    await connection.commit();
    connection.release();

    return success(res, 'Yêu cầu rút tiền đã được gửi thành công', {
      id: result.insertId,
      orderId: result.insertId,
      order_sn: orderSn,
      order_no: orderSn,
      orderNo: orderSn,
      amount: numAmount,
      balance: newBalance,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Rút tiền thất bại: ' + err.message);
  }
}

/**
 * Lấy lịch sử rút tiền của User
 * Route: GET /api/withdraw/list
 */
async function getWithdrawList(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, order_sn, amount, fee, actual_amount, withdraw_type, real_name, bank_name, card_number, status, note, created_at 
       FROM fa_downmark 
       WHERE user_id = ? 
       ORDER BY id DESC`,
      [userId]
    );

    return success(res, 'Lấy lịch sử rút tiền thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Lấy danh sách lịch sử biến động số dư của User (Money Records)
 * Route: GET /api/money/records
 */
async function getMoneyLogs(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, currency, type, money, before_balance, after_balance, memo, created_at 
       FROM fa_user_money_log 
       WHERE user_id = ? 
       ORDER BY id DESC 
       LIMIT 50`,
      [userId]
    );

    return success(res, 'Lấy lịch sử biến động số dư thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  submitWithdraw,
  getWithdrawList,
  getMoneyLogs,
};
