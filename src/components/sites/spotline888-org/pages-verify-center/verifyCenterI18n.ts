import { LanguageCode } from "../pages-login-login/i18n";

export interface VerifyCenterTranslation {
  title: string;
  statusReviewing: string;
  descReviewing: string;
  statusVerified: string;
  descVerified: string;
  statusRejected: string;
  descRejected: string;
  reason: string;
  fullName: string;
  fullNamePlaceholder: string;
  idNumber: string;
  idNumberPlaceholder: string;
  profession: string;
  professionPlaceholder: string;
  frontCard: string;
  backCard: string;
  uploadHint: string;
  uploading: string;
  submitBtn: string;
  submitting: string;
  fillAll: string;
  submitSuccess: string;
}

export const VERIFY_CENTER_TRANSLATIONS: Record<
  LanguageCode,
  VerifyCenterTranslation
> = {
  "zh-CN": {
    title: "实名认证",
    statusReviewing: "认证审核中",
    descReviewing: "认证资料已提交，工作人员正在审核中，请耐心等待",
    statusVerified: "已通过实名认证",
    descVerified: "您的身份信息已核实无误，可正常进行交易与提现",
    statusRejected: "认证未通过",
    descRejected: "您的身份审核被驳回，请根据提示重新提交",
    reason: "驳回原因：",
    fullName: "真实姓名",
    fullNamePlaceholder: "请输入与证件一致的真实姓名",
    idNumber: "身份证号 / 护照号",
    idNumberPlaceholder: "请输入证件号码",
    profession: "职业 / 行业",
    professionPlaceholder: "请输入您的职业",
    frontCard: "证件正面照",
    backCard: "证件反面照",
    uploadHint: "点击上传证件照片",
    uploading: "正在上传云端...",
    submitBtn: "提交认证",
    submitting: "提交中...",
    fillAll: "请填写完整信息并上传证件正反面照片",
    submitSuccess: "认证资料已提交，请等待审核",
  },
  "hk-TW": {
    title: "實名認證",
    statusReviewing: "認證審核中",
    descReviewing: "認證資料已提交，工作人員正在審核中，請耐心等待",
    statusVerified: "已通過實名認證",
    descVerified: "您的身份信息已核實無誤，可正常進行交易與提現",
    statusRejected: "認證未通過",
    descRejected: "您的身份審核被駁回，請根據提示重新提交",
    reason: "駁回原因：",
    fullName: "真實姓名",
    fullNamePlaceholder: "請輸入與證件一致的真實姓名",
    idNumber: "身份證號 / 護照號",
    idNumberPlaceholder: "請輸入證件號碼",
    profession: "職業 / 行業",
    professionPlaceholder: "請輸入您的職業",
    frontCard: "證件正面照",
    backCard: "證件反面照",
    uploadHint: "點擊上傳證件照片",
    uploading: "正在上傳雲端...",
    submitBtn: "提交認證",
    submitting: "提交中...",
    fillAll: "請填寫完整信息並上傳證件正反面照片",
    submitSuccess: "認證資料已提交，請等待審核",
  },
  "en-US": {
    title: "Identity Verification (KYC)",
    statusReviewing: "Under Review",
    descReviewing:
      "Your verification documents have been submitted. Please wait patiently for review.",
    statusVerified: "Verified Successfully",
    descVerified:
      "Your identity has been verified. You can now trade and withdraw without limits.",
    statusRejected: "Verification Rejected",
    descRejected:
      "Your verification was rejected. Please review the reason and submit again.",
    reason: "Rejection Reason: ",
    fullName: "Full Real Name",
    fullNamePlaceholder: "Enter full name matching your ID",
    idNumber: "ID / Passport Number",
    idNumberPlaceholder: "Enter ID or passport number",
    profession: "Profession",
    professionPlaceholder: "e.g. Business, Engineer, Freelancer...",
    frontCard: "Front Side of ID",
    backCard: "Back Side of ID",
    uploadHint: "Click to upload ID photo",
    uploading: "Uploading to cloud...",
    submitBtn: "Submit for Verification",
    submitting: "Submitting...",
    fillAll: "Please fill in all fields and upload both ID images",
    submitSuccess: "Submitted successfully! Please wait for approval.",
  },
  "vi-VN": {
    title: "Xác thực danh tính (KYC)",
    statusReviewing: "Đang xét duyệt hồ sơ",
    descReviewing:
      "Hồ sơ của bạn đã được gửi thành công, nhân viên đang thẩm định. Vui lòng kiên nhẫn chờ đợi.",
    statusVerified: "Đã xác thực thành công",
    descVerified:
      "Tài khoản của bạn đã được xác minh danh tính chính chủ. Bạn có thể giao dịch và rút tiền không giới hạn.",
    statusRejected: "Xác thực không thành công",
    descRejected:
      "Hồ sơ xác minh của bạn đã bị từ chối. Vui lòng kiểm tra lý do và nộp lại.",
    reason: "Lý do từ chối: ",
    fullName: "Họ và tên thật",
    fullNamePlaceholder: "Nhập họ tên đúng như trên giấy tờ",
    idNumber: "Số CMND / CCCD / Hộ chiếu",
    idNumberPlaceholder: "Nhập số CMND hoặc CCCD",
    profession: "Nghề nghiệp",
    professionPlaceholder: "Ví dụ: Kinh doanh, Kỹ sư, Tự do...",
    frontCard: "Ảnh mặt trước CCCD",
    backCard: "Ảnh mặt sau CCCD",
    uploadHint: "Nhấn vào đây để tải ảnh lên",
    uploading: "Đang tải ảnh lên Cloudflare R2...",
    submitBtn: "Gửi hồ sơ xác minh",
    submitting: "Đang gửi hồ sơ...",
    fillAll: "Vui lòng nhập đầy đủ họ tên, số CMND/CCCD và tải đủ 2 mặt ảnh",
    submitSuccess: "Gửi hồ sơ thành công! Vui lòng chờ quản trị viên phê duyệt.",
  },
  "id-ID": {
    title: "Verifikasi Identitas (KYC)",
    statusReviewing: "Dalam Peninjauan",
    descReviewing:
      "Dokumen verifikasi Anda telah dikirimkan, petugas sedang meninjau. Harap menunggu dengan sabar.",
    statusVerified: "Verifikasi Berhasil",
    descVerified:
      "Identitas Anda telah diverifikasi. Anda dapat bertransaksi dan menarik dana tanpa batas.",
    statusRejected: "Verifikasi Ditolak",
    descRejected:
      "Verifikasi Anda ditolak. Silakan periksa alasannya dan kirimkan kembali.",
    reason: "Alasan Penolakan: ",
    fullName: "Nama Lengkap Asli",
    fullNamePlaceholder: "Masukkan nama lengkap sesuai KTP/Paspor",
    idNumber: "Nomor KTP / Paspor",
    idNumberPlaceholder: "Masukkan nomor identitas",
    profession: "Pekerjaan",
    professionPlaceholder: "Contoh: Bisnis, Insinyur, Wiraswasta...",
    frontCard: "Foto KTP Bagian Depan",
    backCard: "Foto KTP Bagian Belakang",
    uploadHint: "Klik untuk mengunggah foto kartu identitas",
    uploading: "Mengunggah ke cloud...",
    submitBtn: "Kirim Verifikasi",
    submitting: "Mengirimkan...",
    fillAll: "Harap isi semua data dan unggah kedua sisi foto identitas",
    submitSuccess: "Berhasil dikirim! Silakan tunggu persetujuan.",
  },
  "ms-MY": {
    title: "Pengesahan Identiti (KYC)",
    statusReviewing: "Sedang Disemak",
    descReviewing:
      "Dokumen pengesahan anda telah dihantar. Sila tunggu dengan sabar sementara semakan dijalankan.",
    statusVerified: "Disahkan Berjaya",
    descVerified:
      "Identiti anda telah disahkan. Anda kini boleh berdagang dan mengeluarkan dana.",
    statusRejected: "Pengesahan Ditolak",
    descRejected:
      "Pengesahan anda telah ditolak. Sila semak sebabnya dan hantar semula.",
    reason: "Sebab Penolakan: ",
    fullName: "Nama Penuh Sebenar",
    fullNamePlaceholder: "Masukkan nama penuh mengikut kad pengenalan",
    idNumber: "No. Kad Pengenalan / Pasport",
    idNumberPlaceholder: "Masukkan nombor dokumen pengenalan",
    profession: "Pekerjaan",
    professionPlaceholder: "Cth: Perniagaan, Jurutera, Bebas...",
    frontCard: "Foto Bahagian Hadapan Kad",
    backCard: "Foto Bahagian Belakang Kad",
    uploadHint: "Klik untuk memuat naik foto dokumen",
    uploading: "Memuat naik ke awan...",
    submitBtn: "Hantar Pengesahan",
    submitting: "Menghantar...",
    fillAll: "Sila isi semua maklumat dan muat naik kedua-dua bahagian foto",
    submitSuccess: "Berjaya dihantar! Sila tunggu kelulusan pentadbir.",
  },
  "ja-JP": {
    title: "本人確認 (KYC)",
    statusReviewing: "審査中",
    descReviewing:
      "確認書類が提出されました。審査が完了するまでしばらくお待ちください。",
    statusVerified: "本人確認完了",
    descVerified:
      "お客様の身元が確認されました。取引および出金が制限なくご利用いただけます。",
    statusRejected: "本人確認が却下されました",
    descRejected:
      "提出された身分証明書が却下されました。理由をご確認の上、再度提出してください。",
    reason: "却下理由：",
    fullName: "氏名（本名）",
    fullNamePlaceholder: "身分証明書と一致する本名を入力してください",
    idNumber: "身分証番号 / パスポート番号",
    idNumberPlaceholder: "身分証番号を入力してください",
    profession: "職業 / 業種",
    professionPlaceholder: "例：会社員、エンジニア、自営業など",
    frontCard: "身分証明書（表面）",
    backCard: "身分証明書（裏面）",
    uploadHint: "クリックして身分証明書の写真をアップロード",
    uploading: "クラウドにアップロード中...",
    submitBtn: "認証を申請する",
    submitting: "送信中...",
    fillAll: "すべての項目を入力し、身分証明書の両面写真をアップロードしてください",
    submitSuccess: "申請が完了しました。審査完了までお待ちください。",
  },
  "th-TH": {
    title: "การยืนยันตัวตน (KYC)",
    statusReviewing: "กำลังตรวจสอบ",
    descReviewing:
      "ส่งเอกสารยืนยันตัวตนแล้ว เจ้าหน้าที่กำลังตรวจสอบ โปรดรอสักครู่",
    statusVerified: "ยืนยันตัวตนสำเร็จแล้ว",
    descVerified:
      "ข้อมูลประจำตัวของคุณได้รับการยืนยันแล้ว สามารถซื้อขายและถอนเงินได้ตามปกติ",
    statusRejected: "การยืนยันตัวตนไม่ผ่าน",
    descRejected:
      "การตรวจสอบเอกสารของคุณถูกปฏิเสธ โปรดตรวจสอบเหตุผลและส่งใหม่อีกครั้ง",
    reason: "เหตุผลที่ปฏิเสธ: ",
    fullName: "ชื่อ-นามสกุลจริง",
    fullNamePlaceholder: "กรุณากรอกชื่อ-นามสกุลจริงให้ตรงกับบัตร",
    idNumber: "เลขบัตรประจำตัวประชาชน / หนังสือเดินทาง",
    idNumberPlaceholder: "กรุณากรอกหมายเลขบัตรประจำตัว",
    profession: "อาชีพ",
    professionPlaceholder: "เช่น ธุรกิจส่วนตัว, วิศวกร, อาชีพอิสระ...",
    frontCard: "ภาพถ่ายด้านหน้าบัตร",
    backCard: "ภาพถ่ายด้านหลังบัตร",
    uploadHint: "คลิกเพื่ออัปโหลดรูปถ่ายเอกสาร",
    uploading: "กำลังอัปโหลด...",
    submitBtn: "ส่งข้อมูลยืนยันตัวตน",
    submitting: "กำลังส่ง...",
    fillAll: "กรุณากรอกข้อมูลให้ครบถ้วนและอัปโหลดรูปถ่ายทั้งสองด้าน",
    submitSuccess: "ส่งข้อมูลสำเร็จแล้ว! โปรดรอการอนุมัติ",
  },
  "ko-KR": {
    title: "본인 인증 (KYC)",
    statusReviewing: "인증 심사 중",
    descReviewing:
      "인증 서류가 제출되었습니다. 담당자가 심사 중이오니 잠시만 기다려 주세요.",
    statusVerified: "본인 인증 완료",
    descVerified:
      "신원 정보가 성공적으로 확인되었습니다. 정상적으로 거래 및 출금이 가능합니다.",
    statusRejected: "인증 반려됨",
    descRejected:
      "신원 인증 심사가 반려되었습니다. 사유를 확인하시고 다시 제출해 주세요.",
    reason: "반려 사유: ",
    fullName: "실명",
    fullNamePlaceholder: "신분증과 일치하는 실명을 입력하세요",
    idNumber: "주민등록번호 / 여권번호",
    idNumberPlaceholder: "신분증 번호를 입력하세요",
    profession: "직업 / 업종",
    professionPlaceholder: "예: 회사원, 사업, 프리랜서...",
    frontCard: "신분증 앞면 사진",
    backCard: "신분증 뒷면 사진",
    uploadHint: "신분증 사진을 업로드하려면 클릭하세요",
    uploading: "업로드 중...",
    submitBtn: "인증 신청하기",
    submitting: "제출 중...",
    fillAll: "모든 항목을 입력하고 신분증 앞/뒷면 사진을 업로드해 주세요",
    submitSuccess: "인증 신청이 완료되었습니다. 승인을 기다려 주세요.",
  },
  "fr-FR": {
    title: "Vérification d'identité (KYC)",
    statusReviewing: "Examen en cours",
    descReviewing:
      "Vos documents ont été soumis. Veuillez patienter pendant l'examen.",
    statusVerified: "Vérification réussie",
    descVerified:
      "Votre identité a été vérifiée avec succès. Vous pouvez échanger et retirer.",
    statusRejected: "Vérification rejetée",
    descRejected:
      "Votre vérification a été rejetée. Veuillez vérifier la raison et soumettre à nouveau.",
    reason: "Raison du rejet : ",
    fullName: "Nom complet réel",
    fullNamePlaceholder: "Entrez votre nom complet figurant sur votre pièce d'identité",
    idNumber: "N° de pièce d'identité / Passeport",
    idNumberPlaceholder: "Entrez votre numéro d'identité",
    profession: "Profession",
    professionPlaceholder: "Ex: Entreprise, Ingénieur, Indépendant...",
    frontCard: "Photo recto de la pièce d'identité",
    backCard: "Photo verso de la pièce d'identité",
    uploadHint: "Cliquez pour télécharger la photo",
    uploading: "Téléchargement vers le cloud...",
    submitBtn: "Soumettre la vérification",
    submitting: "Envoi en cours...",
    fillAll: "Veuillez remplir tous les champs et télécharger les deux côtés de la pièce",
    submitSuccess: "Soumis avec succès ! Veuillez attendre l'approbation.",
  },
  "de-DE": {
    title: "Identitätsprüfung (KYC)",
    statusReviewing: "Wird überprüft",
    descReviewing:
      "Ihre Unterlagen wurden eingereicht. Bitte warten Sie auf die Überprüfung.",
    statusVerified: "Erfolgreich verifiziert",
    descVerified:
      "Ihre Identität wurde bestätigt. Sie können uneingeschränkt handeln und abheben.",
    statusRejected: "Verifizierung abgelehnt",
    descRejected:
      "Ihre Verifizierung wurde abgelehnt. Bitte prüfen Sie den Grund und reichen Sie erneut ein.",
    reason: "Ablehnungsgrund: ",
    fullName: "Vollständiger Realname",
    fullNamePlaceholder: "Geben Sie den Namen genau wie im Ausweis ein",
    idNumber: "Ausweis- / Passnummer",
    idNumberPlaceholder: "Bitte Ausweisnummer eingeben",
    profession: "Beruf",
    professionPlaceholder: "z.B. Angestellter, Ingenieur, Freiberufler...",
    frontCard: "Vorderseite des Ausweises",
    backCard: "Rückseite des Ausweises",
    uploadHint: "Klicken Sie hier, um das Ausweisfoto hochzuladen",
    uploading: "Wird in die Cloud hochgeladen...",
    submitBtn: "Verifizierung einreichen",
    submitting: "Wird übermittelt...",
    fillAll: "Bitte alle Felder ausfüllen und beide Seiten des Ausweises hochladen",
    submitSuccess: "Erfolgreich übermittelt! Bitte warten Sie auf die Genehmigung.",
  },
};
