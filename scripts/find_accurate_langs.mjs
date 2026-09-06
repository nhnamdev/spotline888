import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// The 11 language codes:
const langConfigs = [
  { code: 'zh-CN', marker: '账号登录', name: '简体中文' },
  { code: 'id-ID', marker: 'Masuk akun', name: 'Bahasa Indonesia' },
  { code: 'ms-MY', marker: 'Log Masuk Akaun', name: 'Bahasa Melayu' },
  { code: 'hk-TW', marker: '帳號登入', name: '繁體中文' },
  { code: 'en-US', marker: 'Account Login', name: 'English' },
  { code: 'ja-JP', marker: 'アカウントログイン', name: '日本語' },
  { code: 'th-TH', marker: 'ลงทะเบียนตอนนี้', name: 'ภาษาไทย' },
  { code: 'vi-VN', marker: 'Đăng nhập tài khoản', name: 'Tiếng Việt' },
  { code: 'ko-KR', marker: '계정 로그인', name: '한국어' },
  { code: 'fr-FR', marker: 'Connexion au compte', name: 'Français' },
  { code: 'de-DE', marker: 'Kontoanmeldung', name: 'Deutsch' }
];

const results = {};

for (const cfg of langConfigs) {
  const p = bundle.indexOf(cfg.marker);
  if (p !== -1) {
    // grab a chunk of 30000 chars surrounding it
    const start = Math.max(0, p - 5000);
    const end = Math.min(bundle.length, p + 25000);
    const chunk = bundle.slice(start, end);
    
    // find module boundary or all "key": "value" pairs
    const pairs = {};
    const regex = /"([a-zA-Z0-9_\.]+)":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let m;
    while ((m = regex.exec(chunk)) !== null) {
      pairs[m[1]] = m[2].replace(/\\"/g, '"');
    }
    results[cfg.code] = {
      name: cfg.name,
      code: cfg.code,
      login_zhdl: pairs['login.zhdl'] || '',
      login_zh: pairs['login.zh'] || '',
      login_qsrzh: pairs['login.qsrzh'] || '',
      login_mm: pairs['login.mm'] || '',
      login_qsrmm: pairs['login.qsrmm'] || '',
      login_dl: pairs['login.dl'] || '',
      login_register_now: pairs['login.register_now'] || pairs['login.ljzc'] || '',
      login_online_service: pairs['login.online_service'] || '',
      app_yysz: pairs['app.yysz'] || '',
      app_qx: pairs['app.qx'] || ''
    };
  } else {
    console.log(`Marker not found for ${cfg.code}: ${cfg.marker}`);
  }
}

console.log(JSON.stringify(results, null, 2));
fs.writeFileSync('scripts/accurate_11_langs.json', JSON.stringify(results, null, 2));
