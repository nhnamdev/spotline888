"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, CheckCircle2, AlertCircle, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { VERIFY_CENTER_TRANSLATIONS } from "./verifyCenterI18n";
import { getR2Url } from "@/lib/r2";
import { verifyApi, uploadApi } from "@/lib/api";

function SpotlineVerifyCenterContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t = VERIFY_CENTER_TRANSLATIONS[currentLang] || VERIFY_CENTER_TRANSLATIONS["vi"] || VERIFY_CENTER_TRANSLATIONS["zh-CN"];

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAuth, setIsAuth] = useState<number>(0); // 0: chưa, 1: chờ, 2: đã duyệt, 3: từ chối
  const [errorReason, setErrorReason] = useState<string>("");

  // Form states
  const [realName, setRealName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [profession, setProfession] = useState("");
  const [frontImg, setFrontImg] = useState("");
  const [backImg, setBackImg] = useState("");

  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const fetchVerifyStatus = async () => {
    try {
      setLoading(true);
      const res = await verifyApi.getStatus();
      if (res.code === 1 && res.data) {
        setIsAuth(res.data.is_auth ?? 0);
        if (res.data.verify) {
          setRealName(res.data.verify.real_name || "");
          setIdCard(res.data.verify.id_card || "");
          setProfession(res.data.verify.profession || "");
          setFrontImg(res.data.verify.id_img_front || "");
          setBackImg(res.data.verify.id_img_back || "");
          setErrorReason(res.data.verify.error_reason || "");
        }
      }
    } catch (err) {
      console.error("Lỗi lấy trạng thái KYC:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifyStatus();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (side === "front") setUploadingFront(true);
    else setUploadingBack(true);

    try {
      const res = await uploadApi.uploadFile(file, "kyc");
      if (res.code === 1 && res.data?.url) {
        if (side === "front") {
          setFrontImg(res.data.url);
        } else {
          setBackImg(res.data.url);
        }
      } else {
        setAlertMsg({ type: "error", text: res.msg || "Không thể tải ảnh lên" });
      }
    } catch (err: any) {
      setAlertMsg({ type: "error", text: err.message || "Lỗi tải ảnh lên R2" });
    } finally {
      if (side === "front") setUploadingFront(false);
      else setUploadingBack(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!realName.trim() || !idCard.trim() || !frontImg || !backImg) {
      setAlertMsg({ type: "error", text: t.fillAll });
      return;
    }

    try {
      setSubmitting(true);
      setAlertMsg(null);
      const res = await verifyApi.submitVerify({
        realName: realName.trim(),
        idCard: idCard.trim(),
        frontImg,
        backImg,
        profession: profession.trim() || "Kinh doanh",
      });

      if (res.code === 1) {
        setAlertMsg({ type: "success", text: t.submitSuccess });
        setIsAuth(1); // Chuyển sang trạng thái chờ duyệt
      } else {
        setAlertMsg({ type: "error", text: res.msg || "Gửi hồ sơ thất bại" });
      }
    } catch (err: any) {
      setAlertMsg({ type: "error", text: err.message || "Lỗi gửi hồ sơ xác minh" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ff] via-[#f8fafc_35%] to-white flex justify-center select-none pb-12">
      <div className="w-full max-w-[540px] min-h-screen flex flex-col relative px-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between pt-4 pb-4 sticky top-0 z-20 bg-white/70 backdrop-blur-md rounded-b-2xl mb-4 px-2 shadow-xs">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Quay lại"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_1px_6px_rgba(0,0,0,0.08)] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer border border-slate-100"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h1 className="text-[17px] font-bold text-slate-800 tracking-tight">{t.title}</h1>
          </div>
          <button
            type="button"
            onClick={fetchVerifyStatus}
            disabled={loading}
            aria-label="Làm mới"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_1px_6px_rgba(0,0,0,0.08)] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer border border-slate-100"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <span className="text-sm">Đang tải dữ liệu hồ sơ...</span>
          </div>
        ) : isAuth === 1 ? (
          /* TRẠNG THÁI 1: CHỜ XÉT DUYỆT */
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-28 h-28 relative mb-6 drop-shadow-md">
              <Image
                src={getR2Url("/sites/spotline888-org/pages-verify/verify_clock.png")}
                alt="Đang chờ duyệt"
                fill
                className="object-contain animate-pulse"
              />
            </div>
            <h2 className="text-[20px] font-bold text-slate-800 mb-2 tracking-tight">{t.statusReviewing}</h2>
            <p className="text-[14px] text-slate-500 max-w-md leading-relaxed mb-6">{t.descReviewing}</p>

            <div className="w-full bg-white rounded-2xl p-5 shadow-xs border border-indigo-50 text-left space-y-3">
              <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="text-slate-500">{t.fullName}:</span>
                <span className="font-semibold text-slate-800">{realName}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="text-slate-500">{t.idNumber}:</span>
                <span className="font-semibold text-slate-800">{idCard}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-slate-500">Trạng thái:</span>
                <span className="font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs">Chờ phê duyệt</span>
              </div>
            </div>
          </div>
        ) : isAuth === 2 ? (
          /* TRẠNG THÁI 2: ĐÃ XÁC MINH THÀNH CÔNG */
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 shadow-md shadow-emerald-100">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-[20px] font-bold text-slate-800 mb-2">{t.statusVerified}</h2>
            <p className="text-[14px] text-slate-500 max-w-md leading-relaxed mb-6">{t.descVerified}</p>

            <div className="w-full bg-white rounded-2xl p-5 shadow-xs border border-emerald-100 text-left space-y-3">
              <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="text-slate-500">{t.fullName}:</span>
                <span className="font-semibold text-slate-800">{realName}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                <span className="text-slate-500">{t.idNumber}:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {idCard ? idCard.slice(0, 3) + "******" + idCard.slice(-3) : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-slate-500">Bảo mật cấp độ:</span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">Cấp cao nhất</span>
              </div>
            </div>
          </div>
        ) : (
          /* TRẠNG THÁI 0 hoặc 3: FORM NHẬP KYC VÀ TẢI ẢNH LÊN R2 */
          <form onSubmit={handleSubmit} className="space-y-4 pb-6">
            {/* Cảnh báo nếu bị từ chối trước đó */}
            {isAuth === 3 && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-900 mb-1">{t.statusRejected}</h4>
                  <p className="text-rose-700 leading-snug">{t.reason} <strong>{errorReason || "Hình ảnh mờ hoặc thông tin không trùng khớp"}</strong></p>
                  <p className="text-xs text-rose-500 mt-1">{t.descRejected}</p>
                </div>
              </div>
            )}

            {alertMsg && (
              <div
                className={`p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
                  alertMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {alertMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{alertMsg.text}</span>
              </div>
            )}

            {/* Khối nhập thông tin cá nhân */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-l-3 border-indigo-600 pl-2">Thông tin cơ bản</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.fullName} <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.idNumber} <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  placeholder={t.idNumberPlaceholder}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.profession}</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder={t.professionPlaceholder}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Khối upload ảnh giấy tờ lên Cloudflare R2 */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-l-3 border-indigo-600 pl-2">Tải lên giấy tờ định danh (CCCD / Hộ chiếu)</h3>
              <p className="text-xs text-slate-400">Vui lòng chụp ảnh rõ nét, không bị lóa sáng, không bị mất góc.</p>

              {/* Mặt trước */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">{t.frontCard} <span className="text-rose-500">*</span></label>
                <input
                  type="file"
                  ref={frontInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "front")}
                />
                <div
                  onClick={() => frontInputRef.current?.click()}
                  className="relative w-full h-44 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                >
                  {uploadingFront ? (
                    <div className="flex flex-col items-center gap-2 text-indigo-600">
                      <Loader2 className="w-7 h-7 animate-spin" />
                      <span className="text-xs font-medium">{t.uploading}</span>
                    </div>
                  ) : frontImg ? (
                    <>
                      <Image
                        src={getR2Url(frontImg)}
                        alt="Mặt trước CCCD"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                        <Upload className="w-4 h-4" /> Đổi ảnh khác
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 p-4 text-center">
                      <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{t.uploadHint}</span>
                      <span className="text-[11px] text-slate-400">Mặt trước có ảnh chân dung và số thẻ</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mặt sau */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">{t.backCard} <span className="text-rose-500">*</span></label>
                <input
                  type="file"
                  ref={backInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "back")}
                />
                <div
                  onClick={() => backInputRef.current?.click()}
                  className="relative w-full h-44 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                >
                  {uploadingBack ? (
                    <div className="flex flex-col items-center gap-2 text-indigo-600">
                      <Loader2 className="w-7 h-7 animate-spin" />
                      <span className="text-xs font-medium">{t.uploading}</span>
                    </div>
                  ) : backImg ? (
                    <>
                      <Image
                        src={getR2Url(backImg)}
                        alt="Mặt sau CCCD"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                        <Upload className="w-4 h-4" /> Đổi ảnh khác
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 p-4 text-center">
                      <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{t.uploadHint}</span>
                      <span className="text-[11px] text-slate-400">Mặt sau có đặc điểm nhận dạng & dấu vân tay</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nút gửi duyệt */}
            <button
              type="submit"
              disabled={submitting || uploadingFront || uploadingBack}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-indigo-200 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer border-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submitBtn
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SpotlineVerifyCenterPage() {
  return (
    <I18nProvider>
      <SpotlineVerifyCenterContent />
    </I18nProvider>
  );
}
