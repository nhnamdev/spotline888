"use client";

import React, { useEffect } from "react";
import { LANGUAGES, LanguageCode, useI18n } from "./i18n";

interface LanguageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageDrawer: React.FC<LanguageDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentLang, setLang, t } = useI18n();

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (code: LanguageCode) => {
    setLang(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-up Drawer */}
      <div className="fixed bottom-0 w-full max-w-[480px] bg-white rounded-t-[20px] pt-5 pb-8 z-[1001] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 animate-in slide-in-from-bottom">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <span className="text-[16px] font-extrabold text-[#222222]">
            {t.langSetting}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[14px] text-[#a8a9ac] hover:text-[#666666] cursor-pointer bg-transparent border-0 py-1"
          >
            {t.cancel}
          </button>
        </div>

        {/* Language Options List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {LANGUAGES.map((item) => {
            const isActive = currentLang === item.value;
            return (
              <div
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className={`h-[50px] flex items-center px-5 text-[14px] cursor-pointer transition-colors ${
                  isActive
                    ? "bg-[#f3f5f6] text-[#1150c2] font-semibold"
                    : "text-[#222222] hover:bg-[#fafafa]"
                }`}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
