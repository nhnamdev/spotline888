"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { MONEY_RECORD_TRANSLATIONS, formatFundRecordMemo } from "./moneyRecordI18n";
import { withdrawApi } from "@/lib/api";

interface RecordItem {
  id: number;
  rawMemo: string;
  type?: string;
  time: string;
  amount: string;
}

/**
 * Định dạng thời gian theo múi giờ Vương Quốc Anh (Europe/London: GMT / BST)
 * Định dạng: YYYY-MM-DD HH:mm:ss
 */
function formatToUKTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(d);
    const map: Record<string, string> = {};
    for (const p of parts) {
      map[p.type] = p.value;
    }
    return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
  } catch {
    return new Date(dateStr).toISOString().slice(0, 19).replace("T", " ");
  }
}

function SpotlineMoneyRecordContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    MONEY_RECORD_TRANSLATIONS[currentLang] ||
    MONEY_RECORD_TRANSLATIONS["zh-CN"];

  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const res = await withdrawApi.getMoneyRecords(1, 50);
      if (res.code === 1 && res.data) {
        const rows = res.data.rows || res.data;
        if (Array.isArray(rows)) {
          const mapped: RecordItem[] = rows
            .filter((r: any) => {
              // Bỏ qua các bản ghi có số tiền biến động = 0 (+0.00)
              const val = parseFloat(r.money || '0');
              if (isNaN(val) || Math.abs(val) <= 0.0001) return false;
              // Ẩn hoàn toàn các thao tác chỉnh sửa số dư của admin
              if (r.type === 'admin_adjust' || r.type === 'adjust') return false;
              const memo = String(r.memo || '');
              if (memo.includes('管理员') || memo.includes('设定余额') || memo.includes('直接修改')) return false;
              return true;
            })
            .map((r: any) => ({
              id: r.id,
              rawMemo: r.memo || '',
              type: r.type,
              time: formatToUKTime(r.created_at),
              amount: `${parseFloat(r.money || '0') >= 0 ? '+' : ''}${parseFloat(r.money || '0').toFixed(2)}`,
            }));
          setRecords(mapped);
        }
      }
    } catch (err) {
      console.error("Lỗi nạp lịch sử dòng tiền:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

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
          <h1 className="text-[18px] font-bold text-[#111827]">{t.title}</h1>
          <div className="w-9 h-9" />
        </div>

        {/* Record List */}
        <div className="flex flex-col gap-3 mt-1">
          {records.length === 0 ? (
            <div className="bg-white rounded-[14px] p-8 text-center shadow-[0_4px_20px_rgba(15,23,42,0.06)] mt-4">
              <span className="text-[13.5px] text-[#9ca3af]">
                {t.emptyRecords}
              </span>
            </div>
          ) : (
            <>
              {records.map((item) => {
                let displayTitle = formatFundRecordMemo(item.rawMemo, currentLang);
                if (!displayTitle || displayTitle.includes('管理员') || displayTitle.includes('设定余额') || displayTitle.includes('直接修改')) {
                  const num = parseFloat(item.amount || '0');
                  displayTitle = num >= 0 
                    ? formatFundRecordMemo('充值入金', currentLang) 
                    : (item.type === 'withdraw' ? 'Withdrawal' : 'Recharge');
                }
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-[14px] p-4 shadow-[0_3px_12px_rgba(15,23,42,0.06)] flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="text-[14.5px] font-medium text-[#1e293b]">
                        {displayTitle}
                      </span>
                      <span className="text-[12px] text-[#9ca3af] mt-1 font-normal">
                        {item.time}
                      </span>
                    </div>
                    <span className="text-[15px] font-semibold text-[#10b981]">
                      {item.amount}
                    </span>
                  </div>
                );
              })}

              <div className="text-center py-6 text-[12.5px] text-[#9ca3af]">
                {t.noMore}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SpotlineMoneyRecordPage() {
  return (
    <I18nProvider>
      <SpotlineMoneyRecordContent />
    </I18nProvider>
  );
}
