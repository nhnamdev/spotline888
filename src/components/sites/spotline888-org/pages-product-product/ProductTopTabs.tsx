"use client";

import React from "react";
import { ProductTranslations } from "./productI18n";

interface ProductTopTabsProps {
  t: ProductTranslations;
  activeTab?: number;
  onTabChange?: (index: number) => void;
}

export const ProductTopTabs: React.FC<ProductTopTabsProps> = ({
  t,
  activeTab = 0,
  onTabChange,
}) => {
  const tabs = [t.productTitle];

  return (
    <div className="w-full bg-white px-[10px] pt-[5px] pb-0 select-none border-b border-gray-100/50">
      <div className="flex items-center">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <div
              key={idx}
              onClick={() => onTabChange && onTabChange(idx)}
              className="flex flex-col items-center cursor-pointer px-[11px] py-[6px] relative"
            >
              <span
                className={`text-[16px] leading-[22px] transition-colors ${
                  isActive ? "font-bold text-[#222222]" : "text-[#a8a9ac]"
                }`}
              >
                {tab}
              </span>
              {isActive && (
                <div className="w-[30px] h-[3px] bg-[#1150c2] rounded-full mt-[4px] transition-all duration-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
