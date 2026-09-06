import fs from 'fs';

async function main() {
  const res = await fetch('https://spotline888.org/static/js/index.109700a5.js');
  const text = await res.text();
  console.log('index.js length:', text.length);
  fs.writeFileSync('scripts/index.bundle.js', text);
  
  // Look for chunks
  const chunks = text.match(/\/static\/js\/[a-zA-Z0-9_.-]+\.js/g);
  console.log('Referenced chunks:', [...new Set(chunks || [])]);
}

main().catch(console.error);
