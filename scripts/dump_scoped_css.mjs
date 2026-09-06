import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

const startIdx = js.indexOf('.func-card');
const endIdx = js.indexOf('/* 列表区 */', startIdx) + 2000;
const rawCss = js.substring(startIdx - 500, endIdx);

// Convert %?X?% to rpx
const cleanCss = rawCss.replace(/%\?(\d+)\?%/g, '$1rpx');
fs.writeFileSync('scripts/index_extracted_scoped.css', cleanCss);
console.log('Saved index_extracted_scoped.css');
