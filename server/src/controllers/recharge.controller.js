const { pool } = require('../config/db');
const { success, error } = require('../utils/response');
const { getPublicUrl } = require('../utils/r2');

/**
 * Lấy thông tin kênh nạp tiền (Ngân hàng sàn và Ví USDT)
 * Route: GET /api/recharge/channels
 */
async function getRechargeChannels(req, res) {
  try {
    const [configs] = await pool.query(
      `SELECT name, value FROM fa_config 
       WHERE name IN ('web_bank_name', 'web_bank_place', 'web_bank_user', 'web_bank_number', 'web_bank_tips', 'bank_status', 'usdt_status', 'usdt_address', 'usdt_cny_rate', 'min_chongzhi', 'max_chongzhi')`
    );

    const configMap = {};
    configs.forEach((c) => {
      configMap[c.name] = c.value;
    });

    const data = {
      bank: {
        enabled: configMap['bank_status'] !== '0',
        bank_name: configMap['web_bank_name'] || 'Maybank Malaysia',
        bank_place: configMap['web_bank_place'] || 'Kuala Lumpur Branch',
        bank_user: configMap['web_bank_user'] || 'SPOTLINE OFFICIAL LTD',
        bank_number: configMap['web_bank_number'] || '514271829102',
        tips: configMap['web_bank_tips'] || 'Vui lòng liên hệ CSKH hoặc kiểm tra kỹ số tài khoản trước khi nạp tiền.',
      },
      usdt: {
        enabled: configMap['usdt_status'] !== '0',
        address: configMap['usdt_address'] || 'TN7s...trc20address',
        rate: parseFloat(configMap['usdt_cny_rate'] || '4.07'),
      },
      limits: {
        min: parseFloat(configMap['min_chongzhi'] || '100'),
        max: parseFloat(configMap['max_chongzhi'] || '1000000'),
      },
    };

    return success(res, 'Lấy kênh nạp tiền thành công', data);
  } catch (err) {
    return error(res, 'Lỗi lấy kênh nạp tiền: ' + err.message);
  }
}

/**
 * Gửi yêu cầu nạp tiền (Upmark)
 * Route: POST /api/recharge/submit
 */
async function submitRecharge(req, res) {
  try {
    const userId = req.user.id;
    const { money, pay_type = '网银入金', voucher_img, member_note } = req.body;

    const numMoney = parseFloat(money);
    if (isNaN(numMoney) || numMoney <= 0) {
      return error(res, 'Số tiền nạp không hợp lệ');
    }

    // Sinh mã đơn giao dịch
    const orderSn = 'REC' + Date.now() + Math.floor(100 + Math.random() * 900);
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const finalVoucher = voucher_img ? getPublicUrl(voucher_img) : null;

    const [result] = await pool.query(
      `INSERT INTO fa_upmark (order_sn, user_id, money, balance, pay_type, voucher_img, member_note, source_ip, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [orderSn, userId, numMoney, req.user.money, pay_type, finalVoucher, member_note || null, clientIp]
    );

    return success(res, 'Gửi yêu cầu nạp tiền thành công, vui lòng chờ duyệt', {
      id: result.insertId,
      orderId: result.insertId,
      order_sn: orderSn,
      order_no: orderSn,
      orderNo: orderSn,
      money: numMoney,
    });
  } catch (err) {
    return error(res, 'Gửi yêu cầu nạp thất bại: ' + err.message);
  }
}

/**
 * Lấy lịch sử nạp tiền của User
 * Route: GET /api/recharge/list
 */
async function getRechargeList(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, order_sn, money, pay_type, status, member_note, created_at, check_time 
       FROM fa_upmark 
       WHERE user_id = ? 
       ORDER BY id DESC`,
      [userId]
    );

    return success(res, 'Lấy lịch sử nạp thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getRechargeChannels,
  submitRecharge,
  getRechargeList,
};
