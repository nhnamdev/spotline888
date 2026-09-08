export interface SetTranslation {
  title: string;
  languageSetting: string;
  loginPassword: string;
  tradePassword: string;
  clearCache: string;
  modify: string;
  cacheCleared: string;
  contactServiceToChangePwd: string;
  currentLangLabel: string;
}

export const SET_TRANSLATIONS: Record<string, SetTranslation> = {
  "zh-CN": {
    title: "设置",
    languageSetting: "语言设置",
    loginPassword: "登录密码",
    tradePassword: "交易密码",
    clearCache: "清除缓存",
    modify: "修改",
    cacheCleared: "缓存清除成功！",
    contactServiceToChangePwd: "如需更改密码，请联系客服",
    currentLangLabel: "简体中文",
  },
  "zh-TW": {
    title: "設置",
    languageSetting: "語言設置",
    loginPassword: "登錄密碼",
    tradePassword: "交易密碼",
    clearCache: "清除緩存",
    modify: "修改",
    cacheCleared: "緩存清除成功！",
    contactServiceToChangePwd: "如需更改密碼，請聯繫客服",
    currentLangLabel: "繁體中文",
  },
  en: {
    title: "Settings",
    languageSetting: "Language",
    loginPassword: "Login Password",
    tradePassword: "Transaction Password",
    clearCache: "Clear Cache",
    modify: "Modify",
    cacheCleared: "Cache cleared successfully!",
    contactServiceToChangePwd:
      "To change your password, please contact customer support",
    currentLangLabel: "English",
  },
  vi: {
    title: "Cài đặt",
    languageSetting: "Cài đặt ngôn ngữ",
    loginPassword: "Mật khẩu đăng nhập",
    tradePassword: "Mật khẩu giao dịch",
    clearCache: "Xóa bộ nhớ đệm",
    modify: "Sửa đổi",
    cacheCleared: "Xóa bộ nhớ đệm thành công!",
    contactServiceToChangePwd:
      "Nếu cần thay đổi mật khẩu, vui lòng liên hệ CSKH",
    currentLangLabel: "Tiếng Việt",
  },
  ja: {
    title: "設定",
    languageSetting: "言語設定",
    loginPassword: "ログインパスワード",
    tradePassword: "取引パスワード",
    clearCache: "キャッシュ削除",
    modify: "変更",
    cacheCleared: "キャッシュをクリアしました！",
    contactServiceToChangePwd:
      "パスワードを変更する場合は、カスタマーサポートまでご連絡ください",
    currentLangLabel: "日本語",
  },
  ko: {
    title: "설정",
    languageSetting: "언어 설정",
    loginPassword: "로그인 비밀번호",
    tradePassword: "거래 비밀번호",
    clearCache: "캐시 삭제",
    modify: "수정",
    cacheCleared: "캐시가 성공적으로 삭제되었습니다!",
    contactServiceToChangePwd:
      "비밀번호를 변경하시려면 고객센터에 문의해 주세요",
    currentLangLabel: "한국어",
  },
  id: {
    title: "Pengaturan",
    languageSetting: "Pengaturan Bahasa",
    loginPassword: "Kata Sandi Masuk",
    tradePassword: "Kata Sandi Transaksi",
    clearCache: "Hapus Cache",
    modify: "Ubah",
    cacheCleared: "Cache berhasil dibersihkan!",
    contactServiceToChangePwd:
      "Untuk mengubah kata sandi, silakan hubungi CS",
    currentLangLabel: "Bahasa Indonesia",
  },
  es: {
    title: "Configuración",
    languageSetting: "Idioma",
    loginPassword: "Contraseña de inicio",
    tradePassword: "Contraseña de transacción",
    clearCache: "Limpiar caché",
    modify: "Modificar",
    cacheCleared: "¡Caché borrada con éxito!",
    contactServiceToChangePwd:
      "Para cambiar contraseña, por favor contacte a soporte",
    currentLangLabel: "Español",
  },
  fr: {
    title: "Paramètres",
    languageSetting: "Langue",
    loginPassword: "Mot de passe de connexion",
    tradePassword: "Mot de passe de transaction",
    clearCache: "Vider le cache",
    modify: "Modifier",
    cacheCleared: "Cache vidé avec succès !",
    contactServiceToChangePwd:
      "Pour changer votre mot de passe, veuillez contacter le support",
    currentLangLabel: "Français",
  },
  de: {
    title: "Einstellungen",
    languageSetting: "Sprache",
    loginPassword: "Anmeldepasswort",
    tradePassword: "Transaktionspasswort",
    clearCache: "Cache leeren",
    modify: "Ändern",
    cacheCleared: "Cache erfolgreich geleert!",
    contactServiceToChangePwd:
      "Wenden Sie sich an den Kundensupport, um Ihr Passwort zu ändern",
    currentLangLabel: "Deutsch",
  },
  ru: {
    title: "Настройки",
    languageSetting: "Язык",
    loginPassword: "Пароль для входа",
    tradePassword: "Платежный пароль",
    clearCache: "Очистить кэш",
    modify: "Изменить",
    cacheCleared: "Кэш успешно очищен!",
    contactServiceToChangePwd:
      "Для изменения пароля свяжитесь со службой поддержки",
    currentLangLabel: "Русский",
  },
};
