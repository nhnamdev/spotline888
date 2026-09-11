const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy thông tin tổng quan Quỹ Yu'e Bao
 * Route: GET /api/yuebao/info
 */
async function getYuebaoInfo(req, res) {
  try {
    const userId = req.user.id;

    // Lấy số dư cập nhật
    const [users] = await pool.query(
      'SELECT money, yuebao_balance FROM fa_user WHERE id = ?',
      [userId]
    );

    const availableBalance = parseFloat(users[0].money || 0);
    const yuebaoBalance = parseFloat(users[0].yuebao_balance || 0);

    // Lấy danh sách gói kỳ hạn
    const [configs] = await pool.query(
      'SELECT * FROM fa_yuebao_config WHERE status = 1 ORDER BY day ASC'
    );

    // Nếu chưa có cấu hình gói, tự động khởi tạo dữ liệu mẫu
    if (configs.length === 0) {
      await pool.query(`
        INSERT INTO fa_yuebao_config (title, day, radio, min_rate, max_rate, min_money, status) VALUES 
        ('5', 5, '1.00-1.21%', 0.0100, 0.0121, '10000.00-50000.00', 1),
        ('7', 7, '2.00-2.21%', 0.0200, 0.0221, '50000.00-600000.00', 1),
        ('10', 10, '3.00-3.21%', 0.0300, 0.0321, '200000.00-900000.00', 1),
        ('15', 15, '4.00-4.21%', 0.0400, 0.0421, '500000.00-5000000.00', 1),
        ('30', 30, '5.00-5.21%', 0.0500, 0.0521, '10000.00-50000000.00', 1)
      `);
    }

    const [allConfigs] = await pool.query('SELECT * FROM fa_yuebao_config WHERE status = 1 ORDER BY day ASC');

    // Tính lãi hôm qua giả định theo số dư hiện tại (vd: 1.5% ngày)
    const yesterdayProfit = yuebaoBalance > 0 ? (yuebaoBalance * 0.012).toFixed(2) : '0.00';

    return success(res, "Lấy thông tin quỹ Yu'e Bao thành công", {
      availableBalance,
      yuebaoBalance,
      yesterdayProfit,
      configs: allConfigs,
    });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Chuyển tiền qua lại giữa Ví chính và Ví Yu'e Bao
 * Route: POST /api/yuebao/transfer
 */
async function transferYuebao(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { amount, direction = 'in' } = req.body; // 'in' (Ví chính -> Yu'e Bao), 'out' (Yu'e Bao -> Ví chính)

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      connection.release();
      return error(res, 'Số tiền chuyển không hợp lệ');
    }

    const [users] = await connection.query(
      'SELECT id, money, yuebao_balance FROM fa_user WHERE id = ? FOR UPDATE',
      [userId]
    );

    if (users.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Người dùng không tồn tại');
    }

    const currentMoney = parseFloat(users[0].money);
    const currentYuebao = parseFloat(users[0].yuebao_balance);

    let newMoney = currentMoney;
    let newYuebao = currentYuebao;

    if (direction === 'in') {
      if (currentMoney < numAmount) {
        await connection.rollback();
        connection.release();
        return error(res, `Số dư khả dụng (${currentMoney.toFixed(2)}) không đủ để chuyển ${numAmount.toFixed(2)}`);
      }
      newMoney = currentMoney - numAmount;
      newYuebao = currentYuebao + numAmount;
    } else {
      if (currentYuebao < numAmount) {
        await connection.rollback();
        connection.release();
        return error(res, `Số dư quỹ Yu'e Bao (${currentYuebao.toFixed(2)}) không đủ để chuyển ${numAmount.toFixed(2)}`);
      }
      newYuebao = currentYuebao - numAmount;
      newMoney = currentMoney + numAmount;
    }

    // 1. Cập nhật số dư
    await connection.query(
      'UPDATE fa_user SET money = ?, yuebao_balance = ? WHERE id = ?',
      [newMoney, newYuebao, userId]
    );

    // 2. Ghi sổ cái fa_user_money_log
    const logType = direction === 'in' ? 'yuebao_in' : 'yuebao_out';
    const logDiff = direction === 'in' ? -numAmount : numAmount;
    const logMemo = direction === 'in' ? '转入余额宝' : '余额宝转出';

    await connection.query(
      `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, created_at)
       VALUES (?, 'MYR', ?, ?, ?, ?, ?, NOW())`,
      [userId, logType, logDiff, currentMoney, newMoney, logMemo]
    );

    // 3. Ghi vào fa_yuebao_order
    await connection.query(
      `INSERT INTO fa_yuebao_order (user_id, amount, type, tx, status, remark, created_at)
       VALUES (?, ?, 1, ?, 2, ?, NOW())`,
      [userId, numAmount, direction === 'in' ? 0 : 1, logMemo]
    );

    await connection.commit();
    connection.release();

    return success(res, 'Chuyển tiền thành công', {
      availableBalance: newMoney,
      yuebaoBalance: newYuebao,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Chuyển tiền thất bại: ' + err.message);
  }
}

module.exports = {
  getYuebaoInfo,
  transferYuebao,
};
