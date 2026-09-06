import fs from 'fs';

const bundle = fs.readFileSync('scripts/index.bundle.js', 'utf8');
const loginChunk = fs.readFileSync('scripts/login.chunk.js', 'utf8');
const sharedChunk = fs.readFileSync('scripts/shared.chunk.js', 'utf8');

// Find module d749
function findModule(bundleStr, modId) {
  const re = new RegExp(`\"?${modId}\"?\\s*:\\s*function\\(.*?\\)\\{([\\s\\S]*?)\\}(,\\s*\"?[a-zA-Z0-9_-]+\"?\\s*:|\\}\\]\\);)`, 'g');
  const m = re.exec(bundleStr);
  if (m) {
    console.log(`Found module ${modId}:`, m[0].slice(0, 500));
  } else {
    console.log(`Module ${modId} not found with regex`);
    // Search simple index
    const idx = bundleStr.indexOf(`"${modId}":`);
    if (idx !== -1) {
      console.log(`Found "${modId}": at ${idx}:`, bundleStr.slice(idx, idx + 400));
    }
  }
}

findModule(bundle, 'd749');
findModule(loginChunk, 'd749');
findModule(sharedChunk, 'd749');
findModule(loginChunk, 'cb74');
