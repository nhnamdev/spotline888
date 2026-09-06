import fs from 'fs';

const html = fs.readFileSync('scripts/live_dom.html', 'utf8');
const idx = html.indexOf('class="pg"');
console.log(html.slice(idx + 2200, idx + 6000));
