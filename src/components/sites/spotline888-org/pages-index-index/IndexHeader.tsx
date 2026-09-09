"use client";

import React from "react";
import Image from "next/image";
import { getR2Url } from "@/lib/r2";

interface IndexHeaderProps {
  onOpenLang: () => void;
}

export const IndexHeader: React.FC<IndexHeaderProps> = ({ onOpenLang }) => {
  return (
    <header className="px-4 pt-1.5 pb-1 flex items-center justify-between h-10 select-none">
      {/* Brand Logo */}
      <div className="w-[75px] h-[30px] flex items-center">
        <Image
          src={getR2Url("/sites/spotline888-org/pages-login-login/logo.png")}
          alt="SPOT"
          width={75}
          height={30}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Circular Language Button */}
      <button
        type="button"
        onClick={onOpenLang}
        aria-label="Language Switcher"
        className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_3px_8px_rgba(15,23,42,0.18)] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer border-0"
      >
        <Image
          src={getR2Url("/sites/spotline888-org/pages-login-login/lang_icon.png")}
          alt="Language"
          width={17}
          height={17}
          className="w-[17px] h-[17px] object-contain"
        />
      </button>
    </header>
  );
};
