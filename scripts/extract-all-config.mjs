import fs from 'fs';

const html = fs.readFileSync('scripts/general_config_inner.html', 'utf-8');

const tabIds = ['basic', 'recharge', 'cashout', 'stock', 'message', 'azure', 'other', 'addcfg'];
const allTabsData = {};

for (const tabId of tabIds) {
  const startTag = `<div class="tab-pane fade`;
  // find tab pane index
  const tabPos = html.indexOf(`id="${tabId}"`);
  if (tabPos === -1) {
    console.log(`Tab ${tabId} not found`);
    continue;
  }

  // Find form inside this pane
  const formStart = html.indexOf('<form', tabPos);
  const formEnd = html.indexOf('</form>', formStart);
  const formHtml = html.slice(formStart, formEnd + 7);

  if (tabId === 'addcfg') {
    allTabsData[tabId] = { type: 'addcfg', raw: formHtml };
    continue;
  }

  // Extract table rows from tbody
  const tbodyStart = formHtml.indexOf('<tbody>');
  const tbodyEnd = formHtml.indexOf('</tbody>');
  const tbodyHtml = tbodyStart !== -1 ? formHtml.slice(tbodyStart, tbodyEnd) : formHtml;

  const rows = Array.from(tbodyHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)).map(r => {
    const tds = Array.from(r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(td => td[1].trim());
    if (tds.length < 3) return null;

    // Title / Label
    const title = tds[0].replace(/<[^>]+>/g, '').trim();

    // Variable
    const variable = tds[2].replace(/<[^>]+>/g, '').trim();

    // Value cell content
    const valueCell = tds[1];
    // Check input name, value, type, tip
    const inputMatch = valueCell.match(/<(input|textarea|select)[^>]*name="row\[([^\]]+)\]"[^>]*>/i);
    const varName = inputMatch ? inputMatch[2] : variable;
    
    // Check type
    let type = 'string';
    if (valueCell.includes('type="radio"')) type = 'radio';
    else if (valueCell.includes('<textarea')) type = 'text';
    else if (valueCell.includes('<select')) type = 'select';
    else if (valueCell.includes('faupload') || valueCell.includes('plupload') || valueCell.includes('btn-upload')) type = 'image';
    else if (valueCell.includes('type="number"')) type = 'number';
    else if (valueCell.includes('type="checkbox"')) type = 'checkbox';

    // Current value
    let val = '';
    const valAttrMatch = valueCell.match(/value="([^"]*)"/i);
    if (type === 'text') {
      const taMatch = valueCell.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/i);
      val = taMatch ? taMatch[1] : '';
    } else if (valAttrMatch) {
      val = valAttrMatch[1];
    }

    // Radio options if any
    let radioOptions = [];
    if (type === 'radio') {
      const radios = Array.from(valueCell.matchAll(/<label[^>]*>\s*<input[^>]*type="radio"[^>]*value="([^"]*)"([^>]*)>\s*([\s\S]*?)<\/label>/gi)).map(rm => ({
        value: rm[1],
        checked: rm[2].includes('checked'),
        label: rm[3].replace(/<[^>]+>/g, '').trim()
      }));
      radioOptions = radios;
    }

    // Tip
    const tipMatch = valueCell.match(/<span class="help-block"[^>]*>([\s\S]*?)<\/span>/i) ||
                     valueCell.match(/<div class="help-block"[^>]*>([\s\S]*?)<\/div>/i);
    const tip = tipMatch ? tipMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    return {
      title,
      variable: varName || variable,
      type,
      value: val,
      radioOptions,
      tip
    };
  }).filter(Boolean);

  allTabsData[tabId] = rows;
}

fs.writeFileSync('scripts/extracted_config_data.json', JSON.stringify(allTabsData, null, 2), 'utf-8');
console.log('Saved all config data to scripts/extracted_config_data.json');
Object.keys(allTabsData).forEach(k => {
  console.log(`Tab: ${k} -> ${Array.isArray(allTabsData[k]) ? allTabsData[k].length + ' fields' : 'addcfg form'}`);
});
