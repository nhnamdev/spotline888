import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');
const ids = ['fe75', 'de53', 'f5c9', 'f5c1', 'e864', '8981'];

for (const id of ids) {
  const p = bundle.indexOf(`"${id}":`);
  console.log(id, 'pos in bundle:', p);
  if (p !== -1) {
    console.log(bundle.slice(p, p + 250));
  }
}
