import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const start = bundle.indexOf('s.src=function(e){');
console.log(bundle.slice(start + 2000, start + 4500));
