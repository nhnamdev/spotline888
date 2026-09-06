import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');

// Find css loading
const cssMatches = bundle.match(/static\/css\/[^"']+/g) || [];
console.log('CSS matches in index.bundle:', [...new Set(cssMatches)]);

// Check if webpack loads css via mini-css-extract-plugin
const miniCss = bundle.match(/"static\/css\/".*?\.css/g) || [];
console.log('Mini css matches:', miniCss);

// Search for login in css
const idx = bundle.indexOf('.css');
console.log('first .css index:', idx);
