"use client";

import React from "react";
import Image from "next/image";
import { useI18n } from "./registerI18n";

export const RegisterLogo: React.FC = () => {
  const { t } = useI18n();

  return (
    <div>
      {/* SPOT Logo */}
      <div className="px-5 pt-2">
        <Image
          src="/sites/spotline888-org/pages-login-login/logo.png"
          alt="SPOT"
          width={80}
          height={28}
          className="w-[80px] h-[28px] object-contain"
          priority
        />
      </div>

      {/* Page Title */}
      <h1 className="px-5 pt-4 text-[26px] font-extrabold text-[#111827] tracking-[0.5px] leading-tight">
        {t.title}
      </h1>
    </div>
  );
};
