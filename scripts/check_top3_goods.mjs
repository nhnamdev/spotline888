import fs from 'fs';

const goods = JSON.parse(fs.readFileSync('scripts/api__index_goods.json', 'utf8'));

// First 3 items
const top3 = goods.data.slice(0, 3);
for (const item of top3) {
  console.log(`Symbol: ${item.title}, Price: ${item.price}, Change: ${item.zf}`);
  if (item.price_list) {
    console.log(`Price list length: ${item.price_list.length}`);
    const closes = item.price_list.map(p => parseFloat(p.close)).reverse();
    console.log(`Closes (${closes.length}):`, closes);
  }
}
