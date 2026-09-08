"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Headphones } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { CUSTOMER_SERVICE_TRANSLATIONS } from "./customerServiceI18n";

function SpotlineCustomerServiceContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    CUSTOMER_SERVICE_TRANSLATIONS[currentLang] ||
    CUSTOMER_SERVICE_TRANSLATIONS["zh-CN"];

  const handleOpenChat = () => {
    window.open("https://wa.me/6287844562370?name=&id=0", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ff] via-[#f8fafc_40%] to-white flex justify-center select-none pb-12">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-4 pb-3">
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

        {/* Hero Illustration */}
        <div className="flex flex-col items-center justify-center pt-8 pb-10">
          <div className="relative w-[280px] h-[180px] flex items-center justify-center">
            {/* Customer support SVG graphic matching original design */}
            <svg
              viewBox="0 0 320 220"
              className="w-full h-full drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Laptop Screen */}
              <rect x="70" y="50" width="180" height="120" rx="6" fill="#1e293b" />
              <rect x="76" y="56" width="168" height="108" rx="4" fill="#e0f2fe" />
              {/* Laptop Base */}
              <path
                d="M45 170 C45 168 47 166 50 166 L270 166 C273 166 275 168 275 170 L280 174 C280 176 278 178 275 178 L45 178 C42 178 40 176 40 174 Z"
                fill="#0f172a"
              />
              <rect x="145" y="168" width="30" height="3" rx="1.5" fill="#38bdf8" />
              {/* Support Representative Illustration */}
              {/* Body / Shirt */}
              <path
                d="M130 145 C130 115 140 100 160 100 C180 100 190 115 190 145 Z"
                fill="#10b981"
              />
              <rect x="150" y="115" width="20" height="4" rx="2" fill="#ecfdf5" />
              {/* Head / Face */}
              <ellipse cx="160" cy="85" rx="16" ry="18" fill="#fed7aa" />
              {/* Hair */}
              <path
                d="M142 82 C142 68 150 62 162 62 C174 62 180 70 178 84 C175 75 168 70 156 72 C148 74 144 78 142 82 Z"
                fill="#1e293b"
              />
              {/* Headset */}
              <path
                d="M145 80 C145 68 152 64 160 64 C168 64 175 68 175 80"
                stroke="#0284c7"
                strokeWidth="3"
                fill="none"
              />
              <ellipse cx="145" cy="82" rx="4" ry="6" fill="#0284c7" />
              <ellipse cx="175" cy="82" rx="4" ry="6" fill="#0284c7" />
              <path d="M145 84 Q148 94 158 92" stroke="#0284c7" strokeWidth="2" fill="none" />
              <circle cx="158" cy="92" r="2.5" fill="#0284c7" />
              {/* Raised arm gesture */}
              <path
                d="M188 120 Q198 105 200 95"
                stroke="#fed7aa"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M132 120 Q122 130 118 135"
                stroke="#fed7aa"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              {/* Blue Chat Bubble */}
              <g transform="translate(60, 40)">
                <rect width="68" height="46" rx="8" fill="#3b82f6" />
                <path d="M20 46 L15 54 L26 46 Z" fill="#3b82f6" />
                <rect x="12" y="14" width="44" height="4" rx="2" fill="#ffffff" />
                <rect x="12" y="24" width="28" height="4" rx="2" fill="#ffffff" />
              </g>
              {/* Green Question Bubble */}
              <g transform="translate(104, 15)">
                <rect width="40" height="34" rx="6" fill="#10b981" />
                <path d="M14 34 L10 40 L20 34 Z" fill="#10b981" />
                <text
                  x="20"
                  y="24"
                  fill="#ffffff"
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  ?
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Customer Support Channel Card */}
        <div
          onClick={handleOpenChat}
          className="bg-white rounded-[14px] px-5 py-4.5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] flex items-center justify-between cursor-pointer hover:shadow-md active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3.5">
            {/* Headset Avatar Icon */}
            <div className="w-10 h-10 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[15px] font-bold text-[#111827] block">
                {t.channel1}
              </span>
              <span className="text-[12px] text-[#6b7280]">
                {t.workingHours}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#9ca3af]" />
        </div>

        {/* Notice Info Footer */}
        <div className="mt-8 text-center px-4">
          <p className="text-[12.5px] text-[#9ca3af] leading-relaxed">
            {t.onlineNotice}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SpotlineCustomerServicePage() {
  return (
    <I18nProvider>
      <SpotlineCustomerServiceContent />
    </I18nProvider>
  );
}
