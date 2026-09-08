import fs from 'fs';

const content = fs.readFileSync('scripts/register.chunk.js', 'utf8');

function extractBetween(str, startToken, endToken) {
  const start = str.indexOf(startToken);
  if (start === -1) return '';
  const end = str.indexOf(endToken, start);
  return end === -1 ? str.slice(start) : str.slice(start, end);
}

console.log('--- cb59 (Component logic) ---');
console.log(extractBetween(content, 'cb59:function', 'cf77:function'));

console.log('\n--- f213 (Template / Render) ---');
console.log(extractBetween(content, 'f213:function', 'f6d7:function'));

console.log('\n--- 3d2b (CSS) ---');
console.log(extractBetween(content, '3d2b":function', '49f9":function'));
