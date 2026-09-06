import fs from 'fs';

async function download(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log('Failed:', url, res.status);
      return;
    }
    const text = await res.text();
    fs.writeFileSync(dest, text);
    console.log('Saved:', dest, 'Length:', text.length);
  } catch (e) {
    console.error('Error fetching', url, e.message);
  }
}

async function main() {
  await download('https://spotline888.org/static/index.149e085d.css', 'scripts/index.css');
  await download('https://spotline888.org/static/js/pages-login-login.0de61000.js', 'scripts/login.chunk.js');
  await download('https://spotline888.org/static/js/pages-Detail-Detail~pages-index-index~pages-login-login~pages-login-register~pages-set-set~pages-ver~fdfef7a3.a5fdf638.js', 'scripts/shared.chunk.js');
}

main();
