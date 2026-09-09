"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { ABOUT_US_TRANSLATIONS } from "./aboutUsI18n";
import { getR2Url } from "@/lib/r2";

function SpotlineAboutUsContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    ABOUT_US_TRANSLATIONS[currentLang] || ABOUT_US_TRANSLATIONS["zh-CN"];

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

        {/* Content Box */}
        <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] flex flex-col gap-4 text-[#1e293b] mt-1">
          <div>
            <h2 className="text-[15px] font-bold text-[#0f172a] mb-2 leading-relaxed">
              {t.p1Heading}
            </h2>
            <p className="text-[13.5px] text-[#334155] leading-[1.75] font-normal">
              {t.p1Body}
            </p>
          </div>

          <p className="text-[13.5px] text-[#334155] leading-[1.75] font-normal">
            {t.vision}
          </p>

          <div>
            <p className="text-[13.5px] font-medium text-[#1e293b] mb-2 leading-[1.75]">
              {t.servicesHeading}
            </p>
            <ul className="space-y-2 text-[13.5px] text-[#334155] leading-[1.7]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#3b82f6] font-bold">•</span>
                <span>{t.service1}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#3b82f6] font-bold">•</span>
                <span>{t.service2}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#3b82f6] font-bold">•</span>
                <span>{t.service3}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#3b82f6] font-bold">•</span>
                <span>{t.service4}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#3b82f6] font-bold">•</span>
                <span>{t.service5}</span>
              </li>
            </ul>
          </div>

          {/* Philosophy Banner */}
          <div className="relative w-full aspect-[464/170] rounded-[10px] overflow-hidden mt-2 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
            <Image
              src={getR2Url("/sites/spotline888-org/pages-yinsi-gy/about_banner.png")}
              alt="Philosophy"
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 480px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpotlineAboutUsPage() {
  return (
    <I18nProvider>
      <SpotlineAboutUsContent />
    </I18nProvider>
  );
}
