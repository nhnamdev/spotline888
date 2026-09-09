const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const { r2Client, bucketName, publicUrl, uploadBuffer, getMimeType } = require('../utils/r2');
const { pool } = require('../config/db');

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function uploadInBatches(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    process.stdout.write(`\r🚀 Tiến độ tải lên R2: ${Math.min(i + batchSize, items.length)}/${items.length} tệp...`);
  }
  console.log('');
  return results;
}

async function main() {
  console.log('=================================================================');
  console.log('☁️  BẮT ĐẦU ĐẨY TOÀN BỘ HÌNH ẢNH DỰ ÁN LÊN CLOUDFLARE R2');
  console.log(`📦 Bucket: ${bucketName}`);
  console.log(`🌐 Public URL: ${publicUrl}`);
  console.log('=================================================================\n');

  const rootDir = path.resolve(__dirname, '../../../');
  const publicDir = path.join(rootDir, 'public');

  // Quét toàn bộ thư mục public/uploads, public/sites, public/seo, public/images
  const targetDirs = [
    path.join(publicDir, 'uploads'),
    path.join(publicDir, 'sites'),
    path.join(publicDir, 'images'),
    path.join(publicDir, 'seo'),
  ];

  let allFiles = [];
  for (const dir of targetDirs) {
    allFiles = allFiles.concat(getAllFiles(dir));
  }

  // Lọc bỏ file .gitkeep
  const imageFiles = allFiles.filter(f => !f.endsWith('.gitkeep'));
  console.log(`🔍 Tìm thấy tổng cộng ${imageFiles.length} tệp hình ảnh & tài nguyên cần tải lên.`);

  let successCount = 0;
  let failCount = 0;

  // Tải lên R2 với concurrency = 8
  await uploadInBatches(imageFiles, 8, async (filePath) => {
    try {
      // Key tương đối, ví dụ: uploads/20260908/abc.jpg hoặc sites/spotline888-org/...
      const relPath = path.relative(publicDir, filePath).replace(/\\/g, '/');
      const fileBuffer = await fs.promises.readFile(filePath);
      const mime = getMimeType(filePath);

      await uploadBuffer(fileBuffer, relPath, mime);
      successCount++;
      return { success: true, key: relPath };
    } catch (err) {
      failCount++;
      console.error(`\n❌ Lỗi tải tệp ${filePath}:`, err.message);
      return { success: false, file: filePath, error: err.message };
    }
  });

  console.log(`\n🎉 Đã tải lên Cloudflare R2: ${successCount} thành công, ${failCount} thất bại.`);

  // =========================================================================
  // CẬP NHẬT CƠ SỞ DỮ LIỆU MYSQL ĐỂ DÙNG TRỰC TIẾP URL TỪ CLOUDFLARE R2
  // =========================================================================
  console.log('\n--- CẬP NHẬT ĐƯỜNG DẪN ẢNH TRONG CSDL MYSQL SANG CLOUDFLARE R2 ---');

  // 1. Cập nhật Banners trong fa_category
  const [categories] = await pool.query('SELECT id, image FROM fa_category WHERE image IS NOT NULL');
  let updatedCategories = 0;
  for (const cat of categories) {
    if (cat.image && !cat.image.startsWith('http')) {
      const cleanKey = cat.image.replace(/^\/+/, '');
      const newUrl = `${publicUrl}/${cleanKey}`;
      await pool.query('UPDATE fa_category SET image = ? WHERE id = ?', [newUrl, cat.id]);
      updatedCategories++;
    }
  }
  console.log(`✅ Đã cập nhật ${updatedCategories} banner trong fa_category sang Cloudflare R2`);

  // 2. Cập nhật Coin icons trong fa_product
  const [products] = await pool.query('SELECT id, image FROM fa_product WHERE image IS NOT NULL');
  let updatedProducts = 0;
  for (const prod of products) {
    if (prod.image && !prod.image.startsWith('http')) {
      const cleanKey = prod.image.replace(/^\/+/, '');
      const newUrl = `${publicUrl}/${cleanKey}`;
      await pool.query('UPDATE fa_product SET image = ? WHERE id = ?', [newUrl, prod.id]);
      updatedProducts++;
    }
  }
  console.log(`✅ Đã cập nhật ${updatedProducts} sản phẩm coin trong fa_product sang Cloudflare R2`);

  // 3. Cập nhật Avatar hội viên trong fa_user
  const [users] = await pool.query('SELECT id, avatar FROM fa_user WHERE avatar IS NOT NULL');
  let updatedUsers = 0;
  for (const u of users) {
    if (u.avatar && !u.avatar.startsWith('http')) {
      const cleanKey = u.avatar.replace(/^\/+/, '');
      const newUrl = `${publicUrl}/${cleanKey}`;
      await pool.query('UPDATE fa_user SET avatar = ? WHERE id = ?', [newUrl, u.id]);
      updatedUsers++;
    }
  }
  console.log(`✅ Đã cập nhật ${updatedUsers} avatar hội viên trong fa_user sang Cloudflare R2`);

  // 4. Cập nhật KYC images trong fa_user_verify
  const [verifies] = await pool.query('SELECT id, id_img_front, id_img_back FROM fa_user_verify');
  let updatedVerifies = 0;
  for (const v of verifies) {
    let updateSql = [];
    let params = [];
    if (v.id_img_front && !v.id_img_front.startsWith('http')) {
      updateSql.push('id_img_front = ?');
      params.push(`${publicUrl}/${v.id_img_front.replace(/^\/+/, '')}`);
    }
    if (v.id_img_back && !v.id_img_back.startsWith('http')) {
      updateSql.push('id_img_back = ?');
      params.push(`${publicUrl}/${v.id_img_back.replace(/^\/+/, '')}`);
    }
    if (updateSql.length > 0) {
      params.push(v.id);
      await pool.query(`UPDATE fa_user_verify SET ${updateSql.join(', ')} WHERE id = ?`, params);
      updatedVerifies++;
    }
  }
  console.log(`✅ Đã cập nhật ${updatedVerifies} hồ sơ KYC trong fa_user_verify sang Cloudflare R2`);

  console.log('\n=================================================================');
  console.log('🏁 HOÀN TẤT ĐỒNG BỘ CLOUDFLARE R2 CHO DỰ ÁN SPOTLINE888!');
  console.log('=================================================================');
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('💥 Lỗi đồng bộ R2:', err);
  process.exit(1);
});
