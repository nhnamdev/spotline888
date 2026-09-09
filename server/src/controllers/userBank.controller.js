const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách tài khoản ngân hàng và ví tiền điện tử của User
 * Route: GET /api/user/bank
 */
async function getBankAccounts(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, type, bank_name, bank_branch, card_number, account_holder, nationality, is_default, created_at 
       FROM fa_user_bank 
       WHERE user_id = ? 
       ORDER BY is_default DESC, id DESC`,
      [userId]
    );

    return success(res, 'Lấy danh sách tài khoản thành công', rows);
  } catch (err) {
    return error(res, 'Lỗi lấy tài khoản ngân hàng: ' + err.message);
  }
}

/**
 * Thêm hoặc liên kết tài khoản ngân hàng / ví USDT mới
 * Route: POST /api/user/bank
 */
async function bindBankAccount(req, res) {
  try {
    const userId = req.user.id;
    const rawCard = req.body.card_number || req.body.bankCard || req.body.accountNumber || req.body.cardNo || '';
    const rawBankName = req.body.bank_name || req.body.bankName || '';
    const rawBranch = req.body.bank_branch || req.body.bankBranch || req.body.branch || '';
    const rawHolder = req.body.account_holder || req.body.accountHolder || req.body.name || req.user.real_name || req.user.username || '';
    const type = req.body.type || 'bank';
    const nationality = req.body.nationality || 'Vietnam';

    if (!rawCard || !rawCard.trim()) {
      return error(res, 'Vui lòng nhập số tài khoản hoặc địa chỉ ví');
    }

    const holder = rawHolder.trim();
    if (type === 'bank' && !rawBankName) {
      return error(res, 'Vui lòng nhập tên ngân hàng');
    }

    // Kiểm tra xem đã có tài khoản mặc định chưa
    const [existing] = await pool.query('SELECT id FROM fa_user_bank WHERE user_id = ?', [userId]);
    const isDefault = existing.length === 0 ? 1 : 0;

    const [result] = await pool.query(
      `INSERT INTO fa_user_bank (user_id, type, bank_name, bank_branch, card_number, account_holder, nationality, is_default, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [userId, type, rawBankName || '', rawBranch || '', rawCard.trim(), holder, nationality, isDefault]
    );

    return success(res, 'Liên kết tài khoản thành công', { id: result.insertId });
  } catch (err) {
    return error(res, 'Liên kết tài khoản thất bại: ' + err.message);
  }
}

module.exports = {
  getBankAccounts,
  bindBankAccount,
};
