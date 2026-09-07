"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { MoneyTranslations } from "./moneyI18n";

interface MoneyActionButtonsProps {
  t: MoneyTranslations;
  activeMode: "deposit" | "withdraw";
  onSelectMode: (mode: "deposit" | "withdraw") => void;
  remainingDeposits?: number;
  remainingWithdrawals?: number;
}

export const MoneyActionButtons: React.FC<MoneyActionButtonsProps> = ({
  t,
  activeMode,
  onSelectMode,
  remainingDeposits = 10,
  remainingWithdrawals = 10,
}) => {
  return (
    <div className="w-full px-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        {/* Deposit Button (Nạp vào) */}
        <button
          onClick={() => onSelectMode("deposit")}
          className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
            activeMode === "deposit"
              ? "bg-[#1150c2] text-white border-[#1150c2] shadow-md shadow-[#1150c2]/20"
              : "bg-white text-gray-800 border-gray-200/80 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                activeMode === "deposit"
                  ? "bg-white/20 text-white"
                  : "bg-blue-50 text-[#1150c2]"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[15px] font-semibold">{t.deposit}</span>
          </div>

          <span
            className={`text-[11px] mt-1.5 ${
              activeMode === "deposit" ? "text-blue-100" : "text-gray-400"
            }`}
          >
            {t.remainingDepositsToday}: {remainingDeposits}
          </span>
        </button>

        {/* Withdraw Button (Rút ra) */}
        <button
          onClick={() => onSelectMode("withdraw")}
          className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
            activeMode === "withdraw"
              ? "bg-[#1150c2] text-white border-[#1150c2] shadow-md shadow-[#1150c2]/20"
              : "bg-white text-gray-800 border-gray-200/80 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                activeMode === "withdraw"
                  ? "bg-white/20 text-white"
                  : "bg-amber-50 text-[#f8b83d]"
              }`}
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[15px] font-semibold">{t.withdraw}</span>
          </div>

          <span
            className={`text-[11px] mt-1.5 ${
              activeMode === "withdraw" ? "text-blue-100" : "text-gray-400"
            }`}
          >
            {t.remainingWithdrawalsToday}: {remainingWithdrawals}
          </span>
        </button>
      </div>
    </div>
  );
};
