import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Let's find language codes and all their keys for login and app
const langCodes = [
  'zh-CN', 'en-US', 'vi-VN', 'id-ID', 'ms-MY', 'th-TH', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'hk-TW'
];

// Let's see how i18n is initialized in the bundle
const langMap = {};

// Find all occurrences of login.register_now, login.online_service, app.yysz, app.qx, login.dl
const keysToSearch = [
  'login.zhdl', 'login.zh', 'login.qsrzh', 'login.mm', 'login.qsrmm', 
  'login.dl', 'login.register_now', 'login.online_service', 'login.ljzc',
  'app.yysz', 'app.qx'
];

keysToSearch.forEach(key => {
  const re = new RegExp(`["']${key.replace('.', '\\.')}["']\\s*,\\s*["']([^"']+)["']|["']${key.replace('.', '\\.')}["']\\s*:\\s*["']([^"']+)["']`, 'g');
  const matches = [...bundle.matchAll(re)];
  console.log(`Key ${key}: found ${matches.length} matches:`, matches.map(m => m[1] || m[2]));
});
