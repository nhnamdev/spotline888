"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { MONEY_RECORD_TRANSLATIONS } from "./moneyRecordI18n";

interface RecordItem {
  id: number;
  title: string;
  time: string;
  amount: string;
}

const initialRecords: RecordItem[] = [
  {
    id: 1,
    title: "Arbitrage Bot[10天]",
    time: "2026-09-05 08:28:00",
    amount: "-23",
  },
];

function SpotlineMoneyRecordContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    MONEY_RECORD_TRANSLATIONS[currentLang] ||
    MONEY_RECORD_TRANSLATIONS["zh-CN"];

  const [records] = useState<RecordItem[]>(initialRecords);

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
              {records.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[14px] p-4 shadow-[0_3px_12px_rgba(15,23,42,0.06)] flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-[14.5px] font-medium text-[#1e293b]">
                      {item.title}
                    </span>
                    <span className="text-[12px] text-[#9ca3af] mt-1 font-normal">
                      {item.time}
                    </span>
                  </div>
                  <span className="text-[15px] font-semibold text-[#10b981]">
                    {item.amount}
                  </span>
                </div>
              ))}

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
