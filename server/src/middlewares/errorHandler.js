const { error } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error('💥 [Server Error]:', err);
  return error(res, err.message || 'Lỗi máy chủ nội bộ', null, 500);
}

module.exports = errorHandler;
