const path = require('path');
const crypto = require('crypto');
const { uploadBuffer, getPublicUrl } = require('../utils/r2');
const { success, error } = require('../utils/response');

/**
 * Controller xử lý tải tệp lên Cloudflare R2
 * Route: POST /api/upload
 * Route: POST /api/common/upload
 */
async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return error(res, 'Vui lòng chọn tệp để tải lên');
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // Giới hạn dung lượng tệp (tối đa 15MB)
    if (size > 15 * 1024 * 1024) {
      return error(res, 'Dung lượng tệp không được vượt quá 15MB');
    }

    // Sinh tên tệp ngẫu nhiên an toàn theo ngày tháng
    const now = new Date();
    const dateDir = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const ext = path.extname(originalname).toLowerCase() || '.jpg';
    const randomHash = crypto.randomBytes(8).toString('hex');
    const folderType = req.body.type || req.query.type || 'general'; // kyc, voucher, avatar, general

    const r2Key = `uploads/${folderType}/${dateDir}/${randomHash}${ext}`;

    // Tải trực tiếp Buffer lên Cloudflare R2
    const uploadResult = await uploadBuffer(buffer, r2Key, mimetype);

    return success(res, 'Tải tệp lên Cloudflare R2 thành công', {
      url: uploadResult.url,
      path: `/${r2Key}`,
      key: r2Key,
      filename: originalname,
      size,
      mimetype,
    });
  } catch (err) {
    console.error('Lỗi upload tệp lên R2:', err);
    return error(res, 'Lỗi tải tệp lên Cloudflare R2: ' + err.message);
  }
}

module.exports = {
  uploadFile,
};
