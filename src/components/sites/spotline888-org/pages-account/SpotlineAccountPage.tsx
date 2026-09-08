"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { ACCOUNT_TRANSLATIONS } from "./accountI18n";

function SpotlineAccountContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    ACCOUNT_TRANSLATIONS[currentLang] || ACCOUNT_TRANSLATIONS["zh-CN"];

  const handleSelectType = (payType: string) => {
    router.push(`/pages/account/account-detail?pay_type=${payType}`);
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
          <h1 className="text-[18px] font-bold text-[#111827]">{t.title}</h1>
          <div className="w-9 h-9" />
        </div>

        {/* Illustration */}
        <div className="flex justify-center my-4">
          <div className="w-[240px] h-[220px] relative">
            <Image
              src="/sites/spotline888-org/pages-account/account_illustration.png"
              alt="Account Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Section Label */}
        <div className="text-[13px] text-[#9ca3af] mb-3 px-1 font-normal">
          {t.selectAccountType}
        </div>

        {/* 3 Account Types Cards */}
        <div className="flex flex-col gap-3.5">
          {/* Bank Card */}
          <div
            onClick={() => handleSelectType("bank_card")}
            className="w-full h-[62px] rounded-[16px] bg-gradient-to-r from-[#00b074] to-[#10b981] px-5 flex items-center justify-between text-white shadow-[0_4px_16px_rgba(0,176,116,0.25)] cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <span className="text-[16px] font-medium tracking-wide">
                {t.bankCard}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/80" />
          </div>

          {/* USDT-TRC20 */}
          <div
            onClick={() => handleSelectType("usdt-trc20")}
            className="w-full h-[62px] rounded-[16px] bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-5 flex items-center justify-between text-white shadow-[0_4px_16px_rgba(37,99,235,0.25)] cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-[14px]">
                ₮
              </div>
              <span className="text-[16px] font-medium tracking-wide">
                {t.usdtTrc20}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/80" />
          </div>

          {/* USDT-ERC20 */}
          <div
            onClick={() => handleSelectType("usdt-erc20")}
            className="w-full h-[62px] rounded-[16px] bg-gradient-to-r from-[#ea580c] to-[#f97316] px-5 flex items-center justify-between text-white shadow-[0_4px_16px_rgba(234,88,12,0.25)] cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-[14px]">
                ₮
              </div>
              <span className="text-[16px] font-medium tracking-wide">
                {t.usdtErc20}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpotlineAccountPage() {
  return (
    <I18nProvider>
      <SpotlineAccountContent />
    </I18nProvider>
  );
}
