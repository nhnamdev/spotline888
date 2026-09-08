import http from 'http';

function testUrl(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        console.log(`Testing ${path}...`);
        console.log(`Status ${path}:`, res.statusCode);
        console.log(`Contains 账号注册:`, data.includes('账号注册'));
        console.log(`Contains 手机号:`, data.includes('手机号'));
        console.log(`Contains 交易密码:`, data.includes('交易密码'));
        console.log(`Contains 开户码:`, data.includes('开户码'));
        console.log(`Contains 完成注册:`, data.includes('完成注册'));
        console.log(`Contains 已有账号，去登录:`, data.includes('已有账号，去登录'));
        resolve(res.statusCode === 200);
      });
    }).on('error', (err) => {
      console.error(`Error ${path}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  await testUrl('/register');
  await testUrl('/pages/login/register');
  await testUrl('/pages/register/register');
}

run();
