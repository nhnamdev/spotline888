"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageCode =
  | "zh-CN"
  | "id-ID"
  | "ms-MY"
  | "hk-TW"
  | "en-US"
  | "ja-JP"
  | "th-TH"
  | "vi-VN"
  | "ko-KR"
  | "fr-FR"
  | "de-DE";

export interface LanguageOption {
  name: string;
  value: LanguageCode;
}

export const LANGUAGES: LanguageOption[] = [
  { name: "简体中文", value: "zh-CN" },
  { name: "Bahasa Indonesia", value: "id-ID" },
  { name: "Bahasa Melayu", value: "ms-MY" },
  { name: "繁體中文", value: "hk-TW" },
  { name: "English", value: "en-US" },
  { name: "日本語", value: "ja-JP" },
  { name: "ภาษาไทย", value: "th-TH" },
  { name: "Tiếng Việt", value: "vi-VN" },
  { name: "한국어", value: "ko-KR" },
  { name: "Français", value: "fr-FR" },
  { name: "Deutsch", value: "de-DE" },
];

export interface TranslationDict {
  title: string;
  accountLabel: string;
  accountPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginBtn: string;
  registerNow: string;
  onlineService: string;
  langSetting: string;
  cancel: string;
  loginSuccess: string;
  loginFailed: string;
  pleaseEnterAll: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  "zh-CN": {
    title: "账号登录",
    accountLabel: "账号",
    accountPlaceholder: "请输入账号",
    passwordLabel: "密码",
    passwordPlaceholder: "请输入密码",
    loginBtn: "登录",
    registerNow: "立即注册",
    onlineService: "在线客服",
    langSetting: "语言设置",
    cancel: "取消",
    loginSuccess: "登录成功",
    loginFailed: "账号或密码错误",
    pleaseEnterAll: "请输入账号和密码",
  },
  "vi-VN": {
    title: "Đăng nhập tài khoản",
    accountLabel: "Tài khoản",
    accountPlaceholder: "Vui lòng nhập tài khoản",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "Vui lòng nhập mật khẩu",
    loginBtn: "Đăng nhập",
    registerNow: "Đăng ký ngay",
    onlineService: "Dịch vụ khách hàng trực tuyến",
    langSetting: "Cài đặt ngôn ngữ",
    cancel: "Hủy",
    loginSuccess: "Đăng nhập thành công",
    loginFailed: "Tài khoản hoặc mật khẩu không đúng",
    pleaseEnterAll: "Vui lòng nhập tài khoản và mật khẩu",
  },
  "en-US": {
    title: "Account Login",
    accountLabel: "Account",
    accountPlaceholder: "Please enter account",
    passwordLabel: "Password",
    passwordPlaceholder: "Please enter password",
    loginBtn: "Login",
    registerNow: "Register Now",
    onlineService: "Online Support",
    langSetting: "Language Settings",
    cancel: "Cancel",
    loginSuccess: "Login successful",
    loginFailed: "Invalid account or password",
    pleaseEnterAll: "Please enter both account and password",
  },
  "hk-TW": {
    title: "帳號登入",
    accountLabel: "帳號",
    accountPlaceholder: "請輸入帳號",
    passwordLabel: "密碼",
    passwordPlaceholder: "請輸入密碼",
    loginBtn: "登入",
    registerNow: "立即註冊",
    onlineService: "線上客服",
    langSetting: "語言設定",
    cancel: "取消",
    loginSuccess: "登入成功",
    loginFailed: "帳號或密碼錯誤",
    pleaseEnterAll: "請輸入帳號和密碼",
  },
  "id-ID": {
    title: "Masuk akun",
    accountLabel: "Akun",
    accountPlaceholder: "Silakan masukkan akun",
    passwordLabel: "Kata Sandi",
    passwordPlaceholder: "Silakan masukkan kata sandi",
    loginBtn: "Login",
    registerNow: "Daftar Sekarang",
    onlineService: "Layanan Online",
    langSetting: "Pengaturan Bahasa",
    cancel: "Batal",
    loginSuccess: "Berhasil masuk",
    loginFailed: "Akun atau kata sandi salah",
    pleaseEnterAll: "Silakan masukkan akun dan kata sandi",
  },
  "ms-MY": {
    title: "Log Masuk Akaun",
    accountLabel: "Akaun",
    accountPlaceholder: "Sila masukkan akaun",
    passwordLabel: "Kata Laluan",
    passwordPlaceholder: "Sila masukkan kata laluan",
    loginBtn: "Log Masuk",
    registerNow: "Daftar sekarang",
    onlineService: "Khidmat Dalam Talian",
    langSetting: "Tetapan Bahasa",
    cancel: "Batal",
    loginSuccess: "Berjaya log masuk",
    loginFailed: "Akaun atau kata laluan tidak sah",
    pleaseEnterAll: "Sila masukkan akaun dan kata laluan",
  },
  "ja-JP": {
    title: "アカウントログイン",
    accountLabel: "アカウント",
    accountPlaceholder: "アカウントを入力してください",
    passwordLabel: "パスワード",
    passwordPlaceholder: "パスワードを入力してください",
    loginBtn: "ログイン",
    registerNow: "今すぐ登録",
    onlineService: "オンラインサービス",
    langSetting: "言語設定",
    cancel: "キャンセル",
    loginSuccess: "ログインに成功しました",
    loginFailed: "アカウントまたはパスワードが正しくありません",
    pleaseEnterAll: "アカウントとパスワードを入力してください",
  },
  "th-TH": {
    title: "เข้าสู่ระบบบัญชี",
    accountLabel: "บัญชี",
    accountPlaceholder: "โปรดป้อนบัญชี",
    passwordLabel: "รหัสผ่าน",
    passwordPlaceholder: "กรุณากรอกรหัสผ่าน",
    loginBtn: "เข้าสู่ระบบ",
    registerNow: "ลงทะเบียนตอนนี้",
    onlineService: "บริการออนไลน์",
    langSetting: "การตั้งค่าภาษา",
    cancel: "ยกเลิก",
    loginSuccess: "เข้าสู่ระบบสำเร็จ",
    loginFailed: "บัญชีหรือรหัสผ่านไม่ถูกต้อง",
    pleaseEnterAll: "กรุณากรอกทั้งบัญชีและรหัสผ่าน",
  },
  "ko-KR": {
    title: "계정 로그인",
    accountLabel: "계정",
    accountPlaceholder: "계정을 입력하세요",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력하세요",
    loginBtn: "로그인",
    registerNow: "지금 등록하기",
    onlineService: "온라인 서비스",
    langSetting: "언어 설정",
    cancel: "취소",
    loginSuccess: "로그인 성공",
    loginFailed: "계정 또는 비밀번호가 잘못되었습니다",
    pleaseEnterAll: "계정과 비밀번호를 입력하세요",
  },
  "fr-FR": {
    title: "Connexion au compte",
    accountLabel: "Compte",
    accountPlaceholder: "Veuillez entrer le compte",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Veuillez entrer le mot de passe",
    loginBtn: "Connexion",
    registerNow: "Inscrivez-vous maintenant",
    onlineService: "Service en ligne",
    langSetting: "Paramètres de langue",
    cancel: "Annuler",
    loginSuccess: "Connexion réussie",
    loginFailed: "Compte ou mot de passe incorrect",
    pleaseEnterAll: "Veuillez saisir votre compte et votre mot de passe",
  },
  "de-DE": {
    title: "Kontoanmeldung",
    accountLabel: "Konto",
    accountPlaceholder: "Bitte geben Sie das Konto ein",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Bitte geben Sie das Passwort ein",
    loginBtn: "Anmelden",
    registerNow: "Jetzt registrieren",
    onlineService: "Online-Service",
    langSetting: "Spracheinstellungen",
    cancel: "Abbrechen",
    loginSuccess: "Erfolgreich angemeldet",
    loginFailed: "Ungültiges Konto oder Passwort",
    pleaseEnterAll: "Bitte geben Sie Konto und Passwort ein",
  },
};

