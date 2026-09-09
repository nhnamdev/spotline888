const { spawn, execSync } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const rootDir = path.resolve(__dirname, '..');

console.log('\n===============================================================');
console.log('🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG SPOTLINE888 (BACKEND + FRONTEND)...');
console.log('===============================================================\n');

let serverProcess = null;
let frontendProcess = null;
let isShuttingDown = false;

function killProcess(proc) {
  if (!proc || !proc.pid) return;
  try {
    if (isWindows) {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
    } else {
      process.kill(-proc.pid, 'SIGTERM');
    }
  } catch (e) {
    try {
      proc.kill('SIGTERM');
    } catch {}
  }
}

function cleanup() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('\n\n🛑 Đang dừng cả Backend và Frontend...');
  killProcess(serverProcess);
  killProcess(frontendProcess);
  console.log('✅ Đã tắt hoàn tất.\n');
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// 1. Khởi động Backend Express (cổng 5000)
console.log('⚙️  [1/2] Đang khởi động Backend Server (Port 5000)...');
serverProcess = spawn('node', [path.join(rootDir, 'server/src/server.js')], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: isWindows,
  env: { ...process.env },
  detached: !isWindows,
});

serverProcess.on('error', (err) => {
  console.error('❌ Lỗi tiến trình Backend:', err.message);
});

// 2. Chờ 1.5 giây để Backend kết nối DB rồi khởi động Frontend Next.js (cổng 3000)
setTimeout(() => {
  if (isShuttingDown) return;
  console.log('\n🌐 [2/2] Đang khởi động Frontend Next.js (Port 3000)...');

  const npmCmd = isWindows ? 'npm.cmd' : 'npm';
  frontendProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env },
    detached: !isWindows,
  });

  frontendProcess.on('error', (err) => {
    console.error('❌ Lỗi tiến trình Frontend:', err.message);
  });
}, 1500);
