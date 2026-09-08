"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { VERIFY_CENTER_TRANSLATIONS } from "./verifyCenterI18n";

function SpotlineVerifyCenterContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    VERIFY_CENTER_TRANSLATIONS[currentLang] ||
    VERIFY_CENTER_TRANSLATIONS["zh-CN"];

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

        {/* Center Verification Status */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <div className="w-[140px] h-[140px] relative mb-6">
            <Image
              src="/sites/spotline888-org/pages-verify/verify_clock.png"
              alt="Verifying Status"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="text-[22px] font-bold text-[#111827] mb-2 tracking-tight">
            {t.statusReviewing}
          </h2>
          <p className="text-[14px] text-[#9ca3af] text-center font-normal px-6">
            {t.descReviewing}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SpotlineVerifyCenterPage() {
  return (
    <I18nProvider>
      <SpotlineVerifyCenterContent />
    </I18nProvider>
  );
}
