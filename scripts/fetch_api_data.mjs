import fs from 'fs';

async function main() {
  try {
    const res = await fetch('https://spotline888.org/api/index/index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hideLoading: true })
    });
    const data = await res.json();
    console.log('api/index/index response:', JSON.stringify(data, null, 2));
    if (data && data.data && data.data.image) {
      console.log('Logo image relative URL:', data.data.image);
      const imgRes = await fetch('https://spotline888.org' + data.data.image);
      const arrayBuffer = await imgRes.arrayBuffer();
      fs.writeFileSync('scripts/logo.png', Buffer.from(arrayBuffer));
      console.log('Saved scripts/logo.png!');
    }
  } catch (e) {
    console.error('Error in index/index:', e);
  }

  try {
    const res2 = await fetch('https://spotline888.org/api/login/getSiteConfig', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data2 = await res2.json();
    console.log('api/login/getSiteConfig response:', JSON.stringify(data2, null, 2));
  } catch (e) {
    console.error('Error in getSiteConfig:', e);
  }
}

main();
