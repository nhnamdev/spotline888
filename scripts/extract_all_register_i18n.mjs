import fs from 'fs';

const content = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// The register keys used in f213 and cb59:
const keys = [
  'login.zhzc',
  'login.phone',
  'login.phone_placeholder',
  'login.account',
  'login.account_placeholder',
  'login.password',
  'login.password_placeholder',
  'login.trade_password',
  'login.trade_password_placeholder',
  'login.khm',
  'login.qsrkhm',
  'login.wczc',
  'login.bsty',
  'login.yszc',
  'login.has_account',
  'login.qsrsjh',
  'login.zccg',
  'login.zccgts',
  'app.qd',
  'app.qx',
  'app.yysz',
];

// Let's search how i18n objects are constructed in index.bundle.js
// Look for language codes: zh-CN, vi-VN, en-US, id-ID, ms-MY, hk-TW, ja-JP, th-TH, ko-KR, fr-FR, de-DE
const langCodes = ['zh-CN', 'id-ID', 'ms-MY', 'hk-TW', 'en-US', 'ja-JP', 'th-TH', 'vi-VN', 'ko-KR', 'fr-FR', 'de-DE'];

// In index.bundle.js, let's find all occurrences like (0,i.default)(r,"login.zhzc", ...)
const results = {};
for (const k of keys) {
  results[k] = [];
  let idx = 0;
  while ((idx = content.indexOf(`"${k}"`, idx)) !== -1) {
    const snippet = content.slice(idx, idx + 100);
    // extract value: ,"login.zhzc","value"
    const m = snippet.match(/"([^"]+)",\s*"([^"]+)"/);
    if (m) {
      results[k].push(m[2]);
    }
    idx += k.length + 2;
  }
}

console.log('Register i18n occurrences:');
for (const [k, vals] of Object.entries(results)) {
  console.log(k, '->', vals);
}
