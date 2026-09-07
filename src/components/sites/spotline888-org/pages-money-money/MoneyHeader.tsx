"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { MoneyTranslations } from "./moneyI18n";

interface MoneyHeaderProps {
  t: MoneyTranslations;
  onOpenDetails: () => void;
  onBack?: () => void;
}

export const MoneyHeader: React.FC<MoneyHeaderProps> = ({
  t,
  onOpenDetails,
  onBack,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = "#/pages/index/index";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 flex items-center justify-between h-[48px] px-4 select-none">
      <button
        onClick={handleBack}
        className="w-8 h-8 flex items-center justify-start text-gray-700 active:opacity-60 transition-opacity"
        aria-label="Back"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
      </button>

      <h1 className="text-[17px] font-semibold text-gray-900 tracking-tight">
        {t.pageTitle}
      </h1>

      <button
        onClick={onOpenDetails}
        className="text-[14px] text-[#1150c2] font-medium active:opacity-60 transition-opacity py-1 px-1"
      >
        {t.details}
      </button>
    </header>
  );
};
