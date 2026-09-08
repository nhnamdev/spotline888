import fs from 'fs';

const content = fs.readFileSync('scripts/register.chunk.js', 'utf8');

function extractBetween(str, startToken, endToken) {
  const start = str.indexOf(startToken);
  if (start === -1) return '';
  const end = str.indexOf(endToken, start);
  return end === -1 ? str.slice(start) : str.slice(start, end);
}

fs.writeFileSync('scripts/cb59_extracted.js', extractBetween(content, 'cb59:function', 'cf77:function'));
fs.writeFileSync('scripts/f213_extracted.js', extractBetween(content, 'f213:function', 'f6d7:function'));
console.log('Saved cb59_extracted.js and f213_extracted.js');
