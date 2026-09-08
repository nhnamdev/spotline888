"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IndexTranslations } from "./indexI18n";

interface IndexCryptoListProps {
  t: IndexTranslations;
}

interface CryptoItem {
  code: string;
  name: string;
  price: string;
  change: string;
  isUp?: boolean;
  icon: string;
}

const CRYPTO_DATA: CryptoItem[] = [
  {
    code: "BTC",
    name: "BTC/USDT",
    price: "66343.07000000",
    change: "-0.76%",
    icon: "/sites/spotline888-org/pages-index-index/coin_btc.png",
  },
  {
    code: "TRX",
    name: "TRX/USDT",
    price: "0.28153100",
    change: "-0.02%",
    icon: "/sites/spotline888-org/pages-index-index/coin_trx.png",
  },
  {
    code: "DOT",
    name: "DOT/USDT",
    price: "1.51630000",
    change: "-2.26%",
    icon: "/sites/spotline888-org/pages-index-index/coin_dot.png",
  },
  {
    code: "LINK",
    name: "LINK/USDT",
    price: "8.70000000",
    change: "-2.44%",
    icon: "/sites/spotline888-org/pages-index-index/coin_link.png",
  },
  {
    code: "BCH",
    name: "BCH/USDT",
    price: "438.43000000",
    change: "-2.06%",
    icon: "/sites/spotline888-org/pages-index-index/coin_bch.png",
  },
  {
    code: "ETC",
    name: "ETC/USDT",
    price: "8.54790000",
    change: "-1%",
    icon: "/sites/spotline888-org/pages-index-index/coin_etc.png",
  },
  {
    code: "DOGE",
    name: "DOGE/USDT",
    price: "0.09198900",
    change: "-2.03%",
    icon: "/sites/spotline888-org/pages-index-index/coin_doge.png",
  },
  {
    code: "ETH",
    name: "ETH/USDT",
    price: "1947.37000000",
    change: "-2.31%",
    icon: "/sites/spotline888-org/pages-index-index/coin_eth.png",
  },
  {
    code: "ADA",
    name: "ADA/USDT",
    price: "0.27206100",
    change: "-2.96%",
    icon: "/sites/spotline888-org/pages-index-index/coin_ada.png",
  },
  {
    code: "FIL",
    name: "FIL/USDT",
    price: "0.97500000",
    change: "-0.29%",
    icon: "/sites/spotline888-org/pages-index-index/coin_fil.png",
  },
  {
    code: "LTC",
    name: "LTC/USDT",
    price: "53.38000000",
    change: "-1.64%",
    icon: "/sites/spotline888-org/pages-index-index/coin_ltc.png",
  },
  {
    code: "DCR",
    name: "DCR/USDT",
    price: "26.55100000",
    change: "-6.05%",
    icon: "/sites/spotline888-org/pages-index-index/coin_dcr.png",
  },
  {
    code: "IOTA",
    name: "IOTA/USDT",
    price: "0.06600000",
    change: "-1.64%",
    icon: "/sites/spotline888-org/pages-index-index/coin_iota.png",
  },
];

export const IndexCryptoList: React.FC<IndexCryptoListProps> = ({ t }) => {
  const router = useRouter();

  return (
    <div className="mt-3.5 select-none">
      {/* Section Title */}
      <h2 className="px-4 text-[14px] font-bold text-[#111827] mb-1.5">
        {t.futureProducts}
      </h2>

      {/* Crypto List Card */}
      <div className="mx-4 bg-white rounded-[8px] shadow-[0_3px_8px_rgba(15,23,42,0.08)] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center px-4 py-2 text-[11px] text-[#707a8a] border-b border-gray-100/60">
          <span className="flex-1 text-left">{t.name}</span>
          <span className="flex-1 text-right pr-4">{t.latestPrice}</span>
          <span className="w-[72px] text-right">{t.change24h}</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#f2f2f2]">
          {CRYPTO_DATA.map((item) => {
            const isPositive = item.isUp || item.change.startsWith("+");

            return (
              <div
                key={item.name}
                onClick={() =>
                  router.push(
                    `/pages/Detail/Detail?id=1&codename=${encodeURIComponent(
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
