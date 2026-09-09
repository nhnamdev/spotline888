const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = require('./app');
const { testConnection } = require('./config/db');
const { initSchema } = require('./migrations/initSchema');

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    console.log('🚀 Đang khởi động Backend Server Spotline888...');

    // 1. Kiểm tra kết nối MySQL
    const isDbConnected = await testConnection();
    if (!isDbConnected) {
      console.warn('⚠️ Không thể kết nối tới MySQL ngay lúc này. Server vẫn sẽ khởi chạy và thử kết nối lại khi có yêu cầu.');
    } else {
      // 2. Tự động kiểm tra và khởi tạo cấu trúc bảng nếu cần
      try {
        await initSchema();
        const { seedData } = require('./migrations/seedHardcodedData');
        await seedData();
        const { seedRemainingData } = require('./migrations/seedRemainingData');
        await seedRemainingData();
      } catch (schemaErr) {
        console.error('⚠️ Lỗi khi chạy migration / seed:', schemaErr.message);
      }
    }

    // 3. Lắng nghe trên PORT
    app.listen(PORT, () => {
      console.log(`🌟 [Server] Backend Express đang chạy tại: http://localhost:${PORT}`);
      console.log(`📡 [API Endpoint]: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error);
    process.exit(1);
  }
}

startServer();
