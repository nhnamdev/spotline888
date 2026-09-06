"use client";

import React from "react";
import Image from "next/image";
import { useI18n } from "./i18n";

export const LoginLogo: React.FC = () => {
  const { t } = useI18n();

  return (
    <div>
      {/* SPOT Logo */}
      <div className="px-5 pt-3">
        <Image
          src="/sites/spotline888-org/pages-login-login/logo.png"
          alt="SPOT"
          width={90}
          height={32}
          className="w-[90px] h-[32px] object-contain"
          priority
        />
      </div>

      {/* Page Title */}
      <h1 className="px-5 pt-6 text-[28px] font-extrabold text-[#111827] tracking-[0.5px] leading-tight">
        {t.title}
      </h1>
    </div>
  );
};
