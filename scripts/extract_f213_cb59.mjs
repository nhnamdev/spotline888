import fs from 'fs';

const content = fs.readFileSync('scripts/register.chunk.js', 'utf8');

function printModule(id) {
  const start = content.indexOf(`"${id}":function`);
  if (start === -1) {
    console.log(`Module ${id} not found`);
    return;
  }
  // find next module start or end
  const next = content.indexOf('":function', start + 20);
  const end = next !== -1 ? content.lastIndexOf(',', next) : content.length;
  console.log(`=== MODULE ${id} ===`);
  console.log(content.slice(start, end));
}

printModule('f213');
printModule('cb59');
