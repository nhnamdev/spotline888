import fs from 'fs';

const html = fs.readFileSync('scripts/general_config_inner.html', 'utf-8');

const navTabsPos = html.indexOf('nav-tabs');
console.log('navTabsPos:', navTabsPos);
if (navTabsPos !== -1) {
  console.log(html.slice(navTabsPos - 100, navTabsPos + 1500));
}
