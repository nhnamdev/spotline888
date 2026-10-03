"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { I18nProvider, useI18n, LanguageCode } from "../pages-login-login/i18n";
import { WITHDRAW_LIST_TRANSLATIONS } from "./withdrawListI18n";
import { withdrawApi, rechargeApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";
import { formatThaiTime } from "@/lib/utils";

function formatTypeBadge(
  payType: string | undefined,
  withdrawType: string | undefined,
  lang: LanguageCode,
  listType: "deposit" | "withdraw"
): string {
  const raw = String(withdrawType || payType || "").toLowerCase();

  if (raw.includes("usdt") || raw.includes("trc20") || raw.includes("erc20")) {
    if (listType === "deposit") {
      switch (lang) {
        case "th-TH": return "ฝาก USDT";
        case "vi-VN": return "Nạp USDT";
        case "zh-CN": case "hk-TW": return "USDT充值";
        default: return "USDT Deposit";
      }
    }
    return "USDT";
  }

  if (raw.includes("后台") || raw.includes("管理员") || raw.includes("admin") || raw.includes("system")) {
    switch (lang) {
      case "th-TH": return "ฝากเงินจากระบบ";
      case "vi-VN": return "Nạp từ hệ thống";
      case "zh-CN": case "hk-TW": return "系统充值";
      default: return "System Deposit";
    }
  }

  if (raw.includes("bank") || raw.includes("银行卡") || raw.includes("銀行卡")) {
    switch (lang) {
      case "th-TH": return "บัญชีธนาคาร";
      case "vi-VN": return "Tài khoản ngân hàng";
      case "zh-CN": case "hk-TW": return "银行卡";
      default: return "Bank Card";
    }
  }

  if (listType === "deposit") {
    switch (lang) {
      case "th-TH": return "ฝากเงิน";
      case "vi-VN": return "Nạp tiền";
      case "zh-CN": case "hk-TW": return "充值";
      default: return "Deposit";
    }
  }

  return "USDT";
}

function formatRecordNote(
  noteStr: string,
  lang: LanguageCode,
  listType: "deposit" | "withdraw"
): string {
  if (!noteStr) return "";
  let text = String(noteStr);

  // 1. Trạng thái duyệt
  if (text.includes("审核通过") || text.includes("審核通過") || text.toLowerCase().includes("approved")) {
    switch (lang) {
      case "th-TH": return "อนุมัติแล้ว";
      case "vi-VN": return "Đã duyệt thành công";
      case "en-US": return "Approved";
      case "zh-CN": return "审核通过";
      case "hk-TW": return "審核通過";
      default: return "Approved";
    }
  }

  if (text.includes("待审核") || text.includes("待審核") || text.toLowerCase().includes("pending")) {
    switch (lang) {
      case "th-TH": return "รอดำเนินการ";
      case "vi-VN": return "Đang chờ duyệt";
      case "en-US": return "Pending";
      default: return "Pending";
    }
  }

  if (
    text.includes("审核未通过") ||
    text.includes("审核拒绝") ||
    text.includes("驳回") ||
    text.includes("提现申请已拒绝") ||
    text.includes("已拒绝") ||
    text.includes("拒绝")
  ) {
    switch (lang) {
      case "th-TH": return "คำขอถอนเงินถูกปฏิเสธ";
      case "vi-VN": return "Yêu cầu rút tiền bị từ chối";
      case "en-US": return "Withdrawal rejected";
      default: return "Withdrawal rejected";
    }
  }

  // 2. Nạp tiền / 充值入金
  if (text.includes("充值入金") || text.includes("充值") || text.includes("加款") || text.includes("Recharge")) {
    const amtMatch = text.match(/(?:\+?)([0-9\.]+)/);
    const amt = amtMatch ? `+${amtMatch[1]}` : "";
    const unit = (lang === "th-TH" || lang === "vi-VN" || listType === "deposit") ? "฿" : "THB";
    switch (lang) {
      case "th-TH": return amt ? `ฝากเงินเข้าบัญชี: ${amt} ${unit}` : "ฝากเงินเข้าบัญชี";
      case "vi-VN": return amt ? `Nạp tiền: ${amt} ${unit}` : "Nạp tiền";
      case "en-US": return amt ? `Deposit: ${amt} ${unit}` : "Deposit";
      case "zh-CN": return amt ? `充值入金: ${amt} 泰铢` : "充值入金";
      case "hk-TW": return amt ? `充值入金: ${amt} 泰銖` : "充值入金";
      default: return amt ? `Deposit: ${amt} ${unit}` : "Deposit";
    }
  }

  // 3. Nếu là tiếng Thái, thay thế mọi chữ USDT/USD thành ฿
  if (lang === "th-TH") {
    text = text.replace(/\b(usdt|usd)\b/gi, "฿");
  }

  return text;
}

interface SpotlineWithdrawListProps {
  type: "deposit" | "withdraw";
}

interface RecordData {
  id: number | string;
  order_sn?: string;
  amount?: number | string;
  money?: number | string;
  withdraw_type?: string;
  pay_type?: string;
  status: "pending" | "approved" | "rejected" | string;
  created_at?: string;
  note?: string;
  member_note?: string;
}

function SpotlineWithdrawListContent({ type }: SpotlineWithdrawListProps) {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    WITHDRAW_LIST_TRANSLATIONS[currentLang] ||
    WITHDRAW_LIST_TRANSLATIONS["zh-CN"];

  const title = type === "deposit" ? t.depositTitle : t.withdrawTitle;
  const emptyText = type === "deposit" ? t.depositEmpty : t.withdrawEmpty;

  const [records, setRecords] = useState<RecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejectModal, setSelectedRejectModal] = useState<{
    orderSn: string;
    reason: string;
  } | null>(null);

  useEffect(() => {
    async function loadRecords() {
      try {
        setLoading(true);
        if (type === "withdraw") {
          const res = await withdrawApi.getWithdrawList(1, 50);
          if (res.code === 1 && res.data) {
            const list = Array.isArray(res.data)
              ? res.data
              : res.data.rows || [];
            setRecords(list);
          }
        } else {
          const res = await rechargeApi.getRechargeList(1, 50);
          if (res.code === 1 && res.data) {
            const list = Array.isArray(res.data)
              ? res.data
              : res.data.rows || [];
            setRecords(list);
          }
        }
      } catch (err) {
        console.error("Lỗi nạp lịch sử giao dịch:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, [type]);

  const renderStatus = (status: string) => {
    const s = String(status).toLowerCase();
    if (s === "approved" || s === "1" || s === "success") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.statusApproved}
        </span>
      );
    }
    if (s === "rejected" || s === "2" || s === "fail") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" />
          {t.statusRejected}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        {t.statusPending}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ff] via-[#f8fafc_35%] to-white flex justify-center select-none pb-12">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-4 pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-[10px] flex items-center justify-center shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:bg-white active:scale-95 transition-all cursor-pointer border-0"
          >
            <ChevronLeft className="w-[18px] h-[18px] text-[#333333]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#111827]">{title}</h1>
          <div className="w-9 h-9" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center -mt-10 py-16 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6] mb-2" />
            <span className="text-[13px]">
              {currentLang === "th-TH" ? "กำลังโหลด..." : currentLang === "vi-VN" ? "Đang tải..." : currentLang === "en-US" ? "Loading..." : "加载中..."}
            </span>
          </div>
        ) : records.length === 0 ? (
          /* Center Empty State */
          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            <div className="w-[140px] h-[120px] relative mb-4">
              <Image
                src={getR2Url(
                  "/sites/spotline888-org/pages-withdraw-list/record_empty.png"
                )}
                alt="Empty Records"
                fill
                className="object-contain"
              />
            </div>

            <p className="text-[14px] text-[#9ca3af] text-center font-normal">
              {emptyText}
            </p>
          </div>
        ) : (
          /* List of Records */
          <div className="flex flex-col gap-3 mt-1 pb-6">
            {records.map((item, idx) => {
              const rawNum = parseFloat(
                String(item.amount ?? item.money ?? "0")
              );
              const numVal = isNaN(rawNum) ? "0.00" : rawNum.toFixed(2);
              const orderSn = item.order_sn || `TX${item.id || idx}`;
              const timeStr = formatThaiTime(item.created_at);
              const typeBadge = formatTypeBadge(
                item.pay_type,
                item.withdraw_type,
                currentLang,
                type
              );
              const noteText = formatRecordNote(
                item.note || item.member_note || "",
                currentLang,
                type
              );
              const currencySymbol =
                type === "deposit"
                  ? "฿"
                  : (item.withdraw_type === "bank_card" || item.pay_type === "bank_card" ? "฿" : "USDT");

              return (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-[16px] p-4 shadow-[0_3px_12px_rgba(15,23,42,0.05)] border border-gray-100/80 flex flex-col gap-2.5 transition-all"
                >
                  {/* Row 1: Order Sn & Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-mono text-gray-400 font-medium truncate max-w-[200px]">
                      {orderSn}
                    </span>
                    {renderStatus(item.status)}
                  </div>

                  {/* Row 2: Amount & Method */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-gray-50">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-[20px] font-extrabold tracking-tight ${
                          type === "withdraw"
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {type === "withdraw" ? `-${numVal}` : `+${numVal}`}
                      </span>
                      <span className="text-[13px] font-bold text-gray-500">
                        {currencySymbol}
                      </span>
                    </div>

                    <span className="text-[12px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {typeBadge}
                    </span>
                  </div>

                  {/* Row 3: Time & Note & View Reason */}
                  <div className="flex items-center justify-between text-[11.5px] text-gray-400">
                    <span>{timeStr}</span>
                    <div className="flex items-center gap-1.5 max-w-[250px] justify-end">
                      {noteText && (
                        <span className="text-rose-500 italic truncate text-right">
                          {noteText}
                        </span>
                      )}
                      {type === "withdraw" &&
                        (String(item.status).toLowerCase() === "rejected" ||
                          String(item.status) === "2" ||
                          String(item.status).toLowerCase() === "fail") && (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRejectModal({
                                orderSn,
                                reason:
                                  item.note ||
                                  item.member_note ||
                                  noteText ||
                                  (currentLang === "th-TH"
                                    ? "คำขอถอนเงินถูกปฏิเสธ"
                                    : "Bị từ chối"),
                              })
                            }
                            className="text-[#2563eb] font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0 text-[12px] shrink-0"
                          >
                            [{t.view}]
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Xem chi tiết lý do từ chối rút tiền */}
        {selectedRejectModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-[340px] p-5 shadow-2xl text-left animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                <h3 className="text-[16px] font-bold text-[#111827] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  {t.rejectReasonTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedRejectModal(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 border-0 cursor-pointer text-[16px]"
                >
                  &times;
                </button>
              </div>
              <div className="text-[12.5px] text-gray-500 mb-2">
                <span className="font-medium text-gray-400">{t.orderSn}:</span>{" "}
                <span className="font-mono text-gray-700 font-semibold">{selectedRejectModal.orderSn}</span>
              </div>
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3.5 text-[13.5px] text-rose-700 leading-relaxed break-words whitespace-pre-wrap">
                {selectedRejectModal.reason}
              </div>
              <button
                type="button"
                onClick={() => setSelectedRejectModal(null)}
                className="w-full mt-4 h-10 bg-[#3b82f6] text-white font-semibold rounded-xl text-[14px] hover:bg-[#2563eb] active:scale-98 transition-all cursor-pointer border-0"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpotlineWithdrawListPage({
  type,
}: SpotlineWithdrawListProps) {
  return (
    <I18nProvider>
      <SpotlineWithdrawListContent type={type} />
    </I18nProvider>
  );
}
