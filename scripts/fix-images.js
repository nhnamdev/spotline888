const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const sharp = require('sharp');
const { uploadBuffer } = require('../server/src/utils/r2');

function createSvgBadge(symbol, label, gradColors, textColor = '#FFFFFF', subColor = '#FFF8E1') {
  return Buffer.from(`
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradColors[0]}" />
      <stop offset="50%" stop-color="${gradColors[1]}" />
      <stop offset="100%" stop-color="${gradColors[2]}" />
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <circle cx="128" cy="128" r="114" fill="url(#grad)" filter="url(#dropShadow)" stroke="#FFFFFF" stroke-width="5"/>
  <circle cx="128" cy="128" r="102" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="128" y="142" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="70" font-weight="900" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${symbol}</text>
  <text x="128" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="24" font-weight="800" fill="${subColor}" text-anchor="middle" letter-spacing="2">${label}</text>
</svg>
  `);
}

async function run() {
  console.log('--- Đang chuẩn bị tạo và cập nhật 5 tệp ảnh sản phẩm ---');

  // 1. ETC: Sử dụng ảnh thật coin_etc.png
  const etcLocalPath = 'public/sites/spotline888-org/pages-index-index/coin_etc.png';
  const etcBuffer = fs.readFileSync(etcLocalPath);
  const etcKey = 'uploads/20251103/5fb3aee9e34e569992f98e6c4ea05ea0.png';
  fs.writeFileSync('public/' + etcKey, etcBuffer);
  await uploadBuffer(etcBuffer, etcKey, 'image/png');
  console.log('✅ Đã upload ETC:', etcKey);

  // 2. GOLD (Au)
  const goldSvg = createSvgBadge('Au', 'GOLD', ['#FFE082', '#FFB300', '#FF8F00'], '#FFFFFF', '#FFF8E1');
  const goldPng = await sharp(goldSvg).png().toBuffer();
  const goldKey = 'uploads/20250811/72eb62a1a0dfc0df8e874945d8b74614.png';
  fs.writeFileSync('public/' + goldKey, goldPng);
  await uploadBuffer(goldPng, goldKey, 'image/png');
  console.log('✅ Đã upload GOLD:', goldKey);

  // 3. SILVER (Ag)
  const silverSvg = createSvgBadge('Ag', 'SILVER', ['#ECEFF1', '#B0BEC5', '#78909C'], '#FFFFFF', '#ECEFF1');
  const silverPng = await sharp(silverSvg).png().toBuffer();
  const silverKey = 'uploads/20250811/d1e1f78eaec7ca09ec6149f1ca92ee14.png';
  fs.writeFileSync('public/' + silverKey, silverPng);
  await uploadBuffer(silverPng, silverKey, 'image/png');
  console.log('✅ Đã upload SILVER:', silverKey);

  // 4. ALUMINUM (Al)
  const aluSvg = createSvgBadge('Al', 'ALUMINUM', ['#CFD8DC', '#90A4AE', '#546E7A'], '#FFFFFF', '#ECEFF1');
  const aluPng = await sharp(aluSvg).png().toBuffer();
  const aluKey = 'uploads/20250811/d854eb0c968f51dfa1f868c62b535d48.png';
  fs.writeFileSync('public/' + aluKey, aluPng);
  await uploadBuffer(aluPng, aluKey, 'image/png');
  console.log('✅ Đã upload ALUMINUM:', aluKey);

  // 5. ZINC (Zn)
  const zincSvg = createSvgBadge('Zn', 'ZINC', ['#80DEEA', '#26C6DA', '#00838F'], '#FFFFFF', '#E0F7FA');
  const zincPng = await sharp(zincSvg).png().toBuffer();
  const zincKey = 'uploads/20250811/e93910c5da8cb4c062c3e100f7e4367c.png';
  fs.writeFileSync('public/' + zincKey, zincPng);
  await uploadBuffer(zincPng, zincKey, 'image/png');
  console.log('✅ Đã upload ZINC:', zincKey);

  console.log('🎉 Hoàn thành tạo và upload toàn bộ 5 ảnh sản phẩm hợp lệ!');
}

run().catch(err => console.error('Lỗi thực thi:', err));
