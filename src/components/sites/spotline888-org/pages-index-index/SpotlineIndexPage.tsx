"use client";

import React, { useState, useEffect } from "react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { LanguageDrawer } from "../pages-login-login/LanguageDrawer";
import { INDEX_TRANSLATIONS } from "./indexI18n";
import { IndexHeader } from "./IndexHeader";
import { IndexBanner } from "./IndexBanner";
import { IndexActionGrid } from "./IndexActionGrid";
import { IndexNotice } from "./IndexNotice";
import { IndexRecommendProducts } from "./IndexRecommendProducts";
import { IndexCryptoList } from "./IndexCryptoList";
import { IndexTabBar } from "./IndexTabBar";

import { contentApi } from "@/lib/api";

function SpotlineIndexPageContent() {
  const { currentLang } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [alertNotice, setAlertNotice] = useState<string | null>(null);
  const [showAlertNotice, setShowAlertNotice] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await contentApi.getPublicConfig();
        if (res.code === 1 && res.data?.alert_notice) {
          const notice = String(res.data.alert_notice).trim();
          if (notice) {
            setAlertNotice(notice);
            // Hiển thị thông báo nếu chưa đóng trong phiên làm việc
            const dismissed = sessionStorage.getItem("dismissed_alert_notice");
            if (dismissed !== notice) {
              setShowAlertNotice(true);
            }
          }
        }
      } catch {
        // ignore
      }
    }
    loadConfig();
  }, []);

  const handleCloseAlert = () => {
    if (alertNotice) {
      sessionStorage.setItem("dismissed_alert_notice", alertNotice);
    }
    setShowAlertNotice(false);
  };

  const t = INDEX_TRANSLATIONS[currentLang] || INDEX_TRANSLATIONS["th-TH"];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#f8fafc] flex flex-col relative pb-[65px] shadow-sm">
        {/* Top Header */}
        <IndexHeader onOpenLang={() => setIsLangOpen(true)} />

        {/* Banner Carousel */}
        <IndexBanner />

        {/* 6 Action Buttons Grid */}
        <IndexActionGrid t={t} />

        {/* Announcement / Mission Notice */}
        <IndexNotice t={t} />

        {/* Recommended Products with sparkline trend */}
        <IndexRecommendProducts t={t} />

        {/* Future Products Live Table */}
        <IndexCryptoList t={t} />

        {/* Fixed Bottom Tab Bar */}
        <IndexTabBar
          t={t}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            const targetHash =
              tab === "products"
                ? "#/pages/product/product"
                : tab === "balance"
                ? "#/pages/money/money"
                : tab === "mine"
                ? "#/pages/user/user"
                : "#/pages/index/index";

            if (typeof window !== "undefined") {
              if (
                window.location.pathname === "/" ||
                window.location.pathname === ""
              ) {
                window.location.hash = targetHash;
              } else {
                window.location.href = "/" + targetHash;
              }
            }
          }}
        />

        {/* Bottom Sheet Language Drawer */}
        <LanguageDrawer
          isOpen={isLangOpen}
          onClose={() => setIsLangOpen(false)}
        />

        {/* 弹窗公告 (Alert Notice from Admin) */}
        {showAlertNotice && alertNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-5">
            <div className="bg-white rounded-2xl p-5 max-w-[360px] w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📢</span>
                <h3 className="font-bold text-[16px] text-gray-900">
                  {currentLang === "th-TH" ? "ประกาศ" : currentLang === "vi-VN" ? "Thông báo" : "Announcement"}
                </h3>
              </div>
              <div className="text-[13.5px] text-gray-600 leading-relaxed whitespace-pre-wrap max-h-[260px] overflow-y-auto mb-4">
                {alertNotice}
              </div>
              <button
                type="button"
                onClick={handleCloseAlert}
                className="w-full py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] active:scale-98 text-white font-semibold rounded-xl text-[14px] transition-all cursor-pointer border-0"
              >
                {currentLang === "th-TH" ? "ตกลง" : currentLang === "vi-VN" ? "Đã hiểu" : "OK"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpotlineIndexPage() {
  return (
    <I18nProvider>
      <SpotlineIndexPageContent />
    </I18nProvider>
  );
}
