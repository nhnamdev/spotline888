import fs from 'fs';
import path from 'path';

const dir = 'public/sites/spotline888-org/pages-index-index';
const files = fs.readdirSync(dir).filter(f => f.startsWith('grid_icon_'));

files.forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(`${f}: ${stat.size} bytes`);
});
