"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { ACCOUNT_TRANSLATIONS } from "./accountI18n";
import { bankApi } from "@/lib/api";

function SpotlineAccountDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLang } = useI18n();
  const t =
    ACCOUNT_TRANSLATIONS[currentLang] || ACCOUNT_TRANSLATIONS["zh-CN"];

  const payType = searchParams.get("pay_type") || "bank_card";
  const isBank = payType === "bank_card";
  const title = isBank
    ? t.bankCard
    : payType === "usdt-erc20"
    ? t.usdtErc20
    : t.usdtTrc20;

  // State for bank and wallet
  const [holderName, setHolderName] = useState("");
  const [nationality, setNationality] = useState("Vietnam");
  const [bankBranch, setBankBranch] = useState("");
  const [bankName, setBankName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccount() {
      try {
        const res = await bankApi.getBanks();
        if (res.code === 1 && Array.isArray(res.data)) {
          if (isBank) {
            const bankItem = res.data.find((b: any) => b.type === "bank");
            if (bankItem) {
              setHolderName(bankItem.account_holder || "");
              setNationality(bankItem.nationality || "Vietnam");
              setBankBranch(bankItem.bank_branch || "");
              setBankName(bankItem.bank_name || "");
              setCardNumber(bankItem.card_number || "");
            }
          } else {
            const targetType = payType === "usdt-erc20" ? "usdt_erc20" : "usdt_trc20";
            const walletItem = res.data.find(
              (b: any) =>
                b.type === targetType ||
                (b.type === "usdt" && String(b.bank_name).toLowerCase().includes(payType === "usdt-erc20" ? "erc20" : "trc20"))
            );
            if (walletItem) {
              setWalletAddr(walletItem.card_number || "");
            }
          }
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin tài khoản:", err);
      }
    }
    fetchAccount();
  }, [isBank, payType]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleSaveBank = async () => {
    if (!holderName.trim()) {
      showToast(t.name);
      return;
    }
    if (!bankName.trim()) {
      showToast(t.bankName);
      return;
    }
    if (!cardNumber.trim()) {
      showToast(t.cardNumber);
      return;
    }

    try {
      setSaving(true);
      const res = await bankApi.bindBank({
        accountHolder: holderName.trim(),
        nationality: nationality.trim(),
        bankBranch: bankBranch.trim(),
        bankName: bankName.trim(),
        bankCard: cardNumber.trim(),
        type: "bank",
      });

      if (res.code === 1) {
        showToast(t.saveSuccess);
        setTimeout(() => {
          router.back();
        }, 800);
      } else {
        showToast(res.msg || "Liên kết tài khoản thất bại");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi lưu tài khoản");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWallet = async () => {
    if (!walletAddr.trim()) {
      showToast(t.placeholderWallet);
      return;
    }
    try {
      setSaving(true);
      localStorage.setItem("saved_usdt_wallet", walletAddr.trim());
      const res = await bankApi.bindBank({
        bankName: payType === "usdt-erc20" ? "USDT (ERC20)" : "USDT (TRC20)",
        bankCard: walletAddr.trim(),
        type: payType === "usdt-erc20" ? "usdt_erc20" : "usdt_trc20",
      });

      if (res.code === 1) {
        showToast(t.saveSuccess);
        setTimeout(() => {
          router.back();
        }, 800);
      } else {
        showToast(res.msg || "Lưu địa chỉ ví thất bại");
      }
    } catch (err: any) {
      showToast(err?.message || "Lỗi lưu địa chỉ ví");
    } finally {
      setSaving(false);
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
          <h1 className="text-[18px] font-bold text-[#111827]">{title}</h1>
          <div className="w-9 h-9" />
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3000] px-4 py-2.5 bg-black/80 backdrop-blur-sm text-white text-[13.5px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
            {toastMsg}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] flex flex-col gap-4">
          {isBank ? (
            <>
              {/* Full Name */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.name}
                </label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder={t.name}
                  className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.nationality}
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder={t.nationality}
                  className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Bank Address */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5 leading-snug">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.bankAddress}
                </label>
                <input
                  type="text"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                  placeholder={t.bankAddress}
                  className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.bankName}
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder={t.bankName}
                  className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-medium focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.cardNumber}
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder={t.cardNumber}
                  className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] font-mono font-medium focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveBank}
                className="w-full py-3 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[15px] font-semibold transition-all mt-2 cursor-pointer border-0 shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? "..." : t.btnSave}
              </button>
            </>
          ) : (
            <>
              {/* Crypto Wallet Address */}
              <div>
                <label className="text-[13px] font-medium text-[#1e293b] block mb-1.5 leading-snug">
                  <span className="text-[#ef4444] mr-0.5">*</span>
                  {t.walletAddress}
                </label>
                <input
                  type="text"
                  value={walletAddr}
                  onChange={(e) => setWalletAddr(e.target.value)}
                  placeholder={t.placeholderWallet}
                  className="w-full bg-[#f8fafc] border border-gray-200/80 rounded-[10px] px-3.5 py-2.5 text-[14px] text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveWallet}
                className="w-full py-3 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[15px] font-semibold transition-all mt-2 cursor-pointer border-0 shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? "..." : t.btnSave}
              </button>
            </>
          )}

          {/* Contact Service notice card */}
          <div
            onClick={() =>
              router.push("/pages/customer-service/customer-service")
            }
            className="w-full mt-2 p-3 rounded-[10px] bg-[#eef2ff] border-l-4 border-[#4f46e5] flex items-center justify-between cursor-pointer active:opacity-80 transition-opacity"
          >
            <span className="text-[13px] text-[#4338ca] font-normal">
              {t.contactServiceToChange}
            </span>
            <ChevronRight className="w-4 h-4 text-[#4338ca]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpotlineAccountDetailPage() {
  return (
    <I18nProvider>
      <Suspense
        fallback={<div className="min-h-screen bg-gradient-to-b from-[#eef2ff]" />}
      >
        <SpotlineAccountDetailInner />
      </Suspense>
    </I18nProvider>
  );
}
