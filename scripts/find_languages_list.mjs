import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');
const p = bundle.indexOf('zh-CN');
console.log('zh-CN pos:', p);

// search for list containing 'zh-CN', 'en-US', etc.
const re = /\[\s*\{[^\}]*name[^\}]*\}[\s\S]*?\]/g;
let m;
while ((m = re.exec(bundle)) !== null) {
  if (m[0].includes('zh-CN') || m[0].includes('简体中文') || m[0].includes('Tiếng Việt')) {
    console.log('Match:\n', m[0]);
    break;
  }
}

// Or search for 'Tiếng Việt'
const tvPos = bundle.indexOf('Tiếng Việt');
console.log('Tiếng Việt pos:', tvPos);
if (tvPos !== -1) {
  console.log(bundle.slice(tvPos - 200, tvPos + 800));
}
