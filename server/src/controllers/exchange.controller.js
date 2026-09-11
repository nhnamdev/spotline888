const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy tỷ giá quy đổi Flash Exchange
 * Route: GET /api/exchange/rate
 */
async function getExchangeRate(req, res) {
  try {
    const [configs] = await pool.query("SELECT value FROM fa_config WHERE name = 'usdt_cny_rate' LIMIT 1");
    const rate = configs.length > 0 ? parseFloat(configs[0].value) : 1.0;
    return success(res, 'Lấy tỷ giá thành công', { rate });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thực hiện quy đổi tiền (USD sang USDT hoặc ngược lại)
 * Route: POST /api/exchange/swap
 */
async function swapCurrency(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const rawAmount = req.body.amount || req.body.money || req.body.fromAmount;
    let direction = req.body.direction;
    const fromCurr = (req.body.fromCurrency || '').toUpperCase();
    const toCurr = (req.body.toCurrency || '').toUpperCase();

    if (!direction) {
      if (fromCurr === 'USDT' || toCurr === 'USD' || toCurr === 'VND' || toCurr === 'MYR') {
        direction = 'usdtToFiat';
      } else {
        direction = 'fiatToUsdt';
      }
    }

    const numAmount = parseFloat(rawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      connection.release();
      return error(res, 'Số tiền quy đổi không hợp lệ');
    }

    // Lấy tỷ giá
    const [configs] = await connection.query("SELECT value FROM fa_config WHERE name = 'usdt_cny_rate' LIMIT 1");
    const rate = configs.length > 0 ? parseFloat(configs[0].value) : 1.0;

    const [users] = await connection.query(
      'SELECT id, money, usdt FROM fa_user WHERE id = ? FOR UPDATE',
      [userId]
    );

    const currentMoney = parseFloat(users[0].money);
    const currentUsdt = parseFloat(users[0].usdt);

    let newMoney = currentMoney;
    let newUsdt = currentUsdt;
    let fromCurrency = '';
    let toCurrency = '';
    let fromAmount = numAmount;
    let toAmount = 0;

    const isFiatToUsdt = (direction === 'usdToUsdt' || direction === 'myrToUsdt' || direction === 'fiatToUsdt' || direction === 'vndToUsdt');

    if (isFiatToUsdt) {
      fromCurrency = fromCurr || 'USD';
      toCurrency = 'USDT';
      if (currentMoney < numAmount) {
        await connection.rollback();
        connection.release();
        return error(res, `Số dư khả dụng (${currentMoney.toFixed(2)}) không đủ để đổi ${numAmount}`);
      }
      toAmount = parseFloat((numAmount / rate).toFixed(4));
      newMoney = currentMoney - numAmount;
      newUsdt = currentUsdt + toAmount;
    } else {
      fromCurrency = 'USDT';
      toCurrency = toCurr || 'USD';
      if (currentUsdt < numAmount) {
        await connection.rollback();
        connection.release();
        return error(res, `Số dư USDT (${currentUsdt.toFixed(4)}) không đủ để đổi ${numAmount}`);
      }
      toAmount = parseFloat((numAmount * rate).toFixed(2));
      newUsdt = currentUsdt - numAmount;
      newMoney = currentMoney + toAmount;
    }

    // Cập nhật số dư
    await connection.query(
      'UPDATE fa_user SET money = ?, usdt = ? WHERE id = ?',
      [newMoney, newUsdt, userId]
    );

    // Ghi fa_exchange
    await connection.query(
      `INSERT INTO fa_exchange (user_id, from_currency, to_currency, from_amount, to_amount, rate, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, fromCurrency, toCurrency, fromAmount, toAmount, rate]
    );

    // Ghi sổ cái
    await connection.query(
      `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, created_at)
       VALUES (?, 'USD', 'exchange', ?, ?, ?, ?, NOW())`,
      [
        userId,
        isFiatToUsdt ? -numAmount : toAmount,
        currentMoney,
        newMoney,
        `闪兑 ${fromAmount} ${fromCurrency} 兑换 ${toAmount} ${toCurrency} (汇率: ${rate})`,
      ]
    );

    await connection.commit();
    connection.release();

    return success(res, 'Quy đổi tiền tệ thành công', {
      usdBalance: newMoney,
      myrBalance: newMoney,
      usdtBalance: newUsdt,
      convertedAmount: toAmount,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Quy đổi thất bại: ' + err.message);
  }
}

module.exports = {
  getExchangeRate,
  swapCurrency,
};
