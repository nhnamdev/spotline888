import fs from 'fs';

const loginChunk = fs.readFileSync('scripts/login.chunk.js', 'utf8');

// Extract d749
const d749Match = loginChunk.match(/d749:function\(t,e\)\{t\.exports=\"(data:image\/png;base64,[^\"]+)\"/);
if (d749Match) {
  const base64Data = d749Match[1];
  console.log('d749 base64 length:', base64Data.length);
  const buffer = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync('scripts/lang_icon.png', buffer);
  console.log('Saved scripts/lang_icon.png');
}

// Extract cb74 full content
const cb74Idx = loginChunk.indexOf('cb74:function(');
const cb74End = loginChunk.indexOf('fb79:function(', cb74Idx);
const cb74Str = loginChunk.slice(cb74Idx, cb74End !== -1 ? cb74End : cb74Idx + 3000);
fs.writeFileSync('scripts/cb74.js', cb74Str);
console.log('Saved cb74.js, length:', cb74Str.length);
