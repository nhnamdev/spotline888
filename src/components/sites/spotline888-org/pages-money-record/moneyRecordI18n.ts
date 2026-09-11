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

function rateLabel(lang: LanguageCode): string {
  switch (lang) {
    case "vi-VN": return "Tỷ giá";
    case "hk-TW": return "匯率";
    case "ja-JP": return "レート";
    case "ko-KR": return "환율";
    case "id-ID": return "Kurs";
    case "ms-MY": return "Kadar";
    case "th-TH": return "อัตรา";
    case "fr-FR": return "Taux";
    case "de-DE": return "Kurs";
    case "zh-CN": return "汇率";
    default: return "Rate";
  }
}

function orderLabel(lang: LanguageCode): string {
  switch (lang) {
    case "vi-VN": return "Mã đơn";
    case "hk-TW": return "訂單號";
    case "ja-JP": return "注文番号";
    case "ko-KR": return "주문 번호";
    case "id-ID": return "No. Pesanan";
    case "ms-MY": return "No. Pesanan";
    case "th-TH": return "เลขที่คำสั่งซื้อ";
    case "fr-FR": return "N° commande";
    case "de-DE": return "Bestell-Nr.";
    case "zh-CN": return "订单号";
    default: return "Order";
  }
}

export function formatFundRecordMemo(memo: string, lang: LanguageCode): string {
  if (!memo) return memo;

  // 1. 闪兑 / Swap
  const swapMatch = memo.match(/(?:闪兑|閃兌|Swap)\s*([\d\.]+)\s*(\w+)\s*(?:兑换|兌換|to|for)\s*([\d\.]+)\s*(\w+)(?:\s*[\(（](?:汇率|匯率|Rate):\s*([\d\.]+)[\)）])?/i);
  if (swapMatch) {
    const [, a1, c1, a2, c2, rate] = swapMatch;
    const ratePart = rate ? ` (${rateLabel(lang)}: ${rate})` : "";
    switch (lang) {
      case "en-US": return `Swap ${a1} ${c1} for ${a2} ${c2}${ratePart}`;
      case "vi-VN": return `Quy đổi ${a1} ${c1} sang ${a2} ${c2}${ratePart}`;
      case "hk-TW": return `閃兌 ${a1} ${c1} 兌換 ${a2} ${c2}${ratePart}`;
      case "ja-JP": return `スワップ ${a1} ${c1} → ${a2} ${c2}${ratePart}`;
      case "ko-KR": return `환전 ${a1} ${c1} → ${a2} ${c2}${ratePart}`;
      case "id-ID": return `Tukar ${a1} ${c1} ke ${a2} ${c2}${ratePart}`;
      case "ms-MY": return `Tukar ${a1} ${c1} ke ${a2} ${c2}${ratePart}`;
      case "th-TH": return `แลกเปลี่ยน ${a1} ${c1} เป็น ${a2} ${c2}${ratePart}`;
      case "fr-FR": return `Échange ${a1} ${c1} en ${a2} ${c2}${ratePart}`;
      case "de-DE": return `Tausch ${a1} ${c1} in ${a2} ${c2}${ratePart}`;
      default: return `闪兑 ${a1} ${c1} 兑换 ${a2} ${c2}${ratePart}`;
    }
  }

  // 2. 申请提现 / 提现
  if (memo.includes("申请提现") || memo.includes("申請提現") || memo.includes("提现") || memo.toLowerCase().includes("withdrawal")) {
    const curr = memo.includes("USDT") ? "USDT" : "";
    switch (lang) {
      case "en-US": return `Withdrawal Request ${curr}`.trim();
      case "vi-VN": return `Yêu cầu rút tiền ${curr}`.trim();
      case "hk-TW": return `申請提現 ${curr}`.trim();
      case "ja-JP": return `出金申請 ${curr}`.trim();
      case "ko-KR": return `출금 신청 ${curr}`.trim();
      case "id-ID": return `Pengajuan Penarikan ${curr}`.trim();
      case "ms-MY": return `Permohonan Pengeluaran ${curr}`.trim();
      case "th-TH": return `ขอถอนเงิน ${curr}`.trim();
      case "fr-FR": return `Demande de retrait ${curr}`.trim();
      case "de-DE": return `Auszahlungsantrag ${curr}`.trim();
      default: return `申请提现 ${curr}`.trim();
    }
  }

  // 3. 订单结算盈利
  const profitMatch = memo.match(/(?:订单结算盈利|訂單結算盈利|Order Profit)\s*([A-Za-z0-9\/]+)?(?:\s*\(\+?([0-9\.]+)\))?/i);
  if (profitMatch) {
    const pair = profitMatch[1] ? ` ${profitMatch[1]}` : "";
    const amt = profitMatch[2] ? ` (+${profitMatch[2]})` : "";
    switch (lang) {
      case "en-US": return `Order Profit${pair}${amt}`;
      case "vi-VN": return `Lợi nhuận lệnh${pair}${amt}`;
      case "hk-TW": return `訂單結算盈利${pair}${amt}`;
      case "ja-JP": return `決済利益${pair}${amt}`;
      case "ko-KR": return `주문 정산 수익${pair}${amt}`;
      case "id-ID": return `Keuntungan Pesanan${pair}${amt}`;
      case "ms-MY": return `Keuntungan Pesanan${pair}${amt}`;
      case "th-TH": return `กำไรคำสั่งซื้อ${pair}${amt}`;
      case "fr-FR": return `Bénéfice de l'ordre${pair}${amt}`;
      case "de-DE": return `Order-Gewinn${pair}${amt}`;
      default: return `订单结算盈利${pair}${amt}`;
    }
  }

  // 4. 订单结算亏损
  const lossMatch = memo.match(/(?:订单结算亏损|訂單結算虧損|Order Loss)\s*([A-Za-z0-9\/]+)?(?:\s*\(\-?([0-9\.]+)\))?/i);
  if (lossMatch) {
    const pair = lossMatch[1] ? ` ${lossMatch[1]}` : "";
    const amt = lossMatch[2] ? ` (-${lossMatch[2]})` : "";
    switch (lang) {
      case "en-US": return `Order Loss${pair}${amt}`;
      case "vi-VN": return `Thua lỗ lệnh${pair}${amt}`;
      case "hk-TW": return `訂單結算虧損${pair}${amt}`;
      case "ja-JP": return `決済損失${pair}${amt}`;
      case "ko-KR": return `주문 정산 손실${pair}${amt}`;
      case "id-ID": return `Kerugian Pesanan${pair}${amt}`;
      case "ms-MY": return `Kerugian Pesanan${pair}${amt}`;
      case "th-TH": return `ขาดทุนคำสั่งซื้อ${pair}${amt}`;
      case "fr-FR": return `Perte de l'ordre${pair}${amt}`;
      case "de-DE": return `Order-Verlust${pair}${amt}`;
      default: return `订单结算亏损${pair}${amt}`;
    }
  }

  // 5. 充值入金 / 管理员加款
  const rechargeMatch = memo.match(/(?:充值入金|管理员加款|管理員加款|Recharge Deposit):?\s*\+?([0-9\.]+)?/i);
  if (rechargeMatch) {
    const amt = rechargeMatch[1] ? `: +${rechargeMatch[1]}` : "";
    switch (lang) {
      case "en-US": return `Recharge Deposit${amt}`;
      case "vi-VN": return `Nạp tiền vào tài khoản${amt}`;
      case "hk-TW": return `充值入金${amt}`;
      case "ja-JP": return `チャージ入金${amt}`;
      case "ko-KR": return `충전 입금${amt}`;
      case "id-ID": return `Isi Ulang Deposit${amt}`;
      case "ms-MY": return `Deposit Tambah Nilai${amt}`;
      case "th-TH": return `ฝากเงินเข้าบัญชี${amt}`;
      case "fr-FR": return `Dépôt de recharge${amt}`;
      case "de-DE": return `Auflade-Einzahlung${amt}`;
      default: return `充值入金${amt}`;
    }
  }

  // 6. 充值成功 (订单号: ...)
  const successRecharge = memo.match(/(?:充值成功|Recharge Successful)(?:\s*[\(（](?:订单号|訂單號|Order):?\s*([A-Za-z0-9]+)[\)）])?/i);
  if (successRecharge) {
    const orderNo = successRecharge[1] ? ` (${orderLabel(lang)}: ${successRecharge[1]})` : "";
    switch (lang) {
      case "en-US": return `Recharge Successful${orderNo}`;
      case "vi-VN": return `Nạp tiền thành công${orderNo}`;
      case "hk-TW": return `充值成功${orderNo}`;
      case "ja-JP": return `チャージ成功${orderNo}`;
      case "ko-KR": return `충전 성공${orderNo}`;
      case "id-ID": return `Isi Ulang Berhasil${orderNo}`;
      case "ms-MY": return `Tambah Nilai Berjaya${orderNo}`;
      case "th-TH": return `ฝากเงินสำเร็จ${orderNo}`;
      case "fr-FR": return `Recharge réussie${orderNo}`;
      case "de-DE": return `Aufladung erfolgreich${orderNo}`;
      default: return `充值成功${orderNo}`;
    }
  }

  // 7. 下单买涨 / 下单买跌
  const buyLongMatch = memo.match(/(?:下单买涨|下單買漲|Order Buy Long)\s*([A-Za-z0-9\/]+)?/i);
  if (buyLongMatch) {
    const pair = buyLongMatch[1] ? ` ${buyLongMatch[1]}` : "";
    switch (lang) {
      case "en-US": return `Order Buy Long${pair}`;
      case "vi-VN": return `Đặt lệnh Mua Lên${pair}`;
      case "hk-TW": return `下單買漲${pair}`;
      case "ja-JP": return `ロング注文${pair}`;
      case "ko-KR": return `매수(상승)${pair}`;
      case "id-ID": return `Beli Naik${pair}`;
      case "ms-MY": return `Beli Naik${pair}`;
      case "th-TH": return `เปิดคำสั่งซื้อขึ้น${pair}`;
      case "fr-FR": return `Ordre d'achat à la hausse${pair}`;
      case "de-DE": return `Kauforder Long${pair}`;
      default: return `下单买涨${pair}`;
    }
  }

  const buyShortMatch = memo.match(/(?:下单买跌|下單買跌|Order Buy Short)\s*([A-Za-z0-9\/]+)?/i);
  if (buyShortMatch) {
    const pair = buyShortMatch[1] ? ` ${buyShortMatch[1]}` : "";
    switch (lang) {
      case "en-US": return `Order Buy Short${pair}`;
      case "vi-VN": return `Đặt lệnh Mua Xuống${pair}`;
      case "hk-TW": return `下單買跌${pair}`;
      case "ja-JP": return `ショート注文${pair}`;
      case "ko-KR": return `매도(하락)${pair}`;
      case "id-ID": return `Beli Turun${pair}`;
      case "ms-MY": return `Beli Turun${pair}`;
      case "th-TH": return `เปิดคำสั่งซื้อลง${pair}`;
      case "fr-FR": return `Ordre d'achat à la baisse${pair}`;
      case "de-DE": return `Kauforder Short${pair}`;
      default: return `下单买跌${pair}`;
    }
  }

  // 8. 转入余额宝 / 余额宝转出
  if (memo.includes("转入余额宝") || memo.includes("轉入餘額寶")) {
    switch (lang) {
      case "en-US": return "Transfer to Yu'ebao";
      case "vi-VN": return "Chuyển vào Yu'ebao";
      case "hk-TW": return "轉入餘額寶";
      case "ja-JP": return "余額宝へ振替";
      case "ko-KR": return "Yu'ebao 입금";
      case "id-ID": return "Transfer ke Yu'ebao";
      case "ms-MY": return "Pindah ke Yu'ebao";
      case "th-TH": return "โอนเข้า Yu'ebao";
      case "fr-FR": return "Transférer vers Yu'ebao";
      case "de-DE": return "Nach Yu'ebao übertragen";
      default: return "转入余额宝";
    }
  }

  if (memo.includes("余额宝转出") || memo.includes("餘額寶轉出")) {
    switch (lang) {
      case "en-US": return "Transfer from Yu'ebao";
      case "vi-VN": return "Chuyển ra từ Yu'ebao";
      case "hk-TW": return "餘額寶轉出";
      case "ja-JP": return "余額宝から出金";
      case "ko-KR": return "Yu'ebao 출금";
      case "id-ID": return "Transfer dari Yu'ebao";
      case "ms-MY": return "Pindah keluar từ Yu'ebao";
      case "th-TH": return "โอนออกจาก Yu'ebao";
      case "fr-FR": return "Transférer depuis Yu'ebao";
      case "de-DE": return "Aus Yu'ebao übertragen";
      default: return "余额宝转出";
    }
  }

  return memo;
}
