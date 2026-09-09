"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IndexTranslations } from "./indexI18n";
import { contentApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";

interface IndexNoticeProps {
  t: IndexTranslations;
}

interface NoticeItem {
  id: number;
  title: string;
  short_content?: string;
  content: string;
  created_at: string;
}

export const IndexNotice: React.FC<IndexNoticeProps> = ({ t }) => {
  const [showModal, setShowModal] = useState(false);
  const [dbNotice, setDbNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    async function loadNotice() {
      try {
        const res = await contentApi.getNotices(1);
        if (res.code === 1 && Array.isArray(res.data) && res.data.length > 0) {
          setDbNotice(res.data[0]);
        }
      } catch {
        // Fallback dùng translations t
      }
    }
    loadNotice();
  }, []);

  const displayTitle = dbNotice?.title || t.noticeTitle;
  const displayTime = dbNotice?.created_at
    ? new Date(dbNotice.created_at).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : t.noticeTime;
  const displayContent = dbNotice?.content || t.noticeContent;

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
              src={getR2Url("/sites/spotline888-org/pages-index-index/laba.png")}
              alt="Notice"
              width={22}
              height={22}
              className="w-[22px] h-[22px] object-contain"
            />
          </div>

          {/* Text descriptions */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[12px] text-[#1f2937] font-medium truncate">
              {displayTitle}
            </span>
            <span className="text-[10px] text-[#9ca3af] pt-0.5">
              {displayTime}
            </span>
          </div>
        </div>
      </div>

      {/* Center Announcement Popup */}
      {showModal && (
        <div
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-[340px] bg-white rounded-[20px] p-6 shadow-[0_15px_35px_rgba(0,0,0,0.25)] select-text flex flex-col animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[15px] font-bold text-[#111827] leading-[1.4]">
              {displayTitle}
            </h3>
            <div className="text-[12.5px] text-[#64748b] mt-2 mb-3 font-normal">
              {displayTime}
            </div>
            <div
              className="text-[13.5px] text-[#334155] leading-[1.7] text-justify font-normal"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full py-2.5 rounded-[10px] bg-[#1e40af] text-white text-[13.5px] font-medium active:scale-[0.98] transition-transform"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};
