"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useI18n, I18nProvider, LanguageCode } from "../pages-login-login/i18n";
import { USER_TRANSLATIONS, UserTranslations } from "./userI18n";
import { INDEX_TRANSLATIONS } from "../pages-index-index/indexI18n";
import { IndexTabBar } from "../pages-index-index/IndexTabBar";
import { USER_ICONS } from "./userIcons";
import "./SpotlineUserPage.css";

interface UserInfoData {
  username: string;
  real_name: string;
  credit_score: number | string;
  money: string;
  usdt_money: string;
  yk: string;
  yk_today: string;
  user_avatar?: string;
  is_auth: number; // 0: unverified, 1: verified, -1: auth error
  id_auth_error?: string;
}

interface YuebaoData {
  all_money: string;
  today_income?: string;
  total_income?: string;
}

function SpotlineUserPageContent() {
  const { currentLang } = useI18n();
  const [activeLang, setActiveLang] = useState<LanguageCode>(currentLang);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("i18nLang") as LanguageCode | null;
      if (saved && USER_TRANSLATIONS[saved]) {
        setActiveLang(saved);
      } else {
        setActiveLang(currentLang);
      }
    } catch {
      setActiveLang(currentLang);
    }
  }, [currentLang]);

  const t: UserTranslations =
    USER_TRANSLATIONS[activeLang] || USER_TRANSLATIONS["zh-CN"];
  const indexT =
    INDEX_TRANSLATIONS[activeLang] || INDEX_TRANSLATIONS["zh-CN"];

  const [userInfo, setUserInfo] = useState<UserInfoData>({
    username: "user888",
    real_name: "Nguyen Van A",
    credit_score: 100,
    money: "0.00",
    usdt_money: "0.00",
    yk: "0.00",
    yk_today: "0.00",
    user_avatar: USER_ICONS.avatar,
    is_auth: 0,
    id_auth_error: "",
  });

  const [yuebaoData, setYuebaoData] = useState<YuebaoData>({
    all_money: "0.00",
    today_income: "0.00",
    total_income: "0.00",
  });

  const [currencyIcon, setCurrencyIcon] = useState<string>(USER_ICONS.cny);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // Helper to show toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  // Load user data on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserInfo((prev) => ({
          ...prev,
          ...parsed,
          username: parsed.username || prev.username,
          real_name: parsed.real_name || prev.real_name,
          credit_score: parsed.credit_score ?? prev.credit_score,
          money: parsed.money ?? prev.money,
          usdt_money: parsed.usdt_money ?? prev.usdt_money,
          yk: parsed.yk ?? prev.yk,
          yk_today: parsed.yk_today ?? prev.yk_today,
          user_avatar: parsed.user_avatar || prev.user_avatar,
          is_auth: parsed.is_auth ?? prev.is_auth,
        }));
      }

      const storedYuebao = localStorage.getItem("yuebaoData");
      if (storedYuebao) {
        setYuebaoData(JSON.parse(storedYuebao));
      }

      const siteConfig = localStorage.getItem("siteCurrencyConfig");
      if (siteConfig) {
        const parsedCfg = JSON.parse(siteConfig);
        if (parsedCfg.currency_icon) {
          setCurrencyIcon(parsedCfg.currency_icon);
        }
      }
    } catch {
      // ignore JSON errors
    }
  }, []);

  // Compute total assets: userInfo.money + yuebaoData.all_money
  const totalAssets = (
    parseFloat(userInfo.money || "0") + parseFloat(yuebaoData.all_money || "0")
  ).toFixed(2);

  // Masked real name: first character + asterisks
  const maskedRealName = userInfo.real_name
    ? userInfo.real_name.substring(0, 1) +
      "*".repeat(Math.max(1, userInfo.real_name.length - 1))
    : "***";

  // Handle avatar upload / change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setAvatarPreview(result);
      setUserInfo((prev) => {
        const updated = { ...prev, user_avatar: result };
        try {
          localStorage.setItem("userInfo", JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
      showToast(t.copySuccess ? "Cập nhật ảnh đại diện thành công" : "Success");
    };
    reader.readAsDataURL(file);
  };

  // Copy text to clipboard
  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(t.copySuccess);
    } else {
      showToast(t.copySuccess);
    }
  };

  // Logout action
  const handleLogout = () => {
    setShowLogoutModal(false);
    showToast(t.logoutLoading);

    setTimeout(() => {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("bannerList");
        localStorage.removeItem("bannerPreloadTime");
      } catch {
        // ignore
      }
      showToast(t.logoutSuccess);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/login/login";
        }
      }, 800);
    }, 600);
  };

  // Quick List definitions
  const quickList = [
    {
      title: t.quickTransfer,
      icon: USER_ICONS.transfer,
      rotate45: true,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/transfer/account-transfer";
        }
      },
    },
    {
      title: t.onlineService,
      icon: USER_ICONS.service,
      rotate45: false,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/customer-service/customer-service";
        }
      },
    },
  ];

  // Setting List definitions
  const settingList = [
    {
      title: t.identityVerify,
      icon: USER_ICONS.verify,
      tag:
        userInfo.is_auth === 0
          ? t.unverified
          : userInfo.is_auth === -1
          ? userInfo.id_auth_error || "Lỗi xác thực"
          : null,
      isAuthTag: true,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/verify/verify";
        }
      },
    },
    {
      title: t.orderRecords,
      icon: USER_ICONS.order,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/order/order";
        }
      },
    },
    {
      title: t.depositDetails,
      icon: USER_ICONS.depositDetail,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/withdraw-list/withdraw-open";
        }
      },
    },
    {
      title: t.withdrawDetails,
      icon: USER_ICONS.withdrawDetail,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/withdraw-list/withdraw-list";
        }
      },
    },
    {
      title: t.fundRecords,
      icon: USER_ICONS.fundRecord,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/money-record/money-record";
        }
      },
    },
    {
      title: t.withdrawalAccount,
      icon: USER_ICONS.account,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/account/account";
        }
      },
    },
    {
      title: t.settings,
      icon: USER_ICONS.settings,
      onClick: () => {
        if (typeof window !== "undefined") {
          window.location.hash = "#/pages/set/set";
        }
      },
    },
    {
      title: t.logout,
      icon: USER_ICONS.logout,
      onClick: () => {
        setShowLogoutModal(true);
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center">
      <div className="spotline-user-page">
        {/* Hidden avatar file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {/* 1. Header with User Profile */}
        <div className="tui-header">
          <div className="tui-userInfo">
            {/* Avatar Wrap */}
            <div
              className="tui-avatar-wrap"
              onClick={() => fileInputRef.current?.click()}
              title="Change Avatar"
            >
              <img
                className="tui-avatar"
                src={avatarPreview || userInfo.user_avatar || USER_ICONS.avatar}
                alt="Avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = USER_ICONS.avatar;
                }}
              />
              <div className="tui-avatar-edit">
                <span className="tui-avatar-edit-icon">✎</span>
              </div>
            </div>

            {/* User Meta Information */}
            <div
              style={{
                flex: 1,
                marginLeft: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Username with Copy on Click */}
              <div
                className="name cursor-pointer active:opacity-75"
                onClick={() => handleCopy(userInfo.username)}
                title="Nhấp để sao chép"
              >
                {userInfo.username}
              </div>

              {/* Real Name & VIP Badge */}
              <div className="desc">
                <div className="rellname">{maskedRealName}</div>
                <div className="tui-vip">
                  <img src={USER_ICONS.vip} alt="VIP" />
                  <div>{t.standardUser}</div>
                </div>
              </div>

              {/* Credit Score Badge */}
              <div className="tui-credit">
                <img src={USER_ICONS.xinyong} alt="Credit" />
                <div>
                  {t.creditScore}:{userInfo.credit_score}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Money Card */}
          <div className="tui-money">
            <div className="normal">
              {/* Top Block: Total Assets */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="text-xs">
                  {t.totalAssets}({t.currencyCode})
                </div>
                <div className="pice">
                  <span className="unit">{t.currencySymbol}</span>
                  {totalAssets}
                </div>
                <div className="mt-sm">
                  <span>≈</span>
                  <div className="unit">{userInfo.usdt_money}USDT</div>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Bottom 3 Columns */}
              <div className="flex-content">
                {/* Col 1: Yu'ebao Total */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="all-size" style={{ whiteSpace: "nowrap" }}>
                    {t.yuebaoTotal}
                  </div>
                  <div className="big-size">
                    {yuebaoData.all_money || "0.00"}
                  </div>
                </div>

                {/* Col 2: Account P&L */}
                <div
                  style={{
                    flex: 1,
                    margin: "0 10px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="all-size">{t.accountPL}</div>
                  <div className="big-size">{userInfo.yk || "0.00"}</div>
                </div>

                {/* Col 3: Today's P&L */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="all-size">{t.todayPL}</div>
                  <div className="big-size">{userInfo.yk_today || "0.00"}</div>
                </div>
              </div>

              {/* Currency Position Flag/Icon on top right */}
              <div className="tui-position">
                <img
                  src={currencyIcon || USER_ICONS.cny}
                  alt={t.currencyCode}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = USER_ICONS.cny;
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3. Spend Money Row (3 cards) */}
          <div className="tui-spendMoney">
            {/* Available Balance */}
            <div className="tui-spendMoneyItem">
              <div className="cny">
                {t.availableBalance}
                {t.currencySymbol}
              </div>
              <div className="pice">
                {t.currencySymbol}
                {userInfo.money}
              </div>
            </div>

            {/* Deposit / Rujin */}
            <div
              className="tui-rightItem"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.hash =
                    "#/pages/customer-service/customer-service";
                }
              }}
            >
              <img src={USER_ICONS.rujin} alt={t.deposit} />
              <div className="text">{t.deposit}</div>
            </div>

            {/* Withdraw / Chujin */}
            <div
              className="tui-rightItem"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.hash = "#/pages/money/money";
                }
              }}
            >
              <img src={USER_ICONS.chujin} alt={t.withdraw} />
              <div className="text">{t.withdraw}</div>
            </div>
          </div>

          {/* 4. Quick Actions List */}
          <div className="tui-quick-list">
            {quickList.map((item, n) => (
              <div
                key={n}
                className="tui-listItem"
                onClick={item.onClick}
              >
                <div className="flex-item">
                  <img
                    className={`logo ${item.rotate45 ? "rotate-45" : ""}`}
                    src={item.icon}
                    alt={item.title}
                  />
                  <div className="title">{item.title}</div>
                </div>
                <img
                  className="tui-rightIcon"
                  src={USER_ICONS.arrowRight}
                  alt=">"
                />
              </div>
            ))}
          </div>

          {/* 5. Setting List */}
          <div className="tui-list">
            {settingList.map((item, n) => (
              <div
                key={n}
                className="tui-listItem"
                onClick={item.onClick}
              >
                <div className="flex-item">
                  <img className="logo" src={item.icon} alt={item.title} />
                  <div className="title">{item.title}</div>
                </div>

                {item.tag && (
                  <span
                    className={
                      userInfo.is_auth === -1
                        ? "auth-error-tag"
                        : "unverified-tag"
                    }
                  >
                    {item.tag}
                  </span>
                )}

                <img
                  className="tui-rightIcon"
                  src={USER_ICONS.arrowRight}
                  alt=">"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Bottom Tab Bar with activeTab="mine" */}
        <IndexTabBar
          t={indexT}
          activeTab="mine"
          onTabChange={(tab) => {
            const targetHash =
              tab === "products"
                ? "#/pages/product/product"
                : tab === "balance"
                ? "#/pages/money/money"
                : tab === "mine"
                ? "#/pages/user/user"
                : "#/pages/index/index";

            if (typeof window !== "undefined") {
              if (
                window.location.pathname === "/" ||
                window.location.pathname === ""
              ) {
                window.location.hash = targetHash;
              } else {
                window.location.href = "/" + targetHash;
              }
            }
          }}
        />

        {/* Modal: Logout Confirmation matching Uni-App Style */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-[999999] bg-black/45 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-[16px] w-full max-w-[300px] overflow-hidden shadow-2xl animate-scale-up">
              <div className="pt-6 pb-4 px-6 text-center">
                <div className="text-[17px] font-bold text-[#222]">
                  {t.logoutConfirmTitle}
                </div>
                <div className="text-[14px] text-[#666] mt-2 leading-relaxed">
                  {t.logoutConfirmContent}
                </div>
              </div>
              <div className="flex border-t border-gray-200">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 text-[15px] font-medium text-[#222] border-r border-gray-200 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 text-[15px] font-medium text-[#222] active:bg-gray-100 transition-colors cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[999999] bg-black/80 backdrop-blur-sm text-white px-4 py-2.5 rounded-full text-[13px] shadow-lg flex items-center gap-2 pointer-events-none transition-all duration-200">
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpotlineUserPage() {
  return (
    <I18nProvider>
      <SpotlineUserPageContent />
    </I18nProvider>
  );
}