export function normalizeLanguageCode(
  code: string | null | undefined
): LanguageCode {
  if (!code) return "zh-CN";
  const c = code.toLowerCase().trim();
  if (c === "vi" || c.startsWith("vi")) return "vi-VN";
  if (c === "en" || c.startsWith("en")) return "en-US";
  if (c === "id" || c.startsWith("id")) return "id-ID";
  if (c === "ms" || c.startsWith("ms")) return "ms-MY";
  if (c === "zh-tw" || c === "tw" || c === "hk" || c === "hk-tw") return "hk-TW";
  if (c === "zh" || c === "zh-cn" || c === "cn") return "zh-CN";
  if (c === "ja" || c.startsWith("ja")) return "ja-JP";
  if (c === "th" || c.startsWith("th")) return "th-TH";
  if (c === "ko" || c.startsWith("ko")) return "ko-KR";
  if (c === "fr" || c.startsWith("fr")) return "fr-FR";
  if (c === "de" || c.startsWith("de")) return "de-DE";
  return "zh-CN";
}

interface I18nContextType {
  currentLang: LanguageCode;
  setLang: (lang: LanguageCode | string) => void;
  t: TranslationDict;
  isRoot?: boolean;
}

const I18nContext = createContext<I18nContextType>({
  currentLang: "zh-CN",
  setLang: () => {},
  t: TRANSLATIONS["zh-CN"],
  isRoot: false,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const parent = useContext(I18nContext);
  if (parent && parent.isRoot) {
    return <>{children}</>;
  }

  const [currentLang, setCurrentLangState] = useState<LanguageCode>("zh-CN");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("i18nLang");
      if (savedLang) {
        setCurrentLangState(normalizeLanguageCode(savedLang));
      }
    } catch {
      // ignore
    }

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setCurrentLangState(normalizeLanguageCode(customEvent.detail));
      } else {
        const saved = localStorage.getItem("i18nLang");
        if (saved) setCurrentLangState(normalizeLanguageCode(saved));
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "i18nLang" && e.newValue) {
        setCurrentLangState(normalizeLanguageCode(e.newValue));
      }
    };

    window.addEventListener("i18n-lang-changed", handleCustomChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("i18n-lang-changed", handleCustomChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setLang = (lang: LanguageCode | string) => {
    const normalized = normalizeLanguageCode(lang);
    setCurrentLangState(normalized);
    try {
      localStorage.setItem("i18nLang", normalized);
      localStorage.setItem("i18nLangManuallySet", "1");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("i18n-lang-changed", { detail: normalized })
        );
      }
    } catch {
      // ignore
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS["zh-CN"];

  return (
    <I18nContext.Provider value={{ currentLang, setLang, t, isRoot: true }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
