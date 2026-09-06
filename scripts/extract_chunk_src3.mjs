import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

const start = bundle.indexOf('"pages-login-register":"63f304f2"');
console.log(bundle.slice(start, start + 300));
