const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🚀 KHỞI ĐỘNG HỆ THỐNG PRODUCTION SPOTLINE888');
console.log('====================================================');

let backendProc = null;
let frontendProc = null;
let isShuttingDown = false;

function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('\n🛑 Đang dừng toàn bộ tiến trình production...');
  if (backendProc) {
    try { backendProc.kill('SIGTERM'); } catch {}
  }
  if (frontendProc) {
    try { frontendProc.kill('SIGTERM'); } catch {}
  }
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

// 1. Khởi động Express Backend (Port 5000)
const backendPort = process.env.BACKEND_PORT || '5000';
console.log(`⚙️  [1/2] Đang khởi động Express API Backend (Cổng ${backendPort})...`);

backendProc = spawn('node', ['server/src/server.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: backendPort,
  },
});

backendProc.on('error', (err) => {
  console.error('❌ Lỗi tiến trình Backend:', err);
});

backendProc.on('exit', (code, signal) => {
  if (!isShuttingDown) {
    console.warn(`⚠️ Tiến trình Backend đã dừng (code: ${code}, signal: ${signal})`);
    shutdown();
  }
});

// 2. Chờ 1.5 giây để backend sẵn sàng, sau đó khởi chạy Next.js (Port 3000)
setTimeout(() => {
  if (isShuttingDown) return;
  const frontendPort = process.env.PORT || '3000';
  console.log(`🌐 [2/2] Đang khởi động Next.js Production Server (Cổng ${frontendPort})...`);

  const nextBin = path.join(rootDir, 'node_modules/next/dist/bin/next');
  frontendProc = spawn('node', [nextBin, 'start', '-p', frontendPort, '-H', '0.0.0.0'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: frontendPort,
    },
  });


  frontendProc.on('error', (err) => {
    console.error('❌ Lỗi tiến trình Frontend:', err);
  });

  frontendProc.on('exit', (code, signal) => {
    if (!isShuttingDown) {
      console.warn(`⚠️ Tiến trình Frontend đã dừng (code: ${code}, signal: ${signal})`);
      shutdown();
    }
  });
}, 1500);
