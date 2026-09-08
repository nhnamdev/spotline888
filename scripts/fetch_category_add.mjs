import fs from 'fs';

const cookie = fs.readFileSync('scripts/auth_cookie.txt', 'utf8').trim();

async function fetchAdd() {
  const url = 'https://spotline888.org/coinht.php/category/add';
  const res = await fetch(url, {
    headers: {
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/category_add.html', html, 'utf8');
  console.log(`Fetched category/add (${html.length} bytes)`);
}

fetchAdd();
