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
    if (typeof dateInput === "number") {
      // Hỗ trợ cả timestamp tính bằng giây (< 1e11) và mili giây
      d = new Date(dateInput < 1e11 ? dateInput * 1000 : dateInput);
    } else if (typeof dateInput === "string") {
      const str = dateInput.trim();
      if (/^\d{10}$/.test(str)) {
        d = new Date(Number(str) * 1000);
      } else if (/^\d{13}$/.test(str)) {
        d = new Date(Number(str));
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(str)) {
        // Chuỗi dạng "2026-10-02 12:28:52" từ MySQL DATE_FORMAT đã là giờ Thái
        return str.length === 16 ? `${str}:00` : str;
      } else {
        d = new Date(str);
      }
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
