"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IndexTranslations } from "./indexI18n";

interface IndexNoticeProps {
  t: IndexTranslations;
}

export const IndexNotice: React.FC<IndexNoticeProps> = ({ t }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="mx-4 mb-2 select-none">
        <div
          id="notice-banner-btn"
          onClick={() => setShowModal(true)}
          className="p-2.5 rounded-[7px] flex items-center bg-white shadow-[0_3px_9px_rgba(15,23,42,0.1)] active:scale-[0.98] transition-transform cursor-pointer"
        >
          {/* Speaker / Megaphone icon */}
          <div className="w-[22px] h-[22px] shrink-0 mr-2 flex items-center justify-center">
            <Image
              src="/sites/spotline888-org/pages-index-index/laba.png"
              alt="Notice"
              width={22}
              height={22}
              className="w-[22px] h-[22px] object-contain"
            />
          </div>

          {/* Text descriptions */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[12px] text-[#1f2937] font-medium truncate">
              {t.noticeTitle}
            </span>
            <span className="text-[10px] text-[#9ca3af] pt-0.5">
              {t.noticeTime}
            </span>
          </div>
        </div>
      </div>

      {/* Center Announcement Popup */}
      {showModal && (
        <div
          className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-[310px] bg-white rounded-[12px] p-5 shadow-[0_10px_25px_rgba(15,23,42,0.25)] select-text"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[14px] font-bold text-[#1f2937] text-center mb-1 leading-snug">
              {t.noticeTitle}
            </h3>
            <div className="text-[11px] text-[#9ca3af] text-center py-2 border-b border-gray-100">
              {t.noticeTime}
            </div>
            <div className="text-[12.5px] text-[#4b5563] leading-relaxed mt-3">
              {t.noticeContent}
            </div>
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-[#f8b83d] text-white rounded-lg text-[13px] font-semibold active:opacity-90 transition-opacity"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
