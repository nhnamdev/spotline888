async function downloadChunk() {
  const url = 'https://spotline888.org/static/js/pages-index-index.c2f436c1.js';
  console.log('Fetching', url);
  const res = await fetch(url);
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Downloaded length:', text.length);
  const fs = await import('fs');
  fs.writeFileSync('scripts/pages-index-index.js', text);

  // Also check if there is a CSS chunk
  const cssUrls = [
    'https://spotline888.org/static/css/pages-index-index.css',
    'https://spotline888.org/static/css/pages-index-index.c2f436c1.css',
    'https://spotline888.org/static/css/pages-index-index.38b95a6f.css',
  ];
  for (const cu of cssUrls) {
    const cr = await fetch(cu);
    console.log(`CSS ${cu} status:`, cr.status);
    if (cr.status === 200) {
      const ctext = await cr.text();
      fs.writeFileSync('scripts/pages-index-index.css', ctext);
    }
  }
}

downloadChunk().catch(console.error);
