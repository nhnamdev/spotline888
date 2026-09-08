"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { LanguageDrawer } from "../pages-login-login/LanguageDrawer";
import { SET_TRANSLATIONS } from "./setI18n";

function SpotlineSetContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t = SET_TRANSLATIONS[currentLang] || SET_TRANSLATIONS["zh-CN"];

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleClearCache = () => {
    showToast(t.cacheCleared);
  };

  const handlePasswordClick = () => {
    router.push("/pages/customer-service/customer-service");
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

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3000] px-4 py-2.5 bg-black/80 backdrop-blur-sm text-white text-[13.5px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
            {toastMsg}
          </div>
        )}

        {/* Setting Items */}
        <div className="flex flex-col gap-3 mt-1">
          {/* Language Setting */}
          <div
            onClick={() => setIsLangOpen(true)}
            className="bg-white rounded-[14px] px-4 py-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.06)] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <span className="text-[15px] font-medium text-[#1e293b]">
              {t.languageSetting}
            </span>
            <div className="flex items-center gap-1.5 text-[#9ca3af]">
              <span className="text-[14px]">{t.currentLangLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Login Password */}
          <div
            onClick={handlePasswordClick}
            className="bg-white rounded-[14px] px-4 py-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.06)] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <span className="text-[15px] font-medium text-[#1e293b]">
              {t.loginPassword}
            </span>
            <div className="flex items-center gap-1.5 text-[#9ca3af]">
              <span className="text-[14px]">{t.modify}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Transaction Password */}
          <div
            onClick={handlePasswordClick}
            className="bg-white rounded-[14px] px-4 py-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.06)] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <span className="text-[15px] font-medium text-[#1e293b]">
              {t.tradePassword}
            </span>
            <div className="flex items-center gap-1.5 text-[#9ca3af]">
              <span className="text-[14px]">{t.modify}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Clear Cache */}
          <div
            onClick={handleClearCache}
            className="bg-white rounded-[14px] px-4 py-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.06)] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <span className="text-[15px] font-medium text-[#1e293b]">
              {t.clearCache}
            </span>
            <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
          </div>

          {/* Notice: contact customer service */}
          <div
            onClick={() =>
              router.push("/pages/customer-service/customer-service")
            }
            className="w-full mt-2 p-3.5 rounded-[12px] bg-[#fef3c7]/60 border border-[#fde68a] flex items-center justify-between cursor-pointer active:opacity-80 transition-opacity"
          >
            <span className="text-[13.5px] text-[#d97706] font-medium">
              {t.contactServiceToChangePwd}
            </span>
            <ChevronRight className="w-4 h-4 text-[#d97706]" />
          </div>
        </div>

        {/* Language Bottom Sheet Drawer */}
        <LanguageDrawer
          isOpen={isLangOpen}
          onClose={() => setIsLangOpen(false)}
        />
      </div>
    </div>
  );
}

export default function SpotlineSetPage() {
  return (
    <I18nProvider>
      <SpotlineSetContent />
    </I18nProvider>
  );
}
