"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { TRANSFER_TRANSLATIONS } from "./transferI18n";
import { authApi, exchangeApi } from "@/lib/api";

function SpotlineTransferContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    TRANSFER_TRANSLATIONS[currentLang] || TRANSFER_TRANSLATIONS["zh-CN"];

  const [direction, setDirection] = useState<"myrToUsdt" | "usdtToMyr">(
    "myrToUsdt"
  );
  const [myrBalance, setMyrBalance] = useState(0.0);
  const [usdtBalance, setUsdtBalance] = useState(0.0);
  const [rate, setRate] = useState(4.07);
  const [amount, setAmount] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWallet = useCallback(async () => {
    try {
      const [profRes, rateRes] = await Promise.all([
        authApi.getProfile(),
        exchangeApi.getRate(),
      ]);
      if (profRes.code === 1 && profRes.data) {
        setMyrBalance(parseFloat(profRes.data.money || "0"));
        setUsdtBalance(parseFloat(profRes.data.usdt || "0"));
      }
      if (rateRes.code === 1 && rateRes.data) {
        setRate(parseFloat(rateRes.data.rate || "4.07"));
      }
    } catch (err) {
      console.error("Lỗi nạp số dư đổi tiền:", err);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const currentAvailable =
    direction === "myrToUsdt" ? myrBalance : usdtBalance;
  const currentUnit = direction === "myrToUsdt" ? "RM" : "USDT";

  const handleAll = () => {
    setAmount(currentAvailable.toFixed(2));
  };

  const handleConfirm = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      showToast(t.pleaseEnterAmount);
      return;
    }
    if (val > currentAvailable) {
      showToast(t.insufficientBalance);
      return;
    }

    try {
      setLoading(true);
      const fromCurrency = direction === "myrToUsdt" ? "MYR" : "USDT";
      const toCurrency = direction === "myrToUsdt" ? "USDT" : "MYR";
      const res = await exchangeApi.swap({
        fromCurrency,
        toCurrency,
        amount: val,
      });

      if (res.code === 1) {
        showToast(t.transferSuccess);
        setAmount("");
        fetchWallet();
      } else {
        showToast(res.msg || "Giao dịch thất bại");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi giao dịch quy đổi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ff] via-[#f8fafc_35%] to-white flex justify-center select-none pb-12">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-4 pb-4">
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

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3000] px-4 py-2.5 bg-black/80 backdrop-blur-sm text-white text-[13.5px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
            {toastMsg}
          </div>
        )}

        {/* Top 2 Balance Cards */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* MYR Balance */}
          <div className="bg-white rounded-[14px] p-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.06)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-bold text-[15px] shrink-0">
              ₮
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#9ca3af] truncate">
                {t.myrBalanceTitle}
              </span>
              <span className="text-[14.5px] font-bold text-[#111827] leading-tight mt-0.5">
                RM{myrBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* USDT Balance */}
          <div className="bg-white rounded-[14px] p-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.06)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-[15px] shrink-0">
              ₮
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#9ca3af] truncate">
                {t.usdtBalanceTitle}
              </span>
              <span className="text-[14.5px] font-bold text-[#111827] leading-tight mt-0.5">
                {usdtBalance.toFixed(2)} USDT
              </span>
            </div>
          </div>
        </div>

        {/* Transfer Direction Card */}
        <div className="bg-white rounded-[16px] p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)] mb-3">
          <label className="text-[13px] text-[#475569] font-medium block mb-3">
            {t.transferDirection}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* MYR -> USDT */}
            <button
              type="button"
              onClick={() => setDirection("myrToUsdt")}
              className={`p-3 rounded-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                direction === "myrToUsdt"
                  ? "border-[#4f46e5] bg-[#eef2ff] text-[#4f46e5] font-semibold shadow-sm"
                  : "border-gray-200/80 bg-[#f8fafc] text-[#475569] hover:bg-gray-100"
              }`}
            >
              <span className="text-[12.5px] leading-tight text-center">
                Malaysian Ringgit
              </span>
              <div className="w-5 h-5 rounded-full bg-[#4f46e5] text-white flex items-center justify-center shrink-0">
                <ArrowRight className="w-3 h-3" />
              </div>
              <span className="text-[12.5px] font-bold">USDT</span>
            </button>

            {/* USDT -> MYR */}
            <button
              type="button"
              onClick={() => setDirection("usdtToMyr")}
              className={`p-3 rounded-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                direction === "usdtToMyr"
                  ? "border-[#4f46e5] bg-[#eef2ff] text-[#4f46e5] font-semibold shadow-sm"
                  : "border-gray-200/80 bg-[#f8fafc] text-[#475569] hover:bg-gray-100"
              }`}
            >
              <span className="text-[12.5px] font-bold">USDT</span>
              <div className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center shrink-0">
                <ArrowRight className="w-3 h-3" />
              </div>
              <span className="text-[12.5px] leading-tight text-center">
                Malaysian Ringgit
              </span>
            </button>
          </div>
        </div>

        {/* Transfer Amount Card */}
        <div className="bg-white rounded-[16px] p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)] mb-3">
          <label className="text-[13px] text-[#475569] font-medium block mb-2">
            {t.transferAmount}
          </label>
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <span className="text-[20px] font-extrabold text-[#111827]">
              {currentUnit}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t.placeholderAmount}
              className="flex-1 bg-transparent text-[16px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[12.5px] text-[#64748b]">
              {t.availableAmount}: {currentUnit}
              {currentAvailable.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={handleAll}
              className="text-[12.5px] font-semibold text-[#2563eb] hover:underline cursor-pointer border-0 bg-transparent p-0"
            >
              {t.all}
            </button>
          </div>
        </div>

        {/* Current Rate */}
        <div className="bg-white rounded-[14px] px-4 py-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] flex items-center justify-between mb-6">
          <span className="text-[13px] text-[#64748b]">{t.currentRate}</span>
          <span className="text-[14px] font-bold text-[#2563eb]">
            1 USDT = RM4.07
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-full bg-[#2563eb] text-white text-[16px] font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:bg-[#1d4ed8] active:scale-[0.98] transition-all cursor-pointer border-0"
        >
          {t.btnConfirm}
        </button>
      </div>
    </div>
  );
}

export default function SpotlineTransferPage() {
  return (
    <I18nProvider>
      <SpotlineTransferContent />
    </I18nProvider>
  );
}
