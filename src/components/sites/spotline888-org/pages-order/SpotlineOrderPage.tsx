"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { ORDER_TRANSLATIONS } from "./orderI18n";
import { IndexTabBar } from "../pages-index-index/IndexTabBar";
import { INDEX_TRANSLATIONS } from "../pages-index-index/indexI18n";
import { tradingApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";

interface OrderItem {
  id: string;
  symbol: string;
  direction: "buy" | "sell";
  openPrice: string;
  closePrice?: string;
  amount: string;
  profit: string;
  fee: string;
  time: string;
  status: "holding" | "settled";
}

function SpotlineOrderContent() {
  const router = useRouter();
  const { currentLang } = useI18n();
  const t = ORDER_TRANSLATIONS[currentLang] || ORDER_TRANSLATIONS["zh-CN"];
  const tIndex = INDEX_TRANSLATIONS[currentLang] || INDEX_TRANSLATIONS["zh-CN"];

  const [activeSubTab, setActiveSubTab] = useState<"holding" | "closed">("holding");
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await tradingApi.getMyOrders("all", 1, 50);
        if (res.code === 1 && Array.isArray(res.data?.rows || res.data?.list || res.data)) {
          const raw = res.data?.rows || res.data?.list || res.data;
          const mapped: OrderItem[] = raw.map((o: any) => ({
            id: String(o.order_sn || o.id),
            symbol: o.symbol || "BTC/USDT",
            direction: o.ostyle === "buy_up" ? "buy" : "sell",
            openPrice: parseFloat(o.buy_price || "0").toFixed(2),
            closePrice: o.sell_price ? parseFloat(o.sell_price).toFixed(2) : undefined,
            amount: parseFloat(o.money || "0").toFixed(2),
            profit: o.status === "settled" ? (o.is_win === 1 ? `+${(parseFloat(o.money || "0") * 0.85).toFixed(2)}` : `-${parseFloat(o.money || "0").toFixed(2)}`) : "0.00",
            fee: "0.00",
            time: o.created_at ? new Date(o.created_at).toLocaleString("vi-VN") : "",
            status: o.status === "open" ? "holding" : "settled",
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.error("Lỗi tải đơn cược:", err);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) =>
    activeSubTab === "holding" ? o.status === "holding" : o.status === "settled"
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center select-none pb-[65px]">
      <div className="w-full max-w-[480px] min-h-screen bg-[#f8fafc] flex flex-col relative shadow-sm">
        {/* Top Header */}
        <div className="bg-white flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all cursor-pointer border-0"
          >
            <ChevronLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <h1 className="text-[17px] font-bold text-[#111827]">{t.title}</h1>
          <div className="w-8 h-8" />
        </div>

        {/* Subtabs: 持仓列表 & 平仓记录 */}
        <div className="bg-white flex items-center justify-around border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <button
            type="button"
            onClick={() => setActiveSubTab("holding")}
            className={`flex-1 py-3 text-[15px] font-medium transition-all relative text-center border-0 bg-transparent cursor-pointer ${
              activeSubTab === "holding"
                ? "text-[#111827] font-bold"
                : "text-[#9ca3af]"
            }`}
          >
            <span>{t.tabHolding}</span>
            {activeSubTab === "holding" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#2563eb] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("closed")}
            className={`flex-1 py-3 text-[15px] font-medium transition-all relative text-center border-0 bg-transparent cursor-pointer ${
              activeSubTab === "closed"
                ? "text-[#111827] font-bold"
                : "text-[#9ca3af]"
            }`}
          >
            <span>{t.tabClosed}</span>
            {activeSubTab === "closed" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#2563eb] rounded-full" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[400px]">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="w-[140px] h-[140px] relative">
                <Image
                  src={getR2Url("/sites/spotline888-org/pages-order/order_empty.png")}
                  alt="Empty"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-[14px] text-[#9ca3af] tracking-wide mt-2 font-normal">
                {t.emptyRecords}
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              {filteredOrders.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[12px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#1e293b]">
                      {item.symbol}
                    </span>
                    <span
                      className={`text-[12px] px-2 py-0.5 rounded font-medium ${
                        item.direction === "buy"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {item.direction === "buy" ? t.buyLong : t.buyShort}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12.5px] text-[#64748b] pt-1">
                    <div>
                      {t.openPrice}:{" "}
                      <span className="text-[#1e293b] font-medium">
                        {item.openPrice}
                      </span>
                    </div>
                    <div>
                      {t.amount}:{" "}
                      <span className="text-[#1e293b] font-medium">
                        {item.amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reusable IndexTabBar */}
        <IndexTabBar
          t={tIndex}
          activeTab=""
          onTabChange={(tab) => {
            const targetHash =
              tab === "products"
                ? "#/pages/product/product"
                : tab === "balance"
                ? "#/pages/money/money"
                : tab === "mine"
                ? "#/pages/user/user"
                : "#/pages/index/index";

            if (typeof window !== "undefined") {
              window.location.href = "/" + targetHash;
            }
          }}
        />
      </div>
    </div>
  );
}

export default function SpotlineOrderPage() {
  return (
    <I18nProvider>
      <SpotlineOrderContent />
    </I18nProvider>
  );
}
