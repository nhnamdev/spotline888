import fs from 'fs';

const dom = fs.readFileSync('scripts/index_real_dom.html', 'utf8');
console.log('DOM length:', dom.length);

// Extract all image sources (img src or uni-image)
const imgSources = [];
const imgRegex = /(?:src|url)\s*[:=]\s*["']([^"']+\.(?:png|jpg|jpeg|svg|webp|gif)[^"']*)["']/gi;
let m;
while ((m = imgRegex.exec(dom)) !== null) {
  imgSources.push(m[1]);
}

const uniqueImgs = [...new Set(imgSources)];
console.log('Unique images in DOM:', uniqueImgs);
fs.writeFileSync('scripts/index_dom_images.json', JSON.stringify(uniqueImgs, null, 2));

// Extract all CSS classes
const classRegex = /class="([^"]+)"/g;
const classes = new Set();
while ((m = classRegex.exec(dom)) !== null) {
  m[1].split(/\s+/).forEach(c => classes.add(c));
}
console.log('Sample classes:', [...classes].slice(0, 30));
fs.writeFileSync('scripts/index_dom_classes.json', JSON.stringify([...classes], null, 2));
