"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getR2Url } from "@/lib/r2";
import { FortradeLogo } from "@/components/ui/FortradeLogo";

interface IndexHeaderProps {
  onOpenLang: () => void;
}

export const IndexHeader: React.FC<IndexHeaderProps> = ({ onOpenLang }) => {
  return (
    <header className="px-4 pt-1.5 pb-1 flex items-center justify-between h-10 select-none">
      {/* Brand Logo */}
      <Link href="/#/pages/index/index" className="flex items-center" aria-label="Fortrade">
        <FortradeLogo width={92} height={26} textColor="#111827" />
      </Link>

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
