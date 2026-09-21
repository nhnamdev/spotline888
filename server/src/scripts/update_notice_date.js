const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { pool } = require('../config/db');

async function updateNoticeDate() {
  try {
    console.log('🔄 Đang kiểm tra dữ liệu bảng fa_notice trên MySQL:', process.env.DB_HOST);
    const [rows] = await pool.query('SELECT id, type, title, created_at FROM fa_notice');
    console.log('📋 Danh sách thông báo hiện tại:');
    console.log(JSON.stringify(rows, null, 2));

    console.log('⏳ Đang cập nhật thời gian thông báo sang 2022-09-09 10:30:00...');
    const [result] = await pool.query(`
      UPDATE fa_notice 
      SET created_at = '2022-09-09 10:30:00' 
      WHERE type = 1 OR id = 4
    `);
    console.log(`✅ Cập nhật thành công! Số dòng bị ảnh hưởng: ${result.affectedRows}`);

    const [updatedRows] = await pool.query('SELECT id, type, title, created_at FROM fa_notice WHERE type = 1 OR id = 4');
    console.log('🎉 Dữ liệu sau khi cập nhật:');
    console.log(JSON.stringify(updatedRows, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật:', err.message);
    process.exit(1);
  }
}

updateNoticeDate();
