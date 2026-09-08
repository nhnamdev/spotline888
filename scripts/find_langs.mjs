import fs from 'fs';

const content = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Search for language objects definition in index.bundle.js
// Usually defined as: var e = { "zh-CN": { ... }, "vi-VN": { ... } } or similar
// Or searching for the modules that define the translations.

const langs = ['zh-CN', 'id-ID', 'ms-MY', 'hk-TW', 'en-US', 'ja-JP', 'th-TH', 'vi-VN', 'ko-KR', 'fr-FR', 'de-DE'];

for (const lang of langs) {
  const idx = content.indexOf(`"${lang}"`);
  console.log(`Lang ${lang} found at:`, idx);
}
