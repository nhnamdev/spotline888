const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy số liệu thống kê Dashboard Admin
 * Route: GET /api/admin/dashboard/stats
 */
async function getDashboardStats(req, res) {
  try {
    // 1. Thống kê User
    const [userStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN DATE(reg_time) = CURDATE() THEN 1 ELSE 0 END) as today_users,
        COALESCE(SUM(money), 0) as total_money,
        COALESCE(SUM(usdt), 0) as total_usdt
      FROM fa_user
    `);

    // 2. Thống kê Nạp tiền
    const [rechargeStats] = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'approved' THEN money ELSE 0 END), 0) as total_recharge,
        COALESCE(SUM(CASE WHEN status = 'approved' AND DATE(created_at) = CURDATE() THEN money ELSE 0 END), 0) as today_recharge,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_recharge_count
      FROM fa_upmark
    `);

    // 3. Thống kê Rút tiền
    const [withdrawStats] = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) as total_withdraw,
        COALESCE(SUM(CASE WHEN status = 'approved' AND DATE(created_at) = CURDATE() THEN amount ELSE 0 END), 0) as today_withdraw,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_withdraw_count
      FROM fa_downmark
    `);

    // 4. Thống kê Đơn cược
    const [orderStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_orders,
        COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN buy_money ELSE 0 END), 0) as today_bet_money,
        COALESCE(SUM(CASE WHEN status = 'holding' THEN 1 ELSE 0 END), 0) as holding_orders_count
      FROM fa_order
    `);

    // 5. Thống kê KYC chờ duyệt
    const [kycStats] = await pool.query(`
      SELECT COUNT(*) as pending_kyc_count FROM fa_user_verify WHERE status = 1
    `);

    return success(res, 'Lấy thống kê Dashboard thành công', {
      user: userStats[0],
      recharge: rechargeStats[0],
      withdraw: withdrawStats[0],
      order: orderStats[0],
      pending_kyc: kycStats[0].pending_kyc_count,
    });
  } catch (err) {
    return error(res, 'Lỗi lấy thống kê Dashboard: ' + err.message);
  }
}

module.exports = {
  getDashboardStats,
};
