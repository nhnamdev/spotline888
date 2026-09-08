import fs from 'fs';

const html = fs.readFileSync('scripts/general_config_inner.html', 'utf-8');

// Check ribbon / breadcrumb
const ribbonMatch = html.match(/<section class="content-header"[^>]*>([\s\S]*?)<\/section>/i) ||
                    html.match(/<div id="ribbon"[^>]*>([\s\S]*?)<\/div>/i);
console.log('Ribbon:', ribbonMatch ? ribbonMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'None');

// Check nav-tabs
const navTabsMatch = html.match(/<ul class="nav nav-tabs[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
if (navTabsMatch) {
  const tabs = Array.from(navTabsMatch[1].matchAll(/<li[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/li>/gi)).map(m => ({
    href: m[1],
    title: m[2].replace(/<[^>]+>/g, '').trim()
  }));
  console.log('Nav Tabs:', JSON.stringify(tabs, null, 2));
}

// Check tab panes
const tabPanes = Array.from(html.matchAll(/<div class="tab-pane[^"]*" id="([^"]+)"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="tab-pane"|<\/div>\s*<\/div>\s*<\/form>)/gi)).map(m => {
  const paneId = m[1];
  const paneContent = m[2];
  
  // Find table or form groups inside pane
  const rows = Array.from(paneContent.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)).map(r => {
    const tds = Array.from(r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(td => td[1].trim());
    return tds;
  });

  return {
    paneId,
    rowCount: rows.length,
    sampleRows: rows.slice(0, 5).map(r => r.map(c => c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()))
  };
});

console.log('Tab Panes count:', tabPanes.length);
tabPanes.forEach(p => {
  console.log(`Pane ID: ${p.paneId} (rows: ${p.rowCount})`);
});
