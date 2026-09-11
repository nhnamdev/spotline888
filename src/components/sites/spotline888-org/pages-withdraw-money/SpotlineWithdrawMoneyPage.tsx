"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, CheckCircle2, Loader2, CreditCard, Wallet, ExternalLink } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { WITHDRAW_TRANSLATIONS } from "./withdrawMoneyI18n";
import { authApi, withdrawApi } from "@/lib/api";

function SpotlineWithdrawContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t = WITHDRAW_TRANSLATIONS[currentLang] || WITHDRAW_TRANSLATIONS["zh-CN"];

  const [currency] = useState("USDT");
  const [withdrawType, setWithdrawType] = useState<"usdt-trc20" | "usdt-erc20" | "bank_card">("usdt-trc20");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(2429.0);
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    // 1. Tải cache local nếu có
    try {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const bal = parseFloat(parsed.usdt_money ?? parsed.money ?? "0");
        if (!isNaN(bal) && bal > 0) {
          setAvailableBalance(bal);
        }
      }
      const savedWallet = localStorage.getItem("saved_usdt_wallet");
      if (savedWallet) {
        setWalletAddress(savedWallet);
      }
    } catch {}

    // 2. Tải số dư thực tế từ API
    async function loadLiveProfile() {
      try {
        const res = await authApi.getProfile();
        if (res.code === 1 && res.data) {
          const bal = parseFloat(res.data.usdt ?? res.data.money ?? "0");
          if (!isNaN(bal)) {
            setAvailableBalance(bal);
          }
        }
      } catch {}
    }
    loadLiveProfile();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleAll = () => {
    setAmount(availableBalance.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      const res = await withdrawApi.submitWithdraw({
        money: num,
        password: password.trim(),
        withdraw_type: "usdt",
        wallet_address:
          walletAddress ||
          (withdrawType === "usdt-trc20"
            ? "TR7NHqjeE...K9tVv69"
            : "0xdAC17F...44Cd28"),
        bank_name:
          withdrawType === "usdt-trc20"
            ? "USDT (TRC20)"
            : withdrawType === "usdt-erc20"
            ? "USDT (ERC20)"
            : "Bank",
      } as any);

      if (res.code === 1) {
        const newBal = Math.max(0, Number((availableBalance - num).toFixed(2)));
        setAvailableBalance(newBal);
        try {
          const stored = localStorage.getItem("userInfo");
          if (stored) {
            const u = JSON.parse(stored);
            u.money = newBal.toFixed(2);
            u.usdt_money = newBal.toFixed(2);
            localStorage.setItem("userInfo", JSON.stringify(u));
          }
        } catch {}
        setShowSuccessModal(true);
      } else {
        showToast(res.msg || t.invalidPassword);
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi gửi yêu cầu rút tiền");
    } finally {
      setLoading(false);
    }
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
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3.5 h-[46px] flex items-center justify-between">
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
            <div className="flex flex-wrap gap-2">
              {/* Option 1: USDT-TRC20 */}
              <button
                type="button"
                onClick={() => setWithdrawType("usdt-trc20")}
                className={`inline-flex items-center gap-2 text-[13.5px] font-semibold px-3.5 py-2 rounded-[8px] border transition-all cursor-pointer ${
                  withdrawType === "usdt-trc20"
                    ? "border-[#3b82f6] bg-[#eff6ff] text-[#2563eb]"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    withdrawType === "usdt-trc20"
                      ? "border-[#3b82f6]"
                      : "border-gray-300"
                  }`}
                >
                  {withdrawType === "usdt-trc20" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  )}
                </div>
                <span>{t.usdtTrc20}</span>
              </button>

              {/* Option 2: USDT-ERC20 */}
              <button
                type="button"
                onClick={() => setWithdrawType("usdt-erc20")}
                className={`inline-flex items-center gap-2 text-[13.5px] font-semibold px-3.5 py-2 rounded-[8px] border transition-all cursor-pointer ${
                  withdrawType === "usdt-erc20"
                    ? "border-[#3b82f6] bg-[#eff6ff] text-[#2563eb]"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    withdrawType === "usdt-erc20"
                      ? "border-[#3b82f6]"
                      : "border-gray-300"
                  }`}
                >
                  {withdrawType === "usdt-erc20" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  )}
                </div>
                <span>{t.usdtErc20}</span>
              </button>

              {/* Option 3: Bank Card */}
              <button
                type="button"
                onClick={() => setWithdrawType("bank_card")}
                className={`inline-flex items-center gap-2 text-[13.5px] font-semibold px-3.5 py-2 rounded-[8px] border transition-all cursor-pointer ${
                  withdrawType === "bank_card"
                    ? "border-[#3b82f6] bg-[#eff6ff] text-[#2563eb]"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    withdrawType === "bank_card"
                      ? "border-[#3b82f6]"
                      : "border-gray-300"
                  }`}
                >
                  {withdrawType === "bank_card" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  )}
                </div>
                <span>{t.bankCard}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Thông tin nhận tiền */}
          <div className="bg-white rounded-[14px] p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13.5px] font-semibold text-[#111827]">
                {withdrawType === "bank_card" ? t.bankInfo : t.walletInfo}
              </span>
              <button
                type="button"
                onClick={() => router.push("/pages/account/account")}
                className="text-[12px] text-[#2563eb] font-medium flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                <span>{t.bindWalletPrompt}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {withdrawType === "bank_card" ? (
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
            ) : (
              <div className="flex items-center gap-2.5 bg-[#f8fafc] border border-gray-200/80 rounded-[10px] p-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4 text-[#2563eb]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11.5px] text-[#9ca3af]">
                    {withdrawType === "usdt-trc20"
                      ? `${t.walletAddress} (TRC20)`
                      : `${t.walletAddress} (ERC20)`}
                  </span>
                  <span className="text-[13px] font-semibold text-[#1e293b] truncate font-mono">
                    {walletAddress ||
                      (withdrawType === "usdt-trc20"
                        ? "TR7NHqjeE...K9tVv69"
                        : "0xdAC17F...44Cd28")}
                  </span>
                </div>
              </div>
            )}
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
              <span className="text-[20px] font-extrabold text-[#111827]">USDT</span>
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
                  {availableBalance.toFixed(2)} USDT
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
