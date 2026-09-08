import fs from 'fs';

const content = fs.readFileSync('scripts/register.chunk.js', 'utf8');
console.log('File size:', content.length);

// Let's format or inspect keys in webpackJsonp
try {
  // Let's inspect text occurrences or module functions
  console.log('Head of file:');
  console.log(content.slice(0, 1500));
} catch (e) {
  console.error(e);
}
