/**
 * Chuẩn hóa format phản hồi JSON tương thích với client và FastAdmin
 */

function success(res, msg = 'Thành công', data = null, statusCode = 200) {
  return res.status(statusCode).json({
    code: 1,
    msg,
    data,
    time: Math.floor(Date.now() / 1000),
  });
}

function error(res, msg = 'Đã có lỗi xảy ra', data = null, statusCode = 200) {
  return res.status(statusCode).json({
    code: 0,
    msg,
    data,
    time: Math.floor(Date.now() / 1000),
  });
}

module.exports = {
  success,
  error,
};
