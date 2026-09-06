import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');
const pos = bundle.indexOf('语言设置');
console.log('Found 语言设置 at:', pos);
if (pos !== -1) {
  console.log(bundle.slice(pos - 200, pos + 600));
}

// Also find language list in bundle
const langMatches = [...bundle.matchAll(/langList|languageList|lang_list|languages/gi)];
console.log('Lang matches count:', langMatches.length);
langMatches.forEach((m) => {
  console.log('Match:', m[0], 'around:', bundle.slice(m.index - 50, m.index + 200));
});
