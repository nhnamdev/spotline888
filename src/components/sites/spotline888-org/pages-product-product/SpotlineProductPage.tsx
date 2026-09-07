"use client";

import React, { useState } from "react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { PRODUCT_TRANSLATIONS } from "./productI18n";
import { ProductTopTabs } from "./ProductTopTabs";
import { ProductVarietySection } from "./ProductVarietySection";
import { IndexTabBar } from "../pages-index-index/IndexTabBar";
import { INDEX_TRANSLATIONS } from "../pages-index-index/indexI18n";

function SpotlineProductPageContent() {
  const { currentLang } = useI18n();
  const [topTab, setTopTab] = useState(0);

  const productT =
    PRODUCT_TRANSLATIONS[currentLang] || PRODUCT_TRANSLATIONS["zh-CN"];
  const indexT =
    INDEX_TRANSLATIONS[currentLang] || INDEX_TRANSLATIONS["zh-CN"];

  const handleTabChange = (tabKey: string) => {
    if (tabKey === "home") {
      window.location.hash = "#/pages/index/index";
    } else if (tabKey === "products") {
      window.location.hash = "#/pages/product/product";
    } else if (tabKey === "balance") {
      window.location.hash = "#/pages/money/money";
    } else if (tabKey === "mine") {
      window.location.hash = "#/pages/user/user";
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center">
      {/* Mobile Frame Container matching Uni-app Page */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#f6f7fb] flex flex-col relative pb-[65px] shadow-sm">
        {/* Top Header Tabs */}
        <ProductTopTabs
          t={productT}
          activeTab={topTab}
          onTabChange={(idx) => setTopTab(idx)}
        />

        {/* Variety Product Table List */}
        <div className="flex-1">
          <ProductVarietySection t={productT} />
        </div>

        {/* Fixed Bottom Tab Bar with Products Active */}
        <IndexTabBar
          t={indexT}
          activeTab="products"
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}

export default function SpotlineProductPage() {
  return (
    <I18nProvider>
      <SpotlineProductPageContent />
    </I18nProvider>
  );
}
