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

export interface RegisterTranslationDict {
  title: string;
  phoneLabel: string;
  phonePlaceholder: string;
  accountLabel: string;
  accountPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  tradePasswordLabel: string;
  tradePasswordPlaceholder: string;
  inviteCodeLabel: string;
  inviteCodePlaceholder: string;
  registerBtn: string;
  agreePrefix: string;
  privacyPolicy: string;
  hasAccount: string;
  phoneInvalid: string;
  registerSuccessTitle: string;
  registerSuccessMsg: string;
  confirm: string;
  cancel: string;
  langSetting: string;
  pleaseEnterAll: string;
  networkError: string;
}

export const REGISTER_TRANSLATIONS: Record<LanguageCode, RegisterTranslationDict> = {
  "zh-CN": {
    title: "账号注册",
    phoneLabel: "手机号",
    phonePlaceholder: "请输入手机号",
    accountLabel: "账号",
    accountPlaceholder: "请输入账号",
    passwordLabel: "密码",
    passwordPlaceholder: "请输入密码",
    tradePasswordLabel: "交易密码",
    tradePasswordPlaceholder: "请输入交易密码",
    inviteCodeLabel: "开户码",
    inviteCodePlaceholder: "请输入开户码",
    registerBtn: "完成注册",
    agreePrefix: "登录即表示同意APP",
    privacyPolicy: "隐私政策",
    hasAccount: "已有账号，去登录",
    phoneInvalid: "请输入正确的手机号",
    registerSuccessTitle: "注册成功",
    registerSuccessMsg: "即将前往登录页",
    confirm: "确定",
    cancel: "取消",
    langSetting: "语言设置",
    pleaseEnterAll: "请填写所有必填项",
    networkError: "网络异常，请重试",
  },
  "hk-TW": {
    title: "帳號註冊",
    phoneLabel: "手機號",
    phonePlaceholder: "請輸入手機號",
    accountLabel: "帳號",
    accountPlaceholder: "請輸入帳號",
    passwordLabel: "密碼",
    passwordPlaceholder: "請輸入密碼",
    tradePasswordLabel: "交易密碼",
    tradePasswordPlaceholder: "請輸入交易密碼",
    inviteCodeLabel: "開戶碼",
    inviteCodePlaceholder: "請輸入開戶碼",
    registerBtn: "完成註冊",
    agreePrefix: "登入即表示同意 APP",
    privacyPolicy: "隱私政策",
    hasAccount: "已有帳號，前往登入",
    phoneInvalid: "請輸入正確的手機號",
    registerSuccessTitle: "註冊成功",
    registerSuccessMsg: "即將前往登入頁",
    confirm: "確定",
    cancel: "取消",
    langSetting: "語言設置",
    pleaseEnterAll: "請填寫所有必填項",
    networkError: "網路異常，請重試",
  },
  "vi-VN": {
    title: "Đăng ký tài khoản",
    phoneLabel: "Số điện thoại",
    phonePlaceholder: "Vui lòng nhập số điện thoại",
    accountLabel: "Tài khoản",
    accountPlaceholder: "Vui lòng nhập tài khoản",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "Vui lòng nhập mật khẩu",
    tradePasswordLabel: "Mật khẩu giao dịch",
    tradePasswordPlaceholder: "Vui lòng nhập mật khẩu giao dịch",
    inviteCodeLabel: "Mã mở tài khoản",
    inviteCodePlaceholder: "Vui lòng nhập mã mở tài khoản",
    registerBtn: "Hoàn tất đăng ký",
    agreePrefix: "Đăng nhập đồng nghĩa với đồng ý APP",
    privacyPolicy: "Chính sách bảo mật",
    hasAccount: "Đã có tài khoản? Đăng nhập",
    phoneInvalid: "Vui lòng nhập số điện thoại hợp lệ",
    registerSuccessTitle: "Đăng ký thành công",
    registerSuccessMsg: "Đang chuyển đến trang đăng nhập",
    confirm: "Xác nhận",
    cancel: "Hủy",
    langSetting: "Cài đặt ngôn ngữ",
    pleaseEnterAll: "Vui lòng điền đầy đủ các thông tin bắt buộc",
    networkError: "Lỗi kết nối mạng, vui lòng thử lại",
  },
  "en-US": {
    title: "Account Registration",
    phoneLabel: "Mobile Number",
    phonePlaceholder: "Please enter mobile number",
    accountLabel: "Account",
    accountPlaceholder: "Please enter account",
    passwordLabel: "Password",
    passwordPlaceholder: "Please enter password",
    tradePasswordLabel: "Trading Password",
    tradePasswordPlaceholder: "Please enter trading password",
    inviteCodeLabel: "Invite Code",
    inviteCodePlaceholder: "Please enter invite code",
    registerBtn: "Complete Registration",
    agreePrefix: "By logging in, you agree to the APP",
    privacyPolicy: "Privacy Policy",
    hasAccount: "Already have an account? Login",
    phoneInvalid: "Please enter a valid mobile number",
    registerSuccessTitle: "Registration successful",
    registerSuccessMsg: "Redirecting to login page",
    confirm: "OK",
    cancel: "Cancel",
    langSetting: "Language Settings",
    pleaseEnterAll: "Please fill in all required fields",
    networkError: "Network error, please try again",
  },
  "id-ID": {
    title: "Registrasi Akun",
    phoneLabel: "Nomor Telepon",
    phonePlaceholder: "Silakan masukkan nomor telepon",
    accountLabel: "Akun",
    accountPlaceholder: "Silakan masukkan akun",
    passwordLabel: "Kata Sandi",
    passwordPlaceholder: "Silakan masukkan kata sandi",
    tradePasswordLabel: "Kata Sandi Perdagangan",
    tradePasswordPlaceholder: "Silakan masukkan kata sandi perdagangan",
    inviteCodeLabel: "Kode Pembukaan Akun",
    inviteCodePlaceholder: "Silakan masukkan kode pembukaan akun",
    registerBtn: "Selesaikan Pendaftaran",
    agreePrefix: "Login berarti setuju dengan APP",
    privacyPolicy: "Kebijakan Privasi",
    hasAccount: "Sudah punya akun? Masuk",
    phoneInvalid: "Silakan masukkan nomor telepon yang valid",
    registerSuccessTitle: "Registrasi Berhasil",
    registerSuccessMsg: "Menuju ke halaman login",
    confirm: "Konfirmasi",
    cancel: "Batal",
    langSetting: "Pengaturan Bahasa",
    pleaseEnterAll: "Silakan isi semua kolom yang wajib diisi",
    networkError: "Kesalahan jaringan, silakan coba lagi",
  },
  "ms-MY": {
    title: "Pendaftaran akaun",
    phoneLabel: "Nombor telefon",
    phonePlaceholder: "Sila masukkan nombor telefon",
    accountLabel: "Akaun",
    accountPlaceholder: "Sila masukkan akaun",
    passwordLabel: "Kata laluan",
    passwordPlaceholder: "Sila masukkan kata laluan",
    tradePasswordLabel: "Kata laluan dagangan",
    tradePasswordPlaceholder: "Sila masukkan kata laluan dagangan",
    inviteCodeLabel: "Kod Pembukaan Akaun",
    inviteCodePlaceholder: "Sila masukkan kod pembukaan akaun",
    registerBtn: "Pendaftaran selesai",
    agreePrefix: "Log masuk bermakna anda bersetuju dengan APP",
    privacyPolicy: "Dasar Privasi",
    hasAccount: "Sudah ada akaun? Log masuk",
    phoneInvalid: "Sila masukkan nombor telefon yang sah",
    registerSuccessTitle: "Pendaftaran berjaya",
    registerSuccessMsg: "Menuju ke halaman log masuk",
    confirm: "Sahkan",
    cancel: "Batal",
    langSetting: "Tetapan Bahasa",
    pleaseEnterAll: "Sila isi semua ruangan yang diperlukan",
    networkError: "Ralat rangkaian, sila cuba sebentar lagi",
  },
  "ja-JP": {
    title: "アカウント登録",
    phoneLabel: "電話番号",
    phonePlaceholder: "電話番号を入力してください",
    accountLabel: "アカウント",
    accountPlaceholder: "アカウントを入力してください",
    passwordLabel: "パスワード",
    passwordPlaceholder: "パスワードを入力してください",
    tradePasswordLabel: "取引パスワード",
    tradePasswordPlaceholder: "取引パスワードを入力してください",
    inviteCodeLabel: "口座開設コード",
    inviteCodePlaceholder: "口座開設コードを入力してください",
    registerBtn: "登録を完了する",
    agreePrefix: "ログインすると利用規約に同意したことになります",
    privacyPolicy: "プライバシーポリシー",
    hasAccount: "アカウントをお持ちの方はログイン",
    phoneInvalid: "正しい電話番号を入力してください",
    registerSuccessTitle: "登録が成功しました",
    registerSuccessMsg: "ログインページへ移動します",
    confirm: "確認",
    cancel: "キャンセル",
    langSetting: "言語設定",
    pleaseEnterAll: "すべての必須項目を入力してください",
    networkError: "ネットワークエラーです。もう一度お試しください",
  },
  "th-TH": {
    title: "ลงทะเบียนบัญชี",
    phoneLabel: "หมายเลขโทรศัพท์",
    phonePlaceholder: "กรุณาใส่หมายเลขโทรศัพท์",
    accountLabel: "บัญชี",
    accountPlaceholder: "กรุณากรอกบัญชี",
    passwordLabel: "รหัสผ่าน",
    passwordPlaceholder: "กรุณาใส่รหัสผ่าน",
    tradePasswordLabel: "รหัสผ่านการซื้อขาย",
    tradePasswordPlaceholder: "กรุณากรอกรหัสผ่านการซื้อขาย",
    inviteCodeLabel: "รหัสเปิดบัญชี",
    inviteCodePlaceholder: "กรุณากรอกรหัสเปิดบัญชี",
    registerBtn: "เสร็จสิ้นการลงทะเบียน",
    agreePrefix: "การเข้าสู่ระบบหมายความว่ายอมรับ APP",
    privacyPolicy: "นโยบายความเป็นส่วนตัว",
    hasAccount: "มีบัญชีอยู่แล้ว เข้าสู่ระบบ",
    phoneInvalid: "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง",
    registerSuccessTitle: "การลงทะเบียนสำเร็จ",
    registerSuccessMsg: "กำลังไปที่หน้าเข้าสู่ระบบ",
    confirm: "ยืนยัน",
    cancel: "ยกเลิก",
    langSetting: "การตั้งค่าภาษา",
    pleaseEnterAll: "กรุณากรอกข้อมูลที่จำเป็นทั้งหมด",
    networkError: "ข้อผิดพลาดของเครือข่าย โปรดลองอีกครั้ง",
  },
  "ko-KR": {
    title: "계정 등록",
    phoneLabel: "전화번호",
    phonePlaceholder: "전화번호를 입력해주세요",
    accountLabel: "계정",
    accountPlaceholder: "계정을 입력해주세요",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력해주세요",
    tradePasswordLabel: "거래 비밀번호",
    tradePasswordPlaceholder: "거래 비밀번호를 입력해주세요",
    inviteCodeLabel: "개설 코드",
    inviteCodePlaceholder: "개설 코드를 입력해주세요",
    registerBtn: "등록 완료",
    agreePrefix: "로그인하면 앱 약관에 동의하는 것으로 간주됩니다",
    privacyPolicy: "개인정보 보호정책",
    hasAccount: "이미 계정이 있으신가요? 로그인",
    phoneInvalid: "올바른 전화번호를 입력해주세요",
    registerSuccessTitle: "등록 성공",
    registerSuccessMsg: "로그인 페이지로 이동합니다",
    confirm: "확인",
    cancel: "취소",
    langSetting: "언어 설정",
    pleaseEnterAll: "모든 필수 입력란을 작성해주세요",
    networkError: "네트워크 오류입니다. 다시 시도해주세요",
  },
  "fr-FR": {
    title: "Inscription de compte",
    phoneLabel: "Téléphone",
    phonePlaceholder: "Veuillez saisir votre numéro de téléphone",
    accountLabel: "Compte",
    accountPlaceholder: "Veuillez saisir votre compte",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Veuillez saisir votre mot de passe",
    tradePasswordLabel: "Mot de passe de trading",
    tradePasswordPlaceholder: "Veuillez saisir votre mot de passe de trading",
    inviteCodeLabel: "Code d'invitation",
    inviteCodePlaceholder: "Veuillez saisir le code d'invitation",
    registerBtn: "Terminer l'inscription",
    agreePrefix: "En vous connectant, vous acceptez l'APP",
    privacyPolicy: "Politique de confidentialité",
    hasAccount: "Vous avez déjà un compte ? Connectez-vous",
    phoneInvalid: "Veuillez saisir un numéro de téléphone valide",
    registerSuccessTitle: "Inscription réussie",
    registerSuccessMsg: "Redirection vers la page de connexion",
    confirm: "Confirmer",
    cancel: "Annuler",
    langSetting: "Paramètres de langue",
    pleaseEnterAll: "Veuillez remplir tous les champs obligatoires",
    networkError: "Erreur réseau, veuillez réessayer",
  },
  "de-DE": {
    title: "Konto-Registrierung",
    phoneLabel: "Telefon",
    phonePlaceholder: "Bitte Telefonnummer eingeben",
    accountLabel: "Konto",
    accountPlaceholder: "Bitte Konto eingeben",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Bitte Passwort eingeben",
    tradePasswordLabel: "Handelspasswort",
    tradePasswordPlaceholder: "Bitte Handelspasswort eingeben",
    inviteCodeLabel: "Eröffnungscode",
    inviteCodePlaceholder: "Bitte Eröffnungscode eingeben",
    registerBtn: "Registrierung abschließen",
    agreePrefix: "Mit der Anmeldung stimmen Sie der APP zu",
    privacyPolicy: "Datenschutzrichtlinie",
    hasAccount: "Bereits ein Konto? Anmelden",
    phoneInvalid: "Bitte geben Sie eine gültige Telefonnummer ein",
    registerSuccessTitle: "Registrierung erfolgreich",
    registerSuccessMsg: "Weiterleitung zur Anmeldeseite",
    confirm: "Bestätigen",
    cancel: "Abbrechen",
    langSetting: "Spracheinstellungen",
    pleaseEnterAll: "Bitte alle Pflichtfelder ausfüllen",
    networkError: "Netzwerkfehler, bitte erneut versuchen",
  },
};

import {
  useI18n as useBaseI18n,
  normalizeLanguageCode,
} from "../pages-login-login/i18n";

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export const useI18n = () => {
  const base = useBaseI18n();
  const currentLang = normalizeLanguageCode(base?.currentLang || "zh-CN");
  const t =
    REGISTER_TRANSLATIONS[currentLang] || REGISTER_TRANSLATIONS["zh-CN"];
  return {
    currentLang,
    setLang: base?.setLang || (() => {}),
    t,
  };
};
