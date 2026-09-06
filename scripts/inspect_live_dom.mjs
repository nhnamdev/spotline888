import fs from 'fs';

const html = fs.readFileSync('scripts/live_dom.html', 'utf8');

// Find pg or login container
const idx = html.indexOf('class="pg"');
console.log('class="pg" idx:', idx);
if (idx !== -1) {
  console.log(html.slice(idx - 100, idx + 2500));
}
