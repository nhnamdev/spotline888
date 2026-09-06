import fs from 'fs';

const loginChunk = fs.readFileSync('scripts/login.chunk.js', 'utf8');

// find methods or data in login chunk
console.log('Login chunk length:', loginChunk.length);

// search for popup or lang
const matches = [...loginChunk.matchAll(/(?:lang|popup|drawer|show|select)[a-zA-Z0-9_]*/gi)];
const uniqueWords = [...new Set(matches.map(m => m[0]))];
console.log('Matching words:', uniqueWords.filter(w => /lang/i.test(w)));

// Search for strings in login.chunk.js
const strMatches = [...loginChunk.matchAll(/"([^"\\]*?)"/g)];
console.log('Strings with lang:', strMatches.map(m => m[1]).filter(s => /lang/i.test(s)));
