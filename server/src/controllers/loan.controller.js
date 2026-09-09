const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách các gói vay tín chấp
 * Route: GET /api/loan/configs
 */
async function getLoanConfigs(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM fa_loan_config WHERE status = 1 ORDER BY weigh ASC, days ASC'
    );

    // Nếu chưa có gói vay, tự động seed
    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO fa_loan_config (name, days, daily_rate, min_amount, max_amount, weigh, status) VALUES 
        ('5天快贷，支持用户存款到达50000元以上贷款。', 5, 0.0008, 2000.00, 50000.00, 1, 1),
        ('7天快贷，支持用户存款到达100000元以上贷款。', 7, 0.0010, 20000.00, 100000.00, 1, 1),
        ('15天快贷，支持用户存款到达300000元以上贷款。', 15, 0.0015, 200000.00, 500000.00, 2, 1),
        ('30天快贷，支持用户存款到达500000元以上贷款。', 30, 0.0020, 500000.00, 1000000.00, 4, 1)
      `);
      const [seeded] = await pool.query('SELECT * FROM fa_loan_config WHERE status = 1 ORDER BY days ASC');
      return success(res, 'Lấy gói vay thành công', seeded);
    }

    return success(res, 'Lấy danh sách gói vay thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Gửi hồ sơ đăng ký vay tiền
 * Route: POST /api/loan/apply
 */
async function applyLoan(req, res) {
  try {
    const userId = req.user.id;
    const config_id = req.body.config_id || req.body.configId;
    const rawAmount = req.body.amount || req.body.money;

    const numAmount = parseFloat(rawAmount);
    if (!config_id || isNaN(numAmount) || numAmount <= 0) {
      return error(res, 'Thông tin khoản vay không hợp lệ');
    }

    // Kiểm tra KYC từ database để đảm bảo dữ liệu mới nhất
    const [users] = await pool.query('SELECT is_auth FROM fa_user WHERE id = ?', [userId]);
    const isAuth = users.length > 0 ? users[0].is_auth : 0;
    if (isAuth !== 2) {
      return error(res, 'Bạn cần hoàn thành xác minh danh tính (KYC) trước khi đăng ký vay vốn');
    }

    const [configs] = await pool.query('SELECT * FROM fa_loan_config WHERE id = ?', [config_id]);
    if (configs.length === 0) {
      return error(res, 'Gói vay không tồn tại');
    }

    const config = configs[0];
    const minAmount = parseFloat(config.min_amount);
    const maxAmount = parseFloat(config.max_amount);

    if (numAmount < minAmount || numAmount > maxAmount) {
      return error(res, `Khoản vay phải nằm trong hạn mức từ ${minAmount.toFixed(2)} đến ${maxAmount.toFixed(2)}`);
    }

    // Tính lãi
    const dailyRate = parseFloat(config.daily_rate);
    const days = config.days;
    const interest = numAmount * dailyRate * days;
    const totalRepay = numAmount + interest;

    const [result] = await pool.query(
      `INSERT INTO fa_loan_record (
        user_id, config_id, amount, interest, total_repay, 
        days, remaining_days, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())`,
      [userId, config_id, numAmount, interest, totalRepay, days, days]
    );

    return success(res, 'Đăng ký vay vốn thành công, vui lòng chờ duyệt', {
      loan_id: result.insertId,
      amount: numAmount,
      total_repay: totalRepay,
      days,
    });
  } catch (err) {
    return error(res, 'Đăng ký vay thất bại: ' + err.message);
  }
}

/**
 * Lấy danh sách khoản vay của User
 * Route: GET /api/loan/my-loans
 */
async function getMyLoans(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT r.*, c.name as config_name 
       FROM fa_loan_record r 
       JOIN fa_loan_config c ON r.config_id = c.id 
       WHERE r.user_id = ? 
       ORDER BY r.id DESC`,
      [userId]
    );

    return success(res, 'Lấy danh sách khoản vay thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getLoanConfigs,
  applyLoan,
  getMyLoans,
};
