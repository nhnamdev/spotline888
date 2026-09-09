"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductTranslations } from "./productI18n";
import { tradingApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";

export interface CryptoItem {
  id: number;
  code: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  icon: string;
}

export const DEFAULT_PRODUCT_LIST: CryptoItem[] = [
  {
    id: 1,
    code: "BTC",
    name: "BTC/USDT",
    price: "66343.07",
    change: "-0.76%",
    isUp: false,
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_btc.png"),
  },
  {
    id: 2,
    code: "TRX",
    name: "TRX/USDT",
    price: "0.2815",
    change: "-0.02%",
    isUp: false,
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_trx.png"),
  },
  {
    id: 3,
    code: "DOT",
    name: "DOT/USDT",
    price: "1.5163",
    change: "-2.26%",
    isUp: false,
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_dot.png"),
  },
  {
    id: 4,
    code: "LINK",
    name: "LINK/USDT",
    price: "8.7000",
    change: "-2.44%",
    isUp: false,
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_link.png"),
  },
  {
    id: 5,
    code: "BCH",
    name: "BCH/USDT",
    price: "438.43",
    change: "-2.06%",
    isUp: false,
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_bch.png"),
  },
  {
    id: 6,
    code: "ETC",
    name: "ETC/USDT",
    price: "8.5479",
    change: "-1.00%",
    isUp: false,
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_etc.png"),
  },
];

interface ProductVarietySectionProps {
  t: ProductTranslations;
}

export const ProductVarietySection: React.FC<ProductVarietySectionProps> = ({ t }) => {
  const router = useRouter();
  const [products, setProducts] = useState<CryptoItem[]>(DEFAULT_PRODUCT_LIST);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await tradingApi.getProducts();
        if (res.code === 1 && Array.isArray(res.data) && res.data.length > 0) {
          const seen = new Set<string>();
          const mapped: CryptoItem[] = [];
          for (const item of res.data) {
            const rawPrice = parseFloat(item.price) || 0;
            const formattedPrice = rawPrice > 100 ? rawPrice.toFixed(2) : rawPrice.toFixed(4);
            const changeStr = item.change || (Math.random() > 0.5 ? "+0.85%" : "-0.76%");
            const name = item.code.includes("/") ? item.code : `${item.code}/USDT`;
            const uniqueKey = item.id ? `id-${item.id}` : `code-${name}`;

            if (seen.has(uniqueKey)) continue;
            seen.add(uniqueKey);

            mapped.push({
              id: item.id,
              code: item.code.split("/")[0] || item.code,
              name,
              price: formattedPrice,
              change: changeStr,
              isUp: changeStr.startsWith("+"),
              icon: getR2Url(item.image || "/sites/spotline888-org/pages-index-index/coin_btc.png"),
            });
          }
          if (mapped.length > 0) {
            setProducts(mapped);
          }
        }
      } catch {
        // Fallback dùng DEFAULT_PRODUCT_LIST
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="relative pb-[50px] bg-white select-none">
      {/* Section Title */}
      <div className="text-[15px] font-bold text-[#1e2329] px-[15px] pt-[10px] pb-[3px] bg-white">
        {t.futureProducts}
      </div>

      {/* Classify / Header Row */}
      <div className="text-[#707a8a] text-[11px] flex items-center px-[15px] py-[8px] bg-white">
        <span className="flex-1 text-left">{t.name}</span>
        <span className="flex-1 text-right pr-[10px]">{t.latestPrice}</span>
        <span className="w-[90px] text-right">{t.change24h}</span>
      </div>

      {/* Variety Content List */}
      <div className="flex flex-col bg-white">
        {products.map((item, idx) => {
          const isUp = item.isUp || item.change.startsWith("+");
          const uniqueKey = item.id ? `variety-prod-${item.id}` : `variety-${item.code}-${idx}`;

          return (
            <div
              key={uniqueKey}
              onClick={() =>
                router.push(
                  `/pages/Detail/Detail?id=${item.id}&codename=${encodeURIComponent(
                    item.name
                  )}`
                )
              }
              className="w-full px-[15px] py-[12px] flex items-center border-b border-[#f2f2f2] hover:bg-[#f8f8f8] active:bg-[#f2f2f2] transition-colors cursor-pointer"
            >
              {/* Left Column: Coin Icon + Name */}
              <div className="flex-1 flex items-center gap-[8px]">
                <div className="w-[26px] h-[26px] shrink-0 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={26}
                    height={26}
                    className="w-[26px] h-[26px] rounded-full object-contain"
                  />
                </div>
                <span className="text-[14px] font-semibold text-[#1e2329] leading-tight">
                  {item.name}
                </span>
              </div>

              {/* Middle Column: Price */}
              <div className="flex-1 text-right pr-[10px]">
                <span className="text-[14px] font-medium text-[#1e2329] leading-tight">
                  {item.price}
                </span>
              </div>

              {/* Right Column: 24h Change Badge */}
              <div className="w-[90px] flex justify-end">
                <span
                  className={`inline-block text-[12px] font-semibold text-white py-[4px] px-[10px] rounded-[4px] min-w-[70px] text-center leading-none ${
                    isUp ? "bg-[#0ecb81]" : "bg-[#f6465d]"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
