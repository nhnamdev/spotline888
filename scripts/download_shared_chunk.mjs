async function downloadSharedChunk() {
  const url = 'https://spotline888.org/static/js/pages-Detail-Detail~pages-index-index~pages-login-login~pages-login-register~pages-set-set~pages-ver~fdfef7a3.a5fdf638.js';
  const res = await fetch(url);
  console.log('Shared chunk status:', res.status);
  const text = await res.text();
  const fs = await import('fs');
  fs.writeFileSync('scripts/index_shared.js', text);

  // Search for the missing IDs
  const ids = ['fe75', 'de53', 'f5c9', 'f5c1', 'e864', '8981'];
  for (const id of ids) {
    const p = text.indexOf(`"${id}":`);
    console.log(id, 'pos in shared:', p);
    if (p !== -1) {
      console.log(text.slice(p, p + 250));
    }
  }
}

downloadSharedChunk().catch(console.error);
