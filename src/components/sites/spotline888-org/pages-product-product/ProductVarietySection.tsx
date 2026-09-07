"use client";

import React from "react";
import Image from "next/image";
import { ProductTranslations } from "./productI18n";

export interface CryptoItem {
  id: number;
  code: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  icon: string;
}

export const PRODUCT_CRYPTO_LIST: CryptoItem[] = [
  {
    id: 340,
    code: "BTC",
    name: "BTC/USDT",
    price: "66343.07000000",
    change: "-0.76%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_btc.png",
  },
  {
    id: 349,
    code: "TRX",
    name: "TRX/USDT",
    price: "0.28153100",
    change: "-0.02%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_trx.png",
  },
  {
    id: 347,
    code: "DOT",
    name: "DOT/USDT",
    price: "1.51630000",
    change: "-2.26%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_dot.png",
  },
  {
    id: 348,
    code: "LINK",
    name: "LINK/USDT",
    price: "8.70000000",
    change: "-2.44%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_link.png",
  },
  {
    id: 343,
    code: "BCH",
    name: "BCH/USDT",
    price: "438.43000000",
    change: "-2.06%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_bch.png",
  },
  {
    id: 345,
    code: "ETC",
    name: "ETC/USDT",
    price: "8.54790000",
    change: "-1.00%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_etc.png",
  },
  {
    id: 346,
    code: "DOGE",
    name: "DOGE/USDT",
    price: "0.09198900",
    change: "-2.03%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_doge.png",
  },
  {
    id: 341,
    code: "ETH",
    name: "ETH/USDT",
    price: "1947.37000000",
    change: "-2.31%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_eth.png",
  },
  {
    id: 350,
    code: "ADA",
    name: "ADA/USDT",
    price: "0.27206100",
    change: "-2.96%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_ada.png",
  },
  {
    id: 351,
    code: "FIL",
    name: "FIL/USDT",
    price: "0.97500000",
    change: "-0.29%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_fil.png",
  },
  {
    id: 342,
    code: "LTC",
    name: "LTC/USDT",
    price: "53.38000000",
    change: "-1.64%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_ltc.png",
  },
  {
    id: 352,
    code: "DCR",
    name: "DCR/USDT",
    price: "26.55100000",
    change: "-6.05%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_dcr.png",
  },
  {
    id: 353,
    code: "IOTA",
    name: "IOTA/USDT",
    price: "0.06600000",
    change: "-1.64%",
    isUp: false,
    icon: "/sites/spotline888-org/pages-index-index/coin_iota.png",
  },
];

interface ProductVarietySectionProps {
  t: ProductTranslations;
}

export const ProductVarietySection: React.FC<ProductVarietySectionProps> = ({ t }) => {
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
        {PRODUCT_CRYPTO_LIST.map((item) => {
          const isUp = item.isUp || item.change.startsWith("+");

          return (
            <div
              key={item.id}
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
