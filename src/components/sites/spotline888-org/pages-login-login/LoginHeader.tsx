"use client";

import React from "react";
import Image from "next/image";
import { getR2Url } from "@/lib/r2";

interface LoginHeaderProps {
  onOpenLang: () => void;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ onOpenLang }) => {
  return (
    <header className="flex items-center justify-between px-4 pt-2.5 pb-2.5">
      {/* Left balance placeholder */}
      <div className="w-9 h-9" />

      {/* Language Switcher Button */}
      <button
        type="button"
        onClick={onOpenLang}
        aria-label="Language Switcher"
        className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-[10px] flex items-center justify-center shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:bg-white active:scale-95 transition-all cursor-pointer border-0"
      >
        <Image
          src={getR2Url("/sites/spotline888-org/pages-login-login/lang_icon.png")}
          alt="Language"
          width={18}
          height={18}
          className="w-[18px] h-[18px] object-contain select-none"
          priority
        />
      </button>
    </header>
  );
};
