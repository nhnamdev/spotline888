import fs from 'fs';

const content = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const langModules = {
  "zh-CN": "9ed8",
  "hk-TW": "e338",
  "en-US": "d46b",
  "ja-JP": "ffb6",
  "th-TH": "d97d",
  "vi-VN": "8b9f",
  "id-ID": "3e7e",
  "ko-KR": "b30d",
  "fr-FR": "3f35",
  "de-DE": "fdd8",
  "ms-MY": "ec21",
};

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

const langDicts = {};

for (const [lang, modId] of Object.entries(langModules)) {
  // Find where module starts: `modId:function` or `"modId":function`
  let start = content.indexOf(`"${modId}":function`);
  if (start === -1) start = content.indexOf(`${modId}:function`);
  if (start === -1) {
    console.log(`Module ${modId} for ${lang} not found`);
    continue;
  }
  // Find end of module
  const nextMod = content.indexOf('":function', start + 30);
  const modText = content.slice(start, nextMod !== -1 ? nextMod : start + 30000);
  
  langDicts[lang] = {};
  for (const k of keys) {
    // Find (r,"login.zhzc","value") or [k, "value"] or (0,i.default)(r,"login.zhzc","value")
    const searchStr = `"${k}","`;
    const idx = modText.indexOf(searchStr);
    if (idx !== -1) {
      const valStart = idx + searchStr.length;
      const valEnd = modText.indexOf('"', valStart);
      langDicts[lang][k] = modText.slice(valStart, valEnd);
    } else {
      // fallback search with single quotes or different format
      const re = new RegExp(`"${k.replace('.', '\\.')}",\\s*"([^"]+)"`);
      const m = modText.match(re);
      if (m) {
        langDicts[lang][k] = m[1];
      }
    }
  }
}

fs.writeFileSync('scripts/extracted_register_i18n.json', JSON.stringify(langDicts, null, 2));
console.log('Successfully saved extracted_register_i18n.json!');
