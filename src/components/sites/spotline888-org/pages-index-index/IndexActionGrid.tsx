"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IndexTranslations } from "./indexI18n";

interface IndexActionGridProps {
  t: IndexTranslations;
}

export const IndexActionGrid: React.FC<IndexActionGridProps> = ({ t }) => {
  const router = useRouter();

  const items = [
    {
      title: t.withdraw,
      icon: "/sites/spotline888-org/pages-index-index/menu_withdraw.png",
      href: "/pages/withdraw-money/withdraw-money",
    },
    {
      title: t.deposit,
      icon: "/sites/spotline888-org/pages-index-index/menu_deposit.png",
      href: "/pages/customer-service/customer-service",
    },
    {
      title: t.customerService,
      icon: "/sites/spotline888-org/pages-index-index/kefu.png",
      href: "/pages/customer-service/customer-service",
    },
    {
      title: t.trade,
      icon: "/sites/spotline888-org/pages-index-index/menu_trade.png",
      href: "/pages/order/order",
    },
    {
      title: t.systemMessage,
      icon: "/sites/spotline888-org/pages-index-index/menu_messages.png",
      badge: "1",
      href: "/pages/system-message/system-message",
    },
    {
      title: t.aboutUs,
      icon: "/sites/spotline888-org/pages-index-index/menu_about.png",
      href: "/pages/yinsi/gy",
    },
  ];

  const handleClick = (item: (typeof items)[0]) => {
    router.push(item.href);
  };

  return (
    <div className="px-1 mt-2 mb-1.5 flex flex-wrap justify-between select-none">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="w-1/3 mt-1.5 flex justify-center"
          onClick={() => handleClick(item)}
        >
          <div className="w-[93px] h-[50px] rounded-[9px] bg-white shadow-[0_3px_8px_rgba(15,23,42,0.08)] flex flex-col items-center justify-center relative cursor-pointer active:scale-95 transition-transform">
            {/* Action Icon with optional badge */}
            <div className="relative flex items-center justify-center">
              <Image
                src={item.icon}
                alt={item.title}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />

              {item.badge && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#ff4b5c] text-white rounded-full min-w-[15px] h-[15px] flex items-center justify-center text-[10px] px-0.5 shadow-[0_2px_5px_rgba(248,113,113,0.6)] font-semibold leading-none">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Action Title */}
            <span className="mt-1 text-[10px] text-[#111827] text-center whitespace-nowrap leading-none font-normal">
              {item.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
