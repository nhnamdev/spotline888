"use client";

import React, { useState } from "react";
import { ArrowLeftRight, CheckCircle2, Info } from "lucide-react";
import { MoneyTranslations } from "./moneyI18n";

interface MoneyTransferSectionProps {
  t: MoneyTranslations;
  activeMode: "deposit" | "withdraw";
  onToggleDirection: () => void;
  availableBalance?: number;
  yuebaoBalance?: number;
  onTransferSuccess?: (amount: number, toYuebao: boolean) => void;
}

export const MoneyTransferSection: React.FC<MoneyTransferSectionProps> = ({
  t,
  activeMode,
  onToggleDirection,
  availableBalance = 1000.0,
  yuebaoBalance = 0.0,
  onTransferSuccess,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isDeposit = activeMode === "deposit";
  const sourceBalance = isDeposit ? availableBalance : yuebaoBalance;

  const handleSwap = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 350);
    setAmount("");
    setErrorMessage("");
    onToggleDirection();
  };

  const handleQuickPercent = (pct: number) => {
    const calculated = (sourceBalance * (pct / 100)).toFixed(2);
    setAmount(calculated);
    setErrorMessage("");
  };

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setErrorMessage(t.amountInvalid);
      return;
    }
    if (num > sourceBalance) {
      setErrorMessage(t.amountExceed);
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessToast(true);
      if (onTransferSuccess) {
        onTransferSuccess(num, isDeposit);
      }
      setAmount("");

      setTimeout(() => {
        setSuccessToast(false);
      }, 2500);
    }, 600);
  };

  return (
    <div className="w-full px-4 py-2 select-none">
      {/* Transfer Container Box */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        {/* Direction Row */}
        <div className="flex items-center justify-between bg-[#f8fafc] rounded-xl p-3 border border-gray-100/80">
          {/* Source Account */}
          <div className="flex-1">
            <span className="text-[11px] text-gray-400 block font-normal">
              {isDeposit ? t.available : t.pageTitle}
            </span>
            <span className="text-[14px] font-semibold text-gray-800 block mt-0.5 truncate">
              {isDeposit ? t.toBalance.replace(/^[^\s]+\s*/, "") || t.available : t.pageTitle}
            </span>
          </div>

          {/* Animated Swap Direction Button */}
          <button
            onClick={handleSwap}
            className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-[#1150c2] hover:bg-blue-50 active:scale-90 transition-all mx-2"
            aria-label="Switch transfer direction"
          >
            <ArrowLeftRight
              className={`w-4 h-4 transition-transform duration-300 ${
                isRotating ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Destination Account */}
          <div className="flex-1 text-right">
            <span className="text-[11px] text-gray-400 block font-normal">
              {isDeposit ? t.pageTitle : t.available}
            </span>
            <span className="text-[14px] font-semibold text-[#1150c2] block mt-0.5 truncate">
              {isDeposit ? t.pageTitle : t.toBalance.replace(/^[^\s]+\s*/, "") || t.available}
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[12px] mb-1.5">
            <span className="text-gray-500 font-medium">{t.transferAmount}</span>
            <span className="text-gray-400">
              {t.availableAmount}:{" "}
              <span className="font-semibold text-gray-700">
                {sourceBalance.toFixed(2)} USDT
              </span>
            </span>
          </div>

          <div className="relative flex items-center bg-[#f8fafc] rounded-xl border border-gray-200/80 px-3.5 py-2.5 focus-within:border-[#1150c2] focus-within:bg-white transition-all">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder={t.transferAmountPlaceholder}
              className="w-full bg-transparent text-[16px] font-medium text-gray-800 placeholder-gray-400 focus:outline-none pr-16"
            />
            <button
              onClick={() => handleQuickPercent(100)}
              className="absolute right-3 text-[13px] font-semibold text-[#1150c2] hover:opacity-80 active:scale-95 transition-transform px-1 py-0.5"
            >
              {t.all}
            </button>
          </div>

          {/* Quick Percentage Pills */}
          <div className="grid grid-cols-4 gap-2 mt-2.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleQuickPercent(pct)}
                className="py-1.5 rounded-lg text-[12px] font-medium bg-[#f1f5f9] text-gray-600 hover:bg-gray-200 active:scale-95 transition-all text-center"
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-[12px] text-red-500 font-medium mt-2 px-1">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-5">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl font-semibold text-[15px] text-white shadow-md transition-all duration-200 active:scale-[0.99] flex items-center justify-center space-x-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#1150c2] to-[#1a66f0] hover:from-[#0f44a8] hover:to-[#1554c9] shadow-[#1150c2]/25"
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{t.confirmTransfer}</span>
            )}
          </button>
        </div>
      </div>

      {/* Success Toast Notification */}
      {successToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 backdrop-blur-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
          <span className="text-[14px] font-medium">{t.transferSuccess}</span>
        </div>
      )}

      {/* Transfer Information / Rules Box */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-3 shadow-sm">
        <div className="flex items-center space-x-1.5 text-gray-800 font-semibold text-[13px] pb-2 border-b border-gray-100">
          <Info className="w-4 h-4 text-[#1150c2]" />
          <span>{t.transferInfoTitle}</span>
        </div>

        <ul className="mt-2.5 space-y-2 text-[12px] text-gray-500 leading-relaxed list-disc list-inside">
          <li>{t.infoToYuebao}</li>
          <li>{t.infoToBalance}</li>
          <li>{t.infoInstant}</li>
          <li>{t.infoFee}</li>
        </ul>
      </div>
    </div>
  );
};
