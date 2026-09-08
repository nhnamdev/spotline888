"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { WITHDRAW_TRANSLATIONS } from "./withdrawMoneyI18n";

function SpotlineWithdrawContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t = WITHDRAW_TRANSLATIONS[currentLang] || WITHDRAW_TRANSLATIONS["zh-CN"];

  const [currency] = useState("MYR");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const availableBalance = 2429.0;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleAll = () => {
    setAmount(availableBalance.toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || num > availableBalance) {
      showToast(t.invalidAmount);
      return;
    }
    if (!password.trim()) {
      showToast(t.invalidPassword);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ff] via-[#f8fafc_40%] to-white flex justify-center select-none pb-10">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-4 pb-3">
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
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] px-4 py-2.5 bg-black/75 backdrop-blur-sm text-white text-[14px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
            {toastMsg}
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-[320px] p-6 text-center shadow-xl transform transition-all animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-[17px] font-bold text-[#111827] mb-1">
                {t.withdrawSuccess}
              </h3>
              <p className="text-[13px] text-[#6b7280] mb-5">
                {t.withdrawSuccessMsg}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/");
                }}
                className="w-full h-10 bg-[#3b82f6] text-white font-semibold rounded-xl text-[14px] active:scale-98 transition-transform cursor-pointer border-0"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
          {/* Card 1: Chọn cách thức rút tiền */}
          <div className="bg-white rounded-[14px] p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <span className="text-[13px] text-[#4b5563] font-medium block mb-2">
              {t.selectMethod}
            </span>
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3.5 h-[46px] flex items-center justify-between cursor-pointer">
              <span className="text-[15px] font-bold text-[#111827]">
                {currency}
              </span>
              <ChevronDown className="w-4 h-4 text-[#6b7280]" />
            </div>
          </div>

          {/* Card 2: Chọn loại rút tiền */}
          <div className="bg-white rounded-[14px] p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <span className="text-[13px] text-[#4b5563] font-medium block mb-2">
              {t.selectType}
            </span>
            <div className="inline-flex items-center gap-2 border border-[#3b82f6] bg-[#eff6ff] text-[#2563eb] font-semibold text-[14px] px-3.5 py-2 rounded-[8px]">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#3b82f6] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              </div>
              <span>{t.bankCard}</span>
            </div>
          </div>

          {/* Card 3: Thông tin ngân hàng */}
          <div className="bg-white rounded-[14px] p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <span className="text-[13.5px] font-semibold text-[#111827] block mb-3">
              {t.bankInfo}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[11.5px] text-[#9ca3af] block mb-1">
                  {t.name}
                </span>
                <span className="text-[13px] font-bold text-[#111827] break-words">
                  粉***
                </span>
              </div>
              <div>
                <span className="text-[11.5px] text-[#9ca3af] block mb-1">
                  {t.cardNumber}
                </span>
                <span className="text-[13px] font-bold text-[#111827] break-all">
                  发多少***********发多少
                </span>
              </div>
              <div>
                <span className="text-[11.5px] text-[#9ca3af] block mb-1">
                  {t.bankName}
                </span>
                <span className="text-[13px] font-bold text-[#111827] break-words">
                  的粉
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Số tiền rút */}
          <div className="bg-white rounded-[14px] p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-[#4b5563] font-medium">
                {t.withdrawAmount}
              </span>
              <button
                type="button"
                onClick={handleAll}
                className="text-[13px] text-[#3b82f6] font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                {t.all}
              </button>
            </div>
            <div className="flex items-baseline gap-2 border-b border-[#f3f4f6] pb-2 mb-2">
              <span className="text-[20px] font-extrabold text-[#111827]">RM</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-[24px] font-bold text-[#111827] outline-none bg-transparent placeholder:text-[#cbd5e1]"
              />
            </div>
            <div className="flex items-center justify-between text-[12px] text-[#9ca3af]">
              <span>
                {t.availableBalance}:{" "}
                <strong className="text-[#3b82f6] font-semibold">
                  RM{availableBalance.toFixed(2)}
                </strong>
              </span>
              <span>{t.fee}: 0%</span>
            </div>
          </div>

          {/* Card 5: Mật khẩu rút tiền */}
          <div className="bg-white rounded-[14px] p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <span className="text-[13px] text-[#4b5563] font-medium block mb-2">
              {t.withdrawPassword}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.withdrawPasswordPlaceholder}
              className="w-full h-[46px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3.5 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:bg-white transition-all placeholder:text-[#c4c9d4]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !amount || !password}
            className={`w-full mt-2 h-[48px] rounded-[10px] text-[16px] font-bold text-white flex items-center justify-center transition-all cursor-pointer border-0 ${
              amount && password && !loading
                ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] shadow-[0_4px_12px_rgba(37,99,235,0.35)] active:scale-98"
                : "bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] shadow-none cursor-not-allowed opacity-80"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              t.confirmWithdraw
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SpotlineWithdrawMoneyPage() {
  return (
    <I18nProvider>
      <SpotlineWithdrawContent />
    </I18nProvider>
  );
}
