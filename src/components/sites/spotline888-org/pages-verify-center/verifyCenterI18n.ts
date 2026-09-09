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

export const VERIFY_CENTER_TRANSLATIONS: Record<string, VerifyCenterTranslation> = {
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
  vi: {
    title: "Xác thực danh tính (KYC)",
    statusReviewing: "Đang xét duyệt hồ sơ",
    descReviewing: "Hồ sơ của bạn đã được gửi thành công, nhân viên đang thẩm định. Vui lòng kiên nhẫn chờ đợi.",
    statusVerified: "Đã xác thực thành công",
    descVerified: "Tài khoản của bạn đã được xác minh danh tính chính chủ. Bạn có thể giao dịch và rút tiền không giới hạn.",
    statusRejected: "Xác thực không thành công",
    descRejected: "Hồ sơ xác minh của bạn đã bị từ chối. Vui lòng kiểm tra lý do và nộp lại.",
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
  en: {
    title: "Identity Verification (KYC)",
    statusReviewing: "Under Review",
    descReviewing: "Your verification documents have been submitted. Please wait patiently for review.",
    statusVerified: "Verified Successfully",
    descVerified: "Your identity has been verified. You can now trade and withdraw without limits.",
    statusRejected: "Verification Rejected",
    descRejected: "Your verification was rejected. Please review the reason and submit again.",
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
    uploading: "Uploading to Cloudflare R2...",
    submitBtn: "Submit for Verification",
    submitting: "Submitting...",
    fillAll: "Please fill in all fields and upload both ID images",
    submitSuccess: "Submitted successfully! Please wait for approval.",
  },
};
