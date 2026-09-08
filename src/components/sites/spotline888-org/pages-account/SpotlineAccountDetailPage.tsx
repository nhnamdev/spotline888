"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { ACCOUNT_TRANSLATIONS } from "./accountI18n";

function SpotlineAccountDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLang } = useI18n();
  const t =
    ACCOUNT_TRANSLATIONS[currentLang] || ACCOUNT_TRANSLATIONS["zh-CN"];

  const payType = searchParams.get("pay_type") || "bank_card";
  const isBank = payType === "bank_card";
  const title = isBank
    ? t.bankCard
    : payType === "usdt-erc20"
    ? t.usdtErc20
    : t.usdtTrc20;

  // State for wallet
  const [walletAddr, setWalletAddr] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleSaveWallet = () => {
    if (!walletAddr.trim()) {
      showToast(t.placeholderWallet);
      return;
    }
    showToast(t.saveSuccess);
    setTimeout(() => {
      router.back();
    }, 800);
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

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3000] px-4 py-2.5 bg-black/80 backdrop-blur-sm text-white text-[13.5px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
            {toastMsg}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] flex flex-col gap-4">
          {isBank ? (
            <>
              {/* Full Name */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.name}
                </label>
                <div className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium">
                  粉***
                </div>
              </div>

              {/* Nationality */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.nationality}
                </label>
                <div className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium">
                  的
                </div>
              </div>

              {/* Bank Address */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5 leading-snug">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.bankAddress}
                </label>
                <div className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium">
                  的的
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.bankName}
                </label>
                <div className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium">
                  的粉
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.cardNumber}
                </label>
                <div className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium italic">
                  发多少*********** 发多少
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Crypto Wallet Address */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5 leading-snug">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.walletAddress}
                </label>
                <input
                  type="text"
                  value={walletAddr}
                  onChange={(e) => setWalletAddr(e.target.value)}
                  placeholder={t.placeholderWallet}
                  className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveWallet}
                className="w-full py-3 rounded-full bg-[#cbd5e1] hover:bg-[#2563eb] text-white text-[15px] font-semibold transition-colors mt-2 cursor-pointer border-0"
              >
                {t.btnSave}
              </button>
            </>
          )}

          {/* Contact Service notice card */}
          <div
            onClick={() =>
              router.push("/pages/customer-service/customer-service")
            }
            className="w-full mt-2 p-3 rounded-[10px] bg-[#eef2ff] border-l-4 border-[#4f46e5] flex items-center justify-between cursor-pointer active:opacity-80 transition-opacity"
          >
            <span className="text-[13px] text-[#4338ca] font-normal">
              {t.contactServiceToChange}
            </span>
            <ChevronRight className="w-4 h-4 text-[#4338ca]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpotlineAccountDetailPage() {
  return (
    <I18nProvider>
      <Suspense
        fallback={<div className="min-h-screen bg-gradient-to-b from-[#eef2ff]" />}
      >
        <SpotlineAccountDetailInner />
      </Suspense>
    </I18nProvider>
  );
}
