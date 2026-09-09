"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./registerI18n";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const RegisterForm: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [tradePassword, setTradePassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showTradePassword, setShowTradePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isFormValid =
    phone.trim().length > 0 &&
    account.trim().length > 0 &&
    password.trim().length > 0 &&
    tradePassword.trim().length > 0 &&
    inviteCode.trim().length > 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\s+/g, ""));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(e.target.value.replace(/\s+/g, ""));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.replace(/\s+/g, ""));
  };

  const handleTradePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTradePassword(e.target.value.replace(/\s+/g, ""));
  };

  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value.replace(/\s+/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || loading) {
      if (!isFormValid) {
        showToast(t.pleaseEnterAll);
      }
      return;
    }

    if (phone.trim().length > 11) {
      showToast(t.phoneInvalid);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone.trim(),
          account: account.trim(),
          passwd: password.trim(),
          mpasswd: tradePassword.trim(),
          invitecode: inviteCode.trim(),
        }),
      });

      const resData = await response.json().catch(() => null);

      if (resData && resData.code === 1) {
        setShowSuccessModal(true);
      } else if (resData && resData.msg) {
        showToast(resData.msg);
      } else {
        showToast(t.networkError || "Đăng ký thất bại");
      }
    } catch {
      showToast(t.networkError || "Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSuccess = () => {
    setShowSuccessModal(false);
    router.push("/login");
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] px-4 py-2.5 bg-black/75 backdrop-blur-sm text-white text-[14px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
          {toastMessage}
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[320px] p-6 text-center shadow-xl transform transition-all animate-in zoom-in-95">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-[#111827] mb-1">
              {t.registerSuccessTitle}
            </h3>
            <p className="text-[13.5px] text-[#6b7280] mb-5">
              {t.registerSuccessMsg}
            </p>
            <button
              type="button"
              onClick={handleConfirmSuccess}
              className="w-full h-11 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white font-semibold rounded-xl text-[15px] shadow-[0_4px_12px_rgba(37,99,235,0.3)] active:scale-98 transition-transform cursor-pointer border-0"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}

      {/* Register Form Card */}
      <form
        onSubmit={handleSubmit}
        className="mx-4 mt-4 bg-white rounded-[14px] p-4.5 pb-5 shadow-[0_4px_20px_rgba(15,23,42,0.07)]"
      >
        {/* Field 1: Phone Number */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[#6b7280] font-semibold mb-1.5 pl-0.5 block">
            {t.phoneLabel}
          </label>
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3 h-[48px] flex items-center transition-all focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20 focus-within:bg-white">
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder={t.phonePlaceholder}
              maxLength={11}
              className="h-full text-[14px] text-[#111827] bg-transparent outline-none flex-1 placeholder:text-[#c4c9d4] placeholder:text-[13.5px]"
            />
          </div>
        </div>

        {/* Field 2: Account */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[#6b7280] font-semibold mb-1.5 pl-0.5 block">
            {t.accountLabel}
          </label>
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3 h-[48px] flex items-center transition-all focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20 focus-within:bg-white">
            <input
              type="text"
              value={account}
              onChange={handleAccountChange}
              placeholder={t.accountPlaceholder}
              className="h-full text-[14px] text-[#111827] bg-transparent outline-none flex-1 placeholder:text-[#c4c9d4] placeholder:text-[13.5px]"
            />
          </div>
        </div>

        {/* Field 3: Password */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[#6b7280] font-semibold mb-1.5 pl-0.5 block">
            {t.passwordLabel}
          </label>
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3 h-[48px] flex items-center transition-all focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20 focus-within:bg-white">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder={t.passwordPlaceholder}
              className="h-full text-[14px] text-[#111827] bg-transparent outline-none flex-1 placeholder:text-[#c4c9d4] placeholder:text-[13.5px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label="Toggle password visibility"
              className="p-1.5 ml-1 text-[#6b7280] hover:text-[#111827] transition-colors cursor-pointer bg-transparent border-0 flex items-center justify-center opacity-60 hover:opacity-100"
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Field 4: Trade Password */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[#6b7280] font-semibold mb-1.5 pl-0.5 block">
            {t.tradePasswordLabel}
          </label>
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3 h-[48px] flex items-center transition-all focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20 focus-within:bg-white">
            <input
              type={showTradePassword ? "text" : "password"}
              value={tradePassword}
              onChange={handleTradePasswordChange}
              placeholder={t.tradePasswordPlaceholder}
              className="h-full text-[14px] text-[#111827] bg-transparent outline-none flex-1 placeholder:text-[#c4c9d4] placeholder:text-[13.5px]"
            />
            <button
              type="button"
              onClick={() => setShowTradePassword(!showTradePassword)}
              tabIndex={-1}
              aria-label="Toggle trade password visibility"
              className="p-1.5 ml-1 text-[#6b7280] hover:text-[#111827] transition-colors cursor-pointer bg-transparent border-0 flex items-center justify-center opacity-60 hover:opacity-100"
            >
              {showTradePassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Field 5: Invite Code (开户码) */}
        <div className="mb-3.5">
          <label className="text-[12px] text-[#6b7280] font-semibold mb-1.5 pl-0.5 block">
            {t.inviteCodeLabel}
          </label>
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3 h-[48px] flex items-center transition-all focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20 focus-within:bg-white">
            <input
              type="text"
              value={inviteCode}
              onChange={handleInviteCodeChange}
              placeholder={t.inviteCodePlaceholder}
              className="h-full text-[14px] text-[#111827] bg-transparent outline-none flex-1 placeholder:text-[#c4c9d4] placeholder:text-[13.5px]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full mt-5 h-[48px] rounded-[10px] flex items-center justify-center text-[16px] font-bold text-white tracking-[0.5px] transition-all cursor-pointer border-0 ${
            isFormValid && !loading
              ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] shadow-[0_4px_12px_rgba(37,99,235,0.35)] active:scale-[0.98]"
              : "bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] shadow-none cursor-not-allowed opacity-85"
          }`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t.registerBtn
          )}
        </button>
      </form>
    </div>
  );
};
