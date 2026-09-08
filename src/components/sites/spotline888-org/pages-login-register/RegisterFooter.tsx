"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./registerI18n";

export const RegisterFooter: React.FC = () => {
  const { t } = useI18n();
  const router = useRouter();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className="pt-5 px-5 pb-8 flex flex-col items-center gap-3.5">
        {/* Line 1: Agreement and Privacy Policy link */}
        <div className="flex items-center gap-1 text-[12px]">
          <span className="text-[#9ca3af]">{t.agreePrefix}</span>
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="text-[#3b82f6] font-medium hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            《{t.privacyPolicy}》
          </button>
        </div>

        {/* Line 2: Already have an account? Go to login */}
        <Link
          href="/login"
          className="text-[14px] text-[#3b82f6] font-semibold hover:underline cursor-pointer select-none"
        >
          {t.hasAccount}
        </Link>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 text-left shadow-xl max-h-[80vh] flex flex-col animate-in zoom-in-95">
            <h3 className="text-[18px] font-bold text-[#111827] mb-3 text-center">
              {t.privacyPolicy}
            </h3>
            <div className="flex-1 overflow-y-auto text-[13px] text-[#4b5563] leading-relaxed space-y-3 pr-1">
              <p>
                欢迎您使用我们的服务。我们非常重视您的隐私保护和个人信息安全。在使用我们的服务前，请您务必仔细阅读并透彻理解本政策。
              </p>
              <p>
                1. <strong>信息收集：</strong>为向您提供账户注册及交易服务，我们可能会收集您的手机号码、账户信息及必要的身份认证资料。
              </p>
              <p>
                2. <strong>信息使用：</strong>所收集的信息仅用于账户验证、安全保障、客户服务以及提供相关的金融与交易服务。
              </p>
              <p>
                3. <strong>信息保护：</strong>我们采用业界标准的加密技术与多层安全机制，确保您的个人数据安全与隐私。
              </p>
              <p>
                4. <strong>用户权利：</strong>您有权查询、更正或申请注销您的账户信息。如有疑问，请随时联系在线客服。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="mt-4 w-full h-10 bg-[#3b82f6] text-white font-semibold rounded-xl text-[14px] active:scale-98 transition-transform cursor-pointer border-0"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
