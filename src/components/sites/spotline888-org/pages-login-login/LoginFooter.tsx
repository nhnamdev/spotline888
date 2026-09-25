"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "./i18n";
import { contentApi } from "@/lib/api";

export const LoginFooter: React.FC = () => {
  const { t } = useI18n();
  const [kefuUrl, setKefuUrl] = useState("https://wa.me/6287844562370?name=&id=0");

  useEffect(() => {
    async function loadKefu() {
      try {
        const res = await contentApi.getPublicConfig();
        if (res.code === 1 && res.data?.kefu_url) {
          setKefuUrl(res.data.kefu_url);
        }
      } catch {
        // Fallback
      }
    }
    loadKefu();
  }, []);

  return (
    <footer className="pt-[30px] px-5 pb-8 flex flex-col items-center">
      <div className="flex items-center gap-3">
        {/* Register link */}
        <Link
          href="/register"
          className="text-[13.5px] text-[#3b82f6] font-semibold hover:underline cursor-pointer"
        >
          {t.registerNow}
        </Link>

        {/* Vertical divider */}
        <div className="w-[1px] h-[14px] bg-[#d1d5db]" />

        {/* Online customer service via WhatsApp */}
        <a
          href={kefuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13.5px] text-[#3b82f6] font-semibold hover:underline cursor-pointer"
        >
          {t.onlineService}
        </a>
      </div>
    </footer>
  );
};
