import fs from 'fs';

const html = fs.readFileSync('scripts/general_config_inner.html', 'utf-8');

// Find all tab-pane sections
const tabMatches = html.match(/<div class="tab-content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/form>/i);
if (!tabMatches) {
  console.log('Tab content not found, searching tab-pane divs...');
}

const tabIds = ['basic', 'recharge', 'cashout', 'stock', 'message', 'azure', 'other', 'addcfg'];

for (const tabId of tabIds) {
  const reg = new RegExp(`<div class="tab-pane[^"]*" id="${tabId}">([\\s\\S]*?)(?=<div class="tab-pane"|</div>\\s*</div>\\s*</div>\\s*</form>)`, 'i');
  const m = html.match(reg);
  if (!m) {
    console.log(`Tab ${tabId} not found`);
    continue;
  }

  const content = m[1];
  // Match all <tr> in table
  const rows = Array.from(content.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)).map(r => {
    const tds = Array.from(r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(td => td[1].trim());
    return tds;
  });

  console.log(`\n=================== TAB: ${tabId} (rows: ${rows.length}) ===================`);
  rows.forEach((r, idx) => {
    if (r.length >= 2) {
      const title = r[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const code = r[2] ? r[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
      console.log(`[${idx + 1}] Title: "${title}" | Code: "${code}"`);
    }
  });
}
