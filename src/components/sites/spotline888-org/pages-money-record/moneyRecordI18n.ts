import { LanguageCode } from "../pages-login-login/i18n";

export interface MoneyRecordTranslation {
  title: string;
  noMore: string;
  emptyRecords: string;
}

export const MONEY_RECORD_TRANSLATIONS: Record<
  LanguageCode,
  MoneyRecordTranslation
> = {
  "zh-CN": {
    title: "资金记录",
    noMore: "没有更多了~",
    emptyRecords: "暂无资金记录",
  },
  "hk-TW": {
    title: "資金記錄",
    noMore: "沒有更多了~",
    emptyRecords: "暫無資金記錄",
  },
  "en-US": {
    title: "Fund Records",
    noMore: "No more records~",
    emptyRecords: "No fund records found",
  },
  "vi-VN": {
    title: "Bản ghi biến động vốn",
    noMore: "Không còn bản ghi nào khác~",
    emptyRecords: "Chưa có bản ghi biến động vốn",
  },
  "id-ID": {
    title: "Riwayat Dana",
    noMore: "Tidak ada lagi catatan~",
    emptyRecords: "Belum ada riwayat dana",
  },
  "ms-MY": {
    title: "Rekod Dana",
    noMore: "Tiada rekod lagi~",
    emptyRecords: "Tiada rekod dana",
  },
  "ja-JP": {
    title: "資金履歴",
    noMore: "これ以上の履歴はありません~",
    emptyRecords: "資金履歴はありません",
  },
  "th-TH": {
    title: "บันทึกเงินทุน",
    noMore: "ไม่มีข้อมูลเพิ่มเติมแล้ว~",
    emptyRecords: "ไม่มีบันทึกเงินทุน",
  },
  "ko-KR": {
    title: "자금 내역",
    noMore: "더 이상 내역이 없습니다~",
    emptyRecords: "자금 내역이 없습니다",
  },
  "fr-FR": {
    title: "Historique des fonds",
    noMore: "Plus aucun enregistrement~",
    emptyRecords: "Aucun historique de fonds",
  },
  "de-DE": {
    title: "Kapitalverlauf",
    noMore: "Keine weiteren Einträge~",
    emptyRecords: "Keine Kapitalaufzeichnungen",
  },
};
