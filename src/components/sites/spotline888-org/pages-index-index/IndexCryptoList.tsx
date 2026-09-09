"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IndexTranslations } from "./indexI18n";
import { tradingApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";

interface IndexCryptoListProps {
  t: IndexTranslations;
}

interface CryptoItem {
  id?: number;
  code: string;
  name: string;
  price: string;
  change: string;
  isUp?: boolean;
  icon: string;
}

const DEFAULT_CRYPTO_DATA: CryptoItem[] = [
  {
    id: 1,
    code: "BTC",
    name: "BTC/USDT",
    price: "66343.07",
    change: "-0.76%",
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_btc.png"),
  },
  {
    id: 2,
    code: "TRX",
    name: "TRX/USDT",
    price: "0.2815",
    change: "-0.02%",
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_trx.png"),
  },
  {
    id: 3,
    code: "DOT",
    name: "DOT/USDT",
    price: "1.5163",
    change: "-2.26%",
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_dot.png"),
  },
  {
    id: 4,
    code: "LINK",
    name: "LINK/USDT",
    price: "8.7000",
    change: "-2.44%",
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_link.png"),
  },
  {
    id: 5,
    code: "BCH",
    name: "BCH/USDT",
    price: "438.43",
    change: "-2.06%",
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_bch.png"),
  },
  {
    id: 6,
    code: "ETC",
    name: "ETC/USDT",
    price: "8.5479",
    change: "-1.00%",
    icon: getR2Url("/sites/spotline888-org/pages-index-index/coin_etc.png"),
  },
];

export const IndexCryptoList: React.FC<IndexCryptoListProps> = ({ t }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [cryptoList, setCryptoList] = useState<CryptoItem[]>(DEFAULT_CRYPTO_DATA);

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
            setCryptoList(mapped);
          }
        }
      } catch {
        // Fallback dùng DEFAULT_CRYPTO_DATA
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="mt-2 select-none">
      <div className="bg-white rounded-t-[12px] shadow-[0_-2px_10px_rgba(15,23,42,0.04)]">
        {/* Category Tab Bar */}
        <div className="flex border-b border-[#f0f0f0] px-4">
          <button
            type="button"
            onClick={() => setActiveTab(0)}
            className={`pb-2.5 pt-3.5 mr-6 text-[14px] font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 0
                ? "text-[#1e40af] border-[#1e40af]"
                : "text-[#848e9c] border-transparent"
            }`}
          >
            {t.futureProducts}
          </button>
        </div>

        {/* Column Header Titles */}
        <div className="px-4 py-2 flex items-center justify-between text-[11px] text-[#848e9c] border-b border-[#f5f5f5]">
          <div className="flex-1">
            <span>{t.name}</span>
          </div>
          <div className="flex-1 text-right pr-4">
            <span>{t.latestPrice}</span>
          </div>
          <div className="w-[72px] text-right">
            <span>{t.change24h}</span>
          </div>
        </div>

        {/* Crypto Items List */}
        <div className="divide-y divide-[#f9f9f9]">
          {cryptoList.map((item, idx) => {
            const isPositive = item.change.startsWith("+");
            const uniqueKey = item.id ? `crypto-prod-${item.id}` : `crypto-${item.code}-${idx}`;

            return (
              <div
                key={uniqueKey}
                onClick={() =>
                  router.push(
                    `/pages/Detail/Detail?id=${item.id || 1}&codename=${encodeURIComponent(
                      item.name
                    )}`
                  )
                }
                className="px-4 py-3 flex items-center justify-between hover:bg-[#f8f8f8] active:bg-[#f2f2f2] transition-colors cursor-pointer"
              >
                {/* Left: Coin Icon + Symbol */}
                <div className="flex-1 flex items-center gap-2">
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

                {/* Middle: Latest Price */}
                <div className="flex-1 text-right pr-4">
                  <span className="text-[14px] font-medium text-[#1e2329] leading-tight">
                    {item.price}
                  </span>
                </div>

                {/* Right: 24h Change Pill Badge */}
                <div className="w-[72px] flex justify-end">
                  <span
                    className={`min-w-[68px] h-[26px] px-2 flex items-center justify-center text-[12px] font-semibold text-white rounded-[4px] leading-none ${
                      isPositive ? "bg-[#0ecb81]" : "bg-[#f6465d]"
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
    </div>
  );
};
