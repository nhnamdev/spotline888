import fs from 'fs';

const content = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

// Extract all CSS in pages-index-index.js
const cssMatches = content.match(/\[t\.i,\"(.*?)\",\"\"\]/gs) || [];
console.log('CSS matches count:', cssMatches.length);
let combinedCss = '';
cssMatches.forEach((m, idx) => {
  const css = m.replace(/\[t\.i,\"/, '').replace(/\",\"\"\]$/, '').replace(/\\n/g, '\n').replace(/\\"/g, '"');
  combinedCss += `\n/* --- CSS Chunk ${idx} --- */\n` + css;
});
fs.writeFileSync('scripts/index_extracted.css', combinedCss);
console.log('Saved scripts/index_extracted.css, length:', combinedCss.length);

// Extract all image assets referenced
const imgMatches = [...content.matchAll(/static\/img\/[a-zA-Z0-9_\-\.]+\.(?:png|jpg|jpeg|svg|webp|gif)/gi)];
const uniqueImgs = [...new Set(imgMatches.map(m => m[0]))];
console.log('Images found:', uniqueImgs);
fs.writeFileSync('scripts/index_images.json', JSON.stringify(uniqueImgs, null, 2));

// Extract all API endpoints called
const apiMatches = [...content.matchAll(/(?:\/api\/|\/index\/|\/user\/|\/product\/|\/money\/)[a-zA-Z0-9_\/]+/g)];
console.log('API endpoints found:', [...new Set(apiMatches.map(m => m[0]))]);
