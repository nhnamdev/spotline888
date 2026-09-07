"use client";

import React, { useState } from "react";
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

function SpotlineIndexPageContent() {
  const { currentLang } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const t = INDEX_TRANSLATIONS[currentLang] || INDEX_TRANSLATIONS["zh-CN"];

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
