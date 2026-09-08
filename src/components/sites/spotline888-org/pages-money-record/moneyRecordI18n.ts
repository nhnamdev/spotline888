export interface MoneyRecordTranslation {
  title: string;
  noMore: string;
  emptyRecords: string;
}

export const MONEY_RECORD_TRANSLATIONS: Record<
  string,
  MoneyRecordTranslation
> = {
  "zh-CN": {
    title: "资金记录",
    noMore: "没有更多了~",
    emptyRecords: "暂无资金记录",
  },
  "zh-TW": {
    title: "資金記錄",
    noMore: "沒有更多了~",
    emptyRecords: "暫無資金記錄",
  },
  en: {
    title: "Fund Records",
    noMore: "No more records~",
    emptyRecords: "No fund records found",
  },
  vi: {
    title: "Bản ghi biến động vốn",
    noMore: "Không còn bản ghi nào khác~",
    emptyRecords: "Chưa có bản ghi biến động vốn",
  },
  ja: {
    title: "資金履歴",
    noMore: "これ以上の履歴はありません~",
    emptyRecords: "資金履歴はありません",
  },
  ko: {
    title: "자금 내역",
    noMore: "더 이상 내역이 없습니다~",
    emptyRecords: "자금 내역이 없습니다",
  },
  id: {
    title: "Riwayat Dana",
    noMore: "Tidak ada lagi catatan~",
    emptyRecords: "Belum ada riwayat dana",
  },
  es: {
    title: "Registro de fondos",
    noMore: "No hay más registros~",
    emptyRecords: "Sin registros de fondos",
  },
  fr: {
    title: "Historique des fonds",
    noMore: "Plus aucun enregistrement~",
    emptyRecords: "Aucun historique de fonds",
  },
  de: {
    title: "Kapitalverlauf",
    noMore: "Keine weiteren Einträge~",
    emptyRecords: "Keine Kapitalaufzeichnungen",
  },
  ru: {
    title: "История движения средств",
    noMore: "Больше записей нет~",
    emptyRecords: "Нет записей движения средств",
  },
};
