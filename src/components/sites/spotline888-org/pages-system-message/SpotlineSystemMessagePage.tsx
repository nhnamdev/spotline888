"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bell, RefreshCw } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { SYSTEM_MESSAGE_TRANSLATIONS } from "./systemMessageI18n";
import { contentApi } from "@/lib/api";

interface MessageItem {
  id: number;
  content: string;
  date: string;
  isRead: boolean;
}

function SpotlineSystemMessageContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t =
    SYSTEM_MESSAGE_TRANSLATIONS[currentLang] ||
    SYSTEM_MESSAGE_TRANSLATIONS["zh-CN"];

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await contentApi.getUserMessages();
      if (res.code === 1 && Array.isArray(res.data)) {
        const mapped: MessageItem[] = res.data.map((m: any) => ({
          id: m.id,
          content: m.content || m.title,
          date: m.date || (m.created_at ? new Date(m.created_at).toISOString().slice(0, 19).replace("T", " ") : "-"),
          isRead: Boolean(m.is_read),
        }));
        setMessages(mapped);
      }
    } catch (err) {
      console.error("Lỗi nạp tin nhắn hộp thư:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleMarkAllRead = async () => {
    try {
      await contentApi.markMessagesRead();
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      showToast(t.allReadSuccess);
    } catch {
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      showToast(t.allReadSuccess);
    }
  };

  const handleRefresh = () => {
    fetchMessages();
    showToast(t.refreshSuccess);
  };

  const toggleRead = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ff] via-[#f8fafc_40%] to-white flex justify-center select-none pb-12">
      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-4 pb-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-[10px] flex items-center justify-center shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:bg-white active:scale-95 transition-all cursor-pointer border-0"
          >
            <ChevronLeft className="w-[18px] h-[18px] text-[#333333]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#111827]">{t.title}</h1>
          <div className="w-9 h-9" />
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] px-4 py-2 bg-black/75 backdrop-blur-sm text-white text-[13.5px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
            {toastMsg}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between py-2.5">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="bg-[#f1f5f9] text-[#475569] text-[13px] font-medium rounded-[8px] px-3.5 py-1.5 hover:bg-[#e2e8f0] active:scale-95 transition-all cursor-pointer border-0"
          >
            {t.markAllRead}
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="bg-[#f1f5f9] text-[#475569] text-[13px] font-medium rounded-[8px] px-3.5 py-1.5 hover:bg-[#e2e8f0] active:scale-95 transition-all cursor-pointer border-0 flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#3b82f6]" : ""}`}
            />
            <span>{t.refresh}</span>
          </button>
        </div>

        {/* Message List */}
        <div className="flex flex-col gap-3 mt-1">
          {messages.length === 0 ? (
            <div className="bg-white rounded-[14px] p-8 text-center shadow-[0_4px_20px_rgba(15,23,42,0.06)] mt-4">
              <span className="text-[13.5px] text-[#9ca3af]">
                {t.emptyMessages}
              </span>
            </div>
          ) : (
            messages.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className="bg-white rounded-[14px] p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)] flex flex-col gap-2.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#3b82f6] shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <p className="text-[13.5px] text-[#1e293b] leading-relaxed font-normal flex-1">
                    {item.content}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#f8fafc]">
                  <span className="text-[11.5px] text-[#9ca3af]">
                    {item.date}
                  </span>
                  {item.isRead ? (
                    <span className="bg-[#f1f5f9] text-[#94a3b8] text-[11px] px-2 py-0.5 rounded-[4px] font-medium">
                      {t.read}
                    </span>
                  ) : (
                    <span className="bg-[#ef4444] text-white text-[11px] px-2 py-0.5 rounded-[4px] font-medium animate-pulse">
                      {t.unread}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function SpotlineSystemMessagePage() {
  return (
    <I18nProvider>
      <SpotlineSystemMessageContent />
    </I18nProvider>
  );
}
