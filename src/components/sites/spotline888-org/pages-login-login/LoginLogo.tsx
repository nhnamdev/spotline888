"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "./i18n";
import { FortradeLogo } from "@/components/ui/FortradeLogo";

export const LoginLogo: React.FC = () => {
  const { t } = useI18n();

  return (
    <div>
      {/* Fortrade Logo */}
      <div className="px-5 pt-3">
        <Link href="/#/pages/index/index" className="inline-block" aria-label="Fortrade">
          <FortradeLogo width={110} height={31} textColor="#111827" />
        </Link>
      </div>

      {/* Page Title */}
      <h1 className="px-5 pt-6 text-[28px] font-extrabold text-[#111827] tracking-[0.5px] leading-tight">
        {t.title}
      </h1>
    </div>
  );
};
