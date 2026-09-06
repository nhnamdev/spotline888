import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// The languages object was defined around 157573:
// x={"zh-CN":u.default,"hk-TW":m.default,"en-US":c.default,"ja-JP":f.default,"th-TH":g.default,"vi-VN":p.default,"id-ID":h.default,"ko-KR":w.default,"fr-FR":y.default,"de-DE":b.default,"ms-MY":k.default}
// u=n(t("9ed8")),m=n(t("e338")),c=n(t("d46b")),f=n(t("ffb6")),g=n(t("d97d")),p=n(t("8b9f")),h=n(t("3e7e")),w=n(t("b30d")),y=n(t("3f35")),b=n(t("fdd8")),k=n(t("ec21"))

const moduleMap = {
  'zh-CN': '9ed8',
  'hk-TW': 'e338',
  'en-US': 'd46b',
  'ja-JP': 'ffb6',
  'th-TH': 'd97d',
  'vi-VN': '8b9f',
  'id-ID': '3e7e',
  'ko-KR': 'b30d',
  'fr-FR': '3f35',
  'de-DE': 'fdd8',
  'ms-MY': 'ec21'
};

const extracted = {};

for (const [lang, modId] of Object.entries(moduleMap)) {
  const modPattern = `"${modId}":function`;
  const idx = bundle.indexOf(modPattern);
  if (idx !== -1) {
    const chunk = bundle.slice(idx, idx + 25000);
    // Find all "login....": "..." or "app....": "..."
    const dict = {};
    const pairRegex = /"((?:login|app|service|user)\.[a-zA-Z0-9_\.]+)":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let match;
    while ((match = pairRegex.exec(chunk)) !== null) {
      dict[match[1]] = match[2].replace(/\\"/g, '"');
    }
    extracted[lang] = dict;
  }
}

console.log('Extracted languages:', Object.keys(extracted));
fs.writeFileSync('scripts/extracted_all_languages.json', JSON.stringify(extracted, null, 2));

// Print summary for login keys
for (const lang of Object.keys(extracted)) {
  console.log(`\n=== ${lang} ===`);
  for (const k of ['login.zhdl', 'login.zh', 'login.qsrzh', 'login.mm', 'login.qsrmm', 'login.dl', 'login.register_now', 'login.online_service', 'app.yysz', 'app.qx']) {
    console.log(`  ${k}: "${extracted[lang][k]}"`);
  }
}
