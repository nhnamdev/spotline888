"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { WITHDRAW_LIST_TRANSLATIONS } from "./withdrawListI18n";
import { getR2Url } from "@/lib/r2";

interface SpotlineWithdrawListProps {
  type: "deposit" | "withdraw";
}

function SpotlineWithdrawListContent({ type }: SpotlineWithdrawListProps) {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    WITHDRAW_LIST_TRANSLATIONS[currentLang] ||
    WITHDRAW_LIST_TRANSLATIONS["zh-CN"];

  const title = type === "deposit" ? t.depositTitle : t.withdrawTitle;
  const emptyText = type === "deposit" ? t.depositEmpty : t.withdrawEmpty;

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

        {/* Center Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <div className="w-[140px] h-[120px] relative mb-4">
            <Image
              src={getR2Url("/sites/spotline888-org/pages-withdraw-list/record_empty.png")}
              alt="Empty Records"
              fill
              className="object-contain"
            />
          </div>

          <p className="text-[14px] text-[#9ca3af] text-center font-normal">
            {emptyText}
          </p>
        </div>
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
