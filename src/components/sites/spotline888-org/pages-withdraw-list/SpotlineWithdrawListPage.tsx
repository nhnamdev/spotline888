"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { WITHDRAW_LIST_TRANSLATIONS } from "./withdrawListI18n";
import { withdrawApi, rechargeApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";

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
            <span className="text-[13px]">Đang tải dữ liệu...</span>
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
              const timeStr = item.created_at
                ? new Date(item.created_at)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                : "-";
              const typeBadge =
                item.withdraw_type === "usdt"
                  ? "USDT"
                  : item.pay_type || "USDT";

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
                        USDT
                      </span>
                    </div>

                    <span className="text-[12px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {typeBadge}
                    </span>
                  </div>

                  {/* Row 3: Time & Note */}
                  <div className="flex items-center justify-between text-[11.5px] text-gray-400">
                    <span>{timeStr}</span>
                    {(item.note || item.member_note) && (
                      <span className="text-rose-500 italic max-w-[180px] truncate text-right">
                        {item.note || item.member_note}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
