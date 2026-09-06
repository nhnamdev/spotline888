"use client";

import React from "react";
import Image from "next/image";
import { IndexTranslations } from "./indexI18n";

interface IndexTabBarProps {
  t: IndexTranslations;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const IndexTabBar: React.FC<IndexTabBarProps> = ({
  t,
  activeTab = "home",
  onTabChange,
}) => {
  const tabs = [
    {
      key: "home",
      label: t.tabHome,
      icon: "/sites/spotline888-org/pages-index-index/index.png",
      activeIcon: "/sites/spotline888-org/pages-index-index/index_active.png",
      href: "#/pages/index/index",
    },
    {
      key: "products",
      label: t.tabProducts,
      icon: "/sites/spotline888-org/pages-index-index/chanpin.png",
      activeIcon: "/sites/spotline888-org/pages-index-index/chanpin_active.png",
      href: "#/pages/product/product",
    },
    {
      key: "balance",
      label: t.tabBalance,
      icon: "/sites/spotline888-org/pages-index-index/yue.png",
      activeIcon: "/sites/spotline888-org/pages-index-index/yue_active.png",
      href: "#/pages/money/money",
    },
    {
      key: "mine",
      label: t.tabMine,
      icon: "/sites/spotline888-org/pages-index-index/my.png",
      activeIcon: "/sites/spotline888-org/pages-index-index/my_active.png",
      href: "#/pages/user/user",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none select-none">
      <nav className="w-full max-w-[480px] bg-white border-t border-gray-100/80 shadow-[0_-1px_6px_rgba(0,0,0,0.06)] pointer-events-auto">
        <div className="flex h-[50px] items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <div
                key={tab.key}
                onClick={() => onTabChange && onTabChange(tab.key)}
                className="flex-1 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src={isActive ? tab.activeIcon : tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span
                  className={`text-[10px] mt-0.5 leading-none ${
                    isActive
                      ? "text-[#f8b83d] font-semibold"
                      : "text-[#a8a9ac]"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
