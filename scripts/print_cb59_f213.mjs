import fs from 'fs';

const content = fs.readFileSync('scripts/register.chunk.js', 'utf8');

function printKey(key) {
  const re = new RegExp(`(?:["']?${key}["']?):function`, 'g');
  const m = re.exec(content);
  if (!m) {
    console.log(`Key ${key} not found`);
    return;
  }
  const start = m.index;
  console.log(`\n=================== KEY: ${key} (start: ${start}) ===================`);
  console.log(content.slice(start, start + 3000));
}

printKey('cb59');
printKey('f213');
