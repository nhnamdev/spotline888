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
    const rawWithdrawType = req.body.withdraw_type || req.body.type || 'usdt';
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
      'SELECT id, money, usdt, mpassword, password, salt, fund_status, freeze_funds, real_name, account FROM fa_user WHERE id = ? FOR UPDATE',
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

    // 2. Xác thực mật khẩu rút tiền (ưu tiên mpassword, fallback sang password đăng nhập)
    let isMatch = false;
    if (user.mpassword) {
      isMatch = await comparePassword(rawPassword.trim(), user.mpassword, user.salt);
    }
    if (!isMatch && user.password) {
      isMatch = await comparePassword(rawPassword.trim(), user.password, user.salt);
    }

    if (!isMatch) {
      await connection.rollback();
      connection.release();
      return error(res, 'Mật khẩu rút tiền không chính xác');
    }

    // 3. Kiểm tra số dư khả dụng (hỗ trợ cả trường money và usdt)
    const currentBalance = parseFloat(user.money || 0);
    const currentUsdt = parseFloat(user.usdt || 0);
    const maxAvailable = Math.max(currentBalance, currentUsdt);

    if (maxAvailable < numAmount) {
      await connection.rollback();
      connection.release();
      return error(res, `Số dư khả dụng (${maxAvailable.toFixed(2)} USDT) không đủ để rút ${numAmount.toFixed(2)} USDT`);
    }

    // 4. Chuẩn hóa loại rút tiền: fa_downmark yêu cầu ENUM('bank_card','usdt')
    const cleanWithdrawType = String(rawWithdrawType).toLowerCase().includes('usdt') ? 'usdt' : 'bank_card';

    // 5. Lấy hoặc tự động tạo thông tin ví / ngân hàng nhận tiền
    let bankQuery = 'SELECT * FROM fa_user_bank WHERE user_id = ?';
    const bankParams = [userId];
    if (bank_account_id) {
      bankQuery += ' AND id = ?';
      bankParams.push(bank_account_id);
    } else {
      bankQuery += ' ORDER BY is_default DESC, id DESC LIMIT 1';
    }

    const [banks] = await connection.query(bankQuery, bankParams);
    let bank = banks[0];

    if (!bank) {
      const walletOrCard =
        req.body.wallet_address ||
        req.body.walletAddress ||
        req.body.card_number ||
        req.body.cardNumber ||
        (cleanWithdrawType === 'usdt' ? 'TR7NHqjeE...K9tVv69' : '8888888888');
      const bankName =
        req.body.bank_name ||
        req.body.bankName ||
        (cleanWithdrawType === 'usdt' ? 'USDT (TRC20)' : 'Ngân hàng');
      const accountHolder =
        req.body.account_holder ||
        req.body.accountHolder ||
        req.body.name ||
        req.body.real_name ||
        user.real_name ||
        user.account ||
        'Member';
      const branch = req.body.bank_branch || req.body.bankBranch || '';

      const [insertBank] = await connection.query(
        `INSERT INTO fa_user_bank (user_id, account_holder, bank_name, card_number, bank_branch, is_default, created_at)
         VALUES (?, ?, ?, ?, ?, 1, NOW())`,
        [userId, accountHolder, bankName, walletOrCard, branch]
      );
      bank = {
        id: insertBank.insertId,
        account_holder: accountHolder,
        bank_name: bankName,
        card_number: walletOrCard,
        bank_branch: branch,
      };
    }

    // 6. Trừ số dư khả dụng và tăng số dư đóng băng tạm thời
    const newBalance = Math.max(0, currentBalance - numAmount);
    const newUsdt = Math.max(0, currentUsdt - numAmount);
    const newFreeze = parseFloat(user.freeze_funds || 0) + numAmount;

    await connection.query(
      'UPDATE fa_user SET money = ?, usdt = ?, freeze_funds = ? WHERE id = ?',
      [newBalance, newUsdt, newFreeze, userId]
    );

    // 7. Tạo mã đơn rút và thêm vào fa_downmark
    const orderSn = 'WTD' + Date.now() + Math.floor(100 + Math.random() * 900);
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const accountHolder = bank.account_holder || user.real_name || user.account || 'Member';
    const bankName = bank.bank_name || (cleanWithdrawType === 'usdt' ? 'USDT (TRC20)' : 'Bank');
    const cardNumber = bank.card_number || 'USDT_WALLET';
    const bankBranch = bank.bank_branch || '';

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
        cleanWithdrawType,
        accountHolder,
        bankName,
        cardNumber,
        bankBranch,
        maxAvailable,
        maxAvailable - numAmount,
        clientIp,
      ]
    );

    // 8. Ghi sổ cái fa_user_money_log
    await connection.query(
      `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, created_at)
       VALUES (?, 'USDT', 'withdraw', ?, ?, ?, 'Yêu cầu rút tiền USDT', NOW())`,
      [userId, -numAmount, maxAvailable, maxAvailable - numAmount]
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
      balance: maxAvailable - numAmount,
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
