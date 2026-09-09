"use client";

import React, { useState } from "react";
import { useI18n } from "./i18n";

export const LoginForm: React.FC = () => {
  const { t } = useI18n();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isFormValid = account.trim().length > 0 && password.trim().length > 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Uni-app behavior: strip whitespace
    setAccount(e.target.value.replace(/\s+/g, ""));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.replace(/\s+/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || loading) {
      if (!isFormValid) {
        showToast(t.pleaseEnterAll);
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: account.trim(),
          password: password.trim(),
        }),
      });

      const resData = await response.json().catch(() => null);

      if (resData && resData.code === 1) {
        if (typeof window !== "undefined" && resData.data) {
          const authToken = resData.data.token;
          if (authToken) {
            localStorage.setItem("user_token", authToken);
            localStorage.setItem("token", authToken);
            document.cookie = `user_token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
          }
          localStorage.setItem("user_info", JSON.stringify(resData.data));
          localStorage.setItem("userInfo", JSON.stringify(resData.data));
        }
        showToast(resData.msg || t.loginSuccess);
        setTimeout(() => {
          window.location.href = "/";
        }, 600);
      } else if (resData && resData.msg) {
        showToast(resData.msg);
      } else {
        showToast(t.loginFailed);
      }
    } catch {
      showToast(t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] px-4 py-2.5 bg-black/75 backdrop-blur-sm text-white text-[14px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
          {toastMessage}
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="mx-4 mt-6 bg-white rounded-[14px] px-4 pt-5 pb-[22px] shadow-[0_4px_20px_rgba(15,23,42,0.07)]"
      >
        {/* Account Field */}
        <div className="mb-4">
          <label className="block text-[12px] text-[#6b7280] font-semibold mb-1.5 pl-0.5">
            {t.accountLabel}
          </label>
          <div className="flex items-center bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3 h-[50px] transition-all duration-200 focus-within:border-[#3b82f6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3b82f6]/10">
            <input
              type="text"
              autoComplete="username"
              value={account}
              onChange={handleAccountChange}
              placeholder={t.accountPlaceholder}
              className="flex-1 h-[50px] text-[15px] text-[#111827] bg-transparent outline-none border-none placeholder:text-[#c4c9d4] placeholder:text-[14px]"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-[12px] text-[#6b7280] font-semibold mb-1.5 pl-0.5">
            {t.passwordLabel}
          </label>
          <div className="flex items-center bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-3 h-[50px] transition-all duration-200 focus-within:border-[#3b82f6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3b82f6]/10">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder={t.passwordPlaceholder}
              className="flex-1 h-[50px] text-[15px] text-[#111827] bg-transparent outline-none border-none placeholder:text-[#c4c9d4] placeholder:text-[14px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="p-1.5 ml-1 cursor-pointer border-0 bg-transparent flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <span className="text-[14px] opacity-50 select-none leading-none">
                {showPassword ? "👁" : "👁‍🗨"}
              </span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full mt-5 h-[50px] rounded-[10px] flex items-center justify-center text-[17px] font-bold text-white tracking-[2px] transition-all duration-200 border-0 ${
            isFormValid && !loading
              ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] shadow-[0_4px_12px_rgba(37,99,235,0.35)] cursor-pointer active:scale-[0.98] active:opacity-92"
              : "bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] shadow-none cursor-not-allowed"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            t.loginBtn
          )}
        </button>
      </form>
    </div>
  );
};
