const { pool } = require('../config/db');
const { success, error } = require('../utils/response');
const { getPublicUrl } = require('../utils/r2');

/**
 * Lấy trạng thái và thông tin hồ sơ KYC của User
 * Route: GET /api/user/verify
 */
async function getVerifyStatus(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, real_name, id_card, id_img_front, id_img_back, profession, status, error_reason, created_at, audit_time 
       FROM fa_user_verify 
       WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    const verifyData = rows.length > 0 ? rows[0] : null;

    return success(res, 'Lấy trạng thái xác minh thành công', {
      is_auth: req.user.is_auth, // 0: chưa, 1: chờ duyệt, 2: đã duyệt, 3: từ chối
      verify: verifyData,
    });
  } catch (err) {
    return error(res, 'Lỗi kiểm tra xác thực: ' + err.message);
  }
}

/**
 * Nộp hồ sơ xác thực danh tính KYC
 * Route: POST /api/user/verify
 */
async function submitVerify(req, res) {
  try {
    const userId = req.user.id;
    const real_name = req.body.real_name || req.body.realName || req.body.fullName || req.body.name || '';
    const id_card = req.body.id_card || req.body.idCard || req.body.idNumber || '';
    const id_img_front = req.body.id_img_front || req.body.frontImg || req.body.frontCardUrl || '';
    const id_img_back = req.body.id_img_back || req.body.backImg || req.body.backCardUrl || '';
    const profession = req.body.profession || 'Kinh doanh';

    if (!real_name || !real_name.trim()) {
      return error(res, 'Vui lòng nhập họ và tên thật');
    }
    if (!id_card || !id_card.trim()) {
      return error(res, 'Vui lòng nhập số CMND / CCCD / Hộ chiếu');
    }
    if (!id_img_front) {
      return error(res, 'Vui lòng tải lên ảnh mặt trước giấy tờ');
    }
    if (!id_img_back) {
      return error(res, 'Vui lòng tải lên ảnh mặt sau giấy tờ');
    }

    const finalFront = getPublicUrl(id_img_front);
    const finalBack = getPublicUrl(id_img_back);

    // Kiểm tra xem đã gửi trước đó chưa
    const [existing] = await pool.query('SELECT id, status FROM fa_user_verify WHERE user_id = ?', [userId]);

    if (existing.length > 0) {
      if (existing[0].status === 2) {
        return error(res, 'Tài khoản của bạn đã được xác minh thành công');
      }

      // Cập nhật lại hồ sơ để duyệt lại
      await pool.query(
        `UPDATE fa_user_verify 
         SET real_name = ?, id_card = ?, id_img_front = ?, id_img_back = ?, profession = ?, status = 1, error_reason = NULL, updated_at = NOW()
         WHERE user_id = ?`,
        [real_name.trim(), id_card.trim(), finalFront, finalBack, profession || '', userId]
      );
    } else {
      await pool.query(
        `INSERT INTO fa_user_verify (user_id, real_name, id_card, id_img_front, id_img_back, profession, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, NOW())`,
        [userId, real_name.trim(), id_card.trim(), finalFront, finalBack, profession || '']
      );
    }

    // Cập nhật trạng thái chờ duyệt vào bảng fa_user
    await pool.query(
      `UPDATE fa_user SET is_auth = 1, real_name = ? WHERE id = ?`,
      [real_name.trim(), userId]
    );

    return success(res, 'Gửi hồ sơ xác minh thành công, vui lòng chờ quản trị viên phê duyệt');
  } catch (err) {
    return error(res, 'Gửi hồ sơ thất bại: ' + err.message);
  }
}

module.exports = {
  getVerifyStatus,
  submitVerify,
};
