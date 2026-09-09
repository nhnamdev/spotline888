const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * Băm mật khẩu sử dụng bcrypt
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * So khớp mật khẩu (Hỗ trợ cả bcrypt và md5 salt chuẩn FastAdmin)
 */
async function comparePassword(inputPassword, storedHash, salt = '') {
  if (!inputPassword || !storedHash) return false;

  // Nếu mật khẩu trong DB là bcrypt hash
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    return bcrypt.compare(inputPassword, storedHash);
  }

  // Nếu mật khẩu trong DB là MD5 FastAdmin (md5(md5(pass) + salt) hoặc plain md5)
  const md5Pass = crypto.createHash('md5').update(inputPassword).digest('hex');
  if (storedHash.toLowerCase() === md5Pass.toLowerCase()) {
    return true;
  }

  if (salt) {
    const saltedMd5 = crypto.createHash('md5').update(md5Pass + salt).digest('hex');
    if (storedHash.toLowerCase() === saltedMd5.toLowerCase()) {
      return true;
    }
  }

  // Hỗ trợ mật khẩu demo thuần text nếu chưa hash
  return inputPassword === storedHash;
}

module.exports = {
  hashPassword,
  comparePassword,
};
