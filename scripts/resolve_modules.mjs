import fs from 'fs';

const js = fs.readFileSync('scripts/pages-index-index.js', 'utf8');

const modIds = ['8de9', 'fe75', 'de53', '16be', '5bf8', '08cf', 'f5c9', '0c51', 'f5c1', 'e864', '16a5', '2b47', '0595', '681b', '87c0', 'ce6d'];

for (const id of modIds) {
  // Search for "id":function or id:function or "id":
  const regex = new RegExp(`["']?${id}["']?\\s*:\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*?)\\}(?:,|$)`, 'm');
  const match = js.match(regex);
  if (match) {
    console.log(`Module ${id}:`, match[0].substring(0, 300));
  } else {
    // try finding anywhere id appears
    let idx = 0;
    while ((idx = js.indexOf(`"${id}":`, idx)) !== -1) {
      console.log(`Found "${id}": at ${idx}:`, js.substring(idx, idx + 150));
      idx += id.length + 3;
    }
  }
}

// Also let's check how menuList is filtered/rendered:
const menuIdx = js.indexOf('menuList');
let pos = 0;
while ((pos = js.indexOf('menuList', pos)) !== -1) {
  console.log(`menuList usage at ${pos}:`, js.substring(pos, pos + 250));
  pos += 8;
}
