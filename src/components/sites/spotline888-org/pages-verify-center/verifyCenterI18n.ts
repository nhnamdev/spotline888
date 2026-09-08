export interface VerifyCenterTranslation {
  title: string;
  statusReviewing: string;
  descReviewing: string;
}

export const VERIFY_CENTER_TRANSLATIONS: Record<
  string,
  VerifyCenterTranslation
> = {
  "zh-CN": {
    title: "认证中心",
    statusReviewing: "认证中",
    descReviewing: "认证资料已提交，请等待审核",
  },
  "zh-TW": {
    title: "認證中心",
    statusReviewing: "認證中",
    descReviewing: "認證資料已提交，請等待審核",
  },
  en: {
    title: "Verification Center",
    statusReviewing: "Under Review",
    descReviewing:
      "Verification documents submitted, please wait for review.",
  },
  vi: {
    title: "Trung tâm xác thực",
    statusReviewing: "Đang xác thực",
    descReviewing: "Hồ sơ xác thực đã được gửi, vui lòng chờ phê duyệt.",
  },
  ja: {
    title: "認証センター",
    statusReviewing: "認証中",
    descReviewing: "認証書類は提出されました。審査をお待ちください。",
  },
  ko: {
    title: "인증 센터",
    statusReviewing: "인증 진행 중",
    descReviewing: "인증 자료가 제출되었습니다. 심사를 기다려 주세요.",
  },
  id: {
    title: "Pusat Verifikasi",
    statusReviewing: "Sedang Diverifikasi",
    descReviewing: "Data verifikasi telah dikirim, mohon tunggu peninjauan.",
  },
  es: {
    title: "Centro de Verificación",
    statusReviewing: "En revisión",
    descReviewing:
      "Documentos de verificación enviados, por favor espere la revisión.",
  },
  fr: {
    title: "Centre de vérification",
    statusReviewing: "En cours de vérification",
    descReviewing:
      "Documents de vérification soumis, veuillez attendre l'approbation.",
  },
  de: {
    title: "Verifizierungszentrum",
    statusReviewing: "In Prüfung",
    descReviewing:
      "Verifizierungsdaten wurden eingereicht, bitte warten Sie auf die Überprüfung.",
  },
  ru: {
    title: "Центр верификации",
    statusReviewing: "На проверке",
    descReviewing:
      "Документы для верификации отправлены, пожалуйста, ожидайте проверки.",
  },
};
