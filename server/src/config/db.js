const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || '36.50.27.243',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'fortrade_user',
  password: process.env.DB_PASS || 'fortrade_pass',
  database: process.env.DB_NAME || 'fortrade_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+07:00',
});

// Hàm kiểm tra kết nối CSDL
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ [MySQL] Kết nối thành công đến cơ sở dữ liệu: ' + (process.env.DB_NAME || 'fortrade_db'));
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ [MySQL] Lỗi kết nối cơ sở dữ liệu:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
};
