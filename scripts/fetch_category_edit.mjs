import fs from 'fs';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf8').trim();

async function fetchEdit() {
  const url = 'https://spotline888.org/coinht.php/category/edit/ids/11';
  const res = await fetch(url, {
    headers: {
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/category_edit.html', html, 'utf8');
  console.log(`Fetched category/edit (${html.length} bytes)`);
}

fetchEdit();
