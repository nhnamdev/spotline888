"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const BANNERS = [
  "/sites/spotline888-org/pages-index-index/banner_0.jpg",
  "/sites/spotline888-org/pages-index-index/banner_1.jpg",
  "/sites/spotline888-org/pages-index-index/banner_2.jpg",
  "/sites/spotline888-org/pages-index-index/banner_3.jpg",
  "/sites/spotline888-org/pages-index-index/banner_4.jpg",
  "/sites/spotline888-org/pages-index-index/banner_5.jpg",
];

export const IndexBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 pt-1 select-none">
      <div className="relative h-[110px] w-full rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(15,23,42,0.12)] bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
        {/* Banner slides */}
        {BANNERS.map((banner, index) => (
          <div
            key={banner}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={banner}
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
          {BANNERS.map((_, index) => (
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
