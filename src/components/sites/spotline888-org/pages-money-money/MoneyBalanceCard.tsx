"use client";

import React, { useState } from "react";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { MoneyTranslations } from "./moneyI18n";

interface MoneyBalanceCardProps {
  t: MoneyTranslations;
  balance?: number;
  confirmedShares?: number;
  pendingShares?: number;
  yieldRate?: string;
  totalEarnings?: number;
}

export const MoneyBalanceCard: React.FC<MoneyBalanceCardProps> = ({
  t,
  balance = 0.0,
  confirmedShares = 0.0,
  pendingShares = 0.0,
  yieldRate = "4.85% - 8.20%",
  totalEarnings = 0.0,
}) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="w-full px-4 pt-4 pb-2">
      {/* Main Glass/Gradient Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12429e] via-[#1150c2] to-[#0c357d] text-white p-5 shadow-[0_8px_24px_rgba(17,80,194,0.28)] select-none">
        {/* Background Glowing Ambient Orb */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br from-[#f8b83d]/25 to-[#4287f5]/30 blur-2xl pointer-events-none animate-pulse-glow" />

        {/* Liquid Wave Animation Layers at the Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 overflow-hidden pointer-events-none opacity-40">
          {/* Back Wave */}
          <svg
            className="absolute bottom-0 left-0 w-[200%] h-20 animate-wave2 text-white/10"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,40 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
          {/* Front Wave */}
          <svg
            className="absolute bottom-0 left-0 w-[200%] h-16 animate-wave1 text-white/20"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C200,110 450,10 600,50 C800,100 1000,-10 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Card Content */}
        <div className="relative z-10 flex flex-col justify-between min-h-[140px]">
          {/* Top Row: Label + Eye Toggle + Yield Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[13px] text-blue-100 font-medium tracking-wide">
                {t.totalBalanceLabel} (USDT)
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 text-blue-200/80 hover:text-white transition-colors"
                aria-label="Toggle balance visibility"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Yield Rate Pill */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-[#f8b83d]/25 to-[#f8b83d]/15 border border-[#f8b83d]/40 rounded-full px-2.5 py-0.5 backdrop-blur-sm shadow-sm">
              <TrendingUp className="w-3 h-3 text-[#f8b83d]" />
              <span className="text-[11px] font-semibold text-[#f8b83d]">
                {yieldRate}
              </span>
            </div>
          </div>

          {/* Center: Large Balance Number */}
          <div className="my-3">
            <div className="flex items-baseline space-x-1">
              <span className="text-[34px] font-bold tracking-tight text-white leading-tight font-sans">
                {showBalance ? balance.toFixed(2) : "••••••"}
              </span>
              <span className="text-[14px] text-blue-200 font-medium">USDT</span>
            </div>

            {/* Daily Accumulated Earnings */}
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-[12px] text-blue-200/90 font-normal">
                {t.earnings}:
              </span>
              <span className="text-[12px] text-[#34d399] font-semibold">
                +{totalEarnings.toFixed(2)} USDT
              </span>
            </div>
          </div>

          {/* Bottom Split: Confirmed Shares vs Pending Shares */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex-1 pr-2">
              <div className="text-[11px] text-blue-200/80 font-normal">
                {t.confirmedShares}
              </div>
              <div className="text-[14px] font-semibold text-white mt-0.5">
                {showBalance ? confirmedShares.toFixed(2) : "••••"}
              </div>
            </div>

            <div className="w-[1px] h-6 bg-white/15 mx-2" />

            <div className="flex-1 pl-2">
              <div className="text-[11px] text-blue-200/80 font-normal">
                {t.pendingShares}
              </div>
              <div className="text-[14px] font-semibold text-white mt-0.5">
                {showBalance ? pendingShares.toFixed(2) : "••••"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
