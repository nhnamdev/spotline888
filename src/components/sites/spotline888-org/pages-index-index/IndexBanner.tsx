"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { contentApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";

const DEFAULT_BANNERS = [
  getR2Url("/sites/spotline888-org/pages-index-index/banner_0.jpg"),
  getR2Url("/sites/spotline888-org/pages-index-index/banner_1.jpg"),
  getR2Url("/sites/spotline888-org/pages-index-index/banner_2.jpg"),
  getR2Url("/sites/spotline888-org/pages-index-index/banner_3.jpg"),
  getR2Url("/sites/spotline888-org/pages-index-index/banner_4.jpg"),
  getR2Url("/sites/spotline888-org/pages-index-index/banner_5.jpg"),
];

export const IndexBanner: React.FC = () => {
  const [banners, setBanners] = useState<string[]>(DEFAULT_BANNERS);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Tải banners động từ CSDL qua API
    async function loadBanners() {
      try {
        const res = await contentApi.getBanners();
        if (res.code === 1 && Array.isArray(res.data) && res.data.length > 0) {
          const bannerUrls = res.data.map((item: any) => item.image || item.url).filter(Boolean);
          if (bannerUrls.length > 0) {
            setBanners(bannerUrls);
          }
        }
      } catch {
        // Fallback giữ nguyên DEFAULT_BANNERS
      }
    }
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="px-4 pt-1 select-none">
      <div className="relative h-[110px] w-full rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(15,23,42,0.12)] bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
        {/* Banner slides */}
        {banners.map((banner, index) => (
          <div
            key={`${banner}-${index}`}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={getR2Url(banner)}
              alt={`Banner ${index + 1}`}
              fill
              sizes="(max-width: 480px) 100vw, 480px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Dot Indicators */}
        <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center items-center gap-1.5 pointer-events-none">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-white scale-110"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
