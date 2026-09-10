import { LanguageCode } from "../pages-login-login/i18n";

export interface WithdrawListTranslation {
  depositTitle: string;
  withdrawTitle: string;
  depositEmpty: string;
  withdrawEmpty: string;
}

export const WITHDRAW_LIST_TRANSLATIONS: Record<
  LanguageCode,
  WithdrawListTranslation
> = {
  "zh-CN": {
    depositTitle: "入金明细",
    withdrawTitle: "出金记录",
    depositEmpty: "暂无记录",
    withdrawEmpty: "暂无出金记录",
  },
  "hk-TW": {
    depositTitle: "入金明細",
    withdrawTitle: "出金記錄",
    depositEmpty: "暫無記錄",
    withdrawEmpty: "暫無出金記錄",
  },
  "en-US": {
    depositTitle: "Deposit Details",
    withdrawTitle: "Withdrawal Records",
    depositEmpty: "No records found",
    withdrawEmpty: "No withdrawal records",
  },
  "vi-VN": {
    depositTitle: "Chi tiết nạp tiền",
    withdrawTitle: "Lịch sử rút tiền",
    depositEmpty: "Chưa có bản ghi",
    withdrawEmpty: "Chưa có lịch sử rút tiền",
  },
  "id-ID": {
    depositTitle: "Rincian Deposit",
    withdrawTitle: "Riwayat Penarikan",
    depositEmpty: "Belum ada catatan",
    withdrawEmpty: "Belum ada riwayat penarikan",
  },
  "ms-MY": {
    depositTitle: "Butiran Deposit",
    withdrawTitle: "Rekod Pengeluaran",
    depositEmpty: "Tiada rekod",
    withdrawEmpty: "Tiada rekod pengeluaran",
  },
  "ja-JP": {
    depositTitle: "入金履歴",
    withdrawTitle: "出金履歴",
    depositEmpty: "履歴はありません",
    withdrawEmpty: "出金履歴はありません",
  },
  "th-TH": {
    depositTitle: "รายละเอียดการฝากเงิน",
    withdrawTitle: "ประวัติการถอนเงิน",
    depositEmpty: "ไม่มีข้อมูล",
    withdrawEmpty: "ไม่มีประวัติการถอนเงิน",
  },
  "ko-KR": {
    depositTitle: "입금 내역",
    withdrawTitle: "출금 내역",
    depositEmpty: "기록이 없습니다",
    withdrawEmpty: "출금 기록이 없습니다",
  },
  "fr-FR": {
    depositTitle: "Détails des dépôts",
    withdrawTitle: "Historique des retraits",
    depositEmpty: "Aucun enregistrement",
    withdrawEmpty: "Aucun historique de retrait",
  },
  "de-DE": {
    depositTitle: "Einzahlungsdetails",
    withdrawTitle: "Auszahlungsverlauf",
    depositEmpty: "Keine Datensätze",
    withdrawEmpty: "Keine Auszahlungsaufzeichnungen",
  },
};
