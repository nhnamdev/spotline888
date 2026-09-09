const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const accountId = process.env.R2_ACCOUNT_ID || '4f0ee97949dd41bd8444b251ccb2f5f5';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || 'c80eddc768d381ffebdc7b028b50a94f';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || 'af54c4fdeffdfe32b4e38ab3e68bf894d6d791e35e4efc5c134f49a62115f895';
const bucketName = process.env.R2_BUCKET_NAME || 'fortrade';
const publicUrl = (process.env.R2_PUBLIC_URL || 'https://pub-a639868785e846c2899fe607a531cbc8.r2.dev').replace(/\/$/, '');

// Khởi tạo S3 Client tương thích Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Bản đồ Content-Type thông dụng
const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
};

function getMimeType(filePathOrKey) {
  const ext = path.extname(filePathOrKey).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Lấy URL công khai truy cập file trên Cloudflare R2
 */
function getPublicUrl(key) {
  if (!key) return '';
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  const cleanKey = key.replace(/^\/+/, '');
  return `${publicUrl}/${cleanKey}`;
}

/**
 * Tải Buffer lên Cloudflare R2
 */
async function uploadBuffer(buffer, key, contentType = null) {
  const cleanKey = key.replace(/^\/+/, '');
  const mime = contentType || getMimeType(cleanKey);

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
      Body: buffer,
      ContentType: mime,
      CacheControl: 'public, max-age=31536000',
    })
  );

  return {
    bucket: bucketName,
    key: cleanKey,
    url: getPublicUrl(cleanKey),
    size: buffer.length,
    contentType: mime,
  };
}

/**
 * Tải tệp cục bộ lên Cloudflare R2
 */
async function uploadFile(localFilePath, r2Key) {
  const fileBuffer = await fs.promises.readFile(localFilePath);
  const cleanKey = r2Key.replace(/^\/+/, '');
  return uploadBuffer(fileBuffer, cleanKey, getMimeType(localFilePath));
}

/**
 * Kiểm tra file có tồn tại trên R2 hay không
 */
async function fileExists(key) {
  try {
    const cleanKey = key.replace(/^\/+/, '');
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
      })
    );
    return true;
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw err;
  }
}

/**
 * Xóa tệp trên Cloudflare R2
 */
async function deleteObject(key) {
  const cleanKey = key.replace(/^\/+/, '');
  return r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
    })
  );
}

module.exports = {
  r2Client,
  bucketName,
  publicUrl,
  getPublicUrl,
  uploadBuffer,
  uploadFile,
  fileExists,
  deleteObject,
  getMimeType,
};

