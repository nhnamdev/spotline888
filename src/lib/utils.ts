import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Định dạng thời gian theo múi giờ Thái Lan (Asia/Bangkok: UTC+7)
 * Chuẩn định dạng: YYYY-MM-DD HH:mm:ss
 */
export function formatThaiTime(dateInput?: string | number | Date | null): string {
  if (!dateInput) return "-";
  try {
    let d: Date;
    if (typeof dateInput === "string") {
      // Nếu đã là chuỗi định dạng "YYYY-MM-DD HH:mm:ss" không có Z/offset, kiểm tra và chuẩn hóa
      const str = dateInput.trim();
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(str)) {
        // Chuỗi dạng "2026-10-02 12:28:52" trả về từ MySQL DATE_FORMAT đã là giờ Thái
        return str.length === 16 ? `${str}:00` : str;
      }
      d = new Date(str);
    } else {
      d = new Date(dateInput);
    }

    if (isNaN(d.getTime())) return String(dateInput);

    const formatter = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return formatter.format(d).replace("T", " ");
  } catch {
    return String(dateInput);
  }
}
