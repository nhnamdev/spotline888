/**
 * Tiện ích xử lý URL Cloudflare R2 cho toàn bộ hình ảnh trong dự án Spotline888
 */

const R2_BASE_URL = (
  process.env.NEXT_PUBLIC_R2_URL || 
  'https://pub-a639868785e846c2899fe607a531cbc8.r2.dev'
).replace(/\/$/, '');

/**
 * Chuyển đổi đường dẫn ảnh sang URL Cloudflare R2
 * @param path Đường dẫn tương đối hoặc tuyệt đối
 * @param fallback Đường dẫn ảnh mặc định nếu null/undefined
 */
export function getR2Url(path?: string | null, fallback = ''): string {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${R2_BASE_URL}${cleanPath}`;
}

export const R2_PUBLIC_BASE = R2_BASE_URL;
