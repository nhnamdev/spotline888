"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle2,
} from "lucide-react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { DETAIL_TRANSLATIONS } from "./detailI18n";
import { tradingApi, authApi } from "@/lib/api";

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ActiveTrade {
  id: string;
  symbol: string;
  direction: "long" | "short";
  amount: number;
  entryPrice: number;
  duration: number; // seconds
  remaining: number; // seconds left
  yieldRate: number;
  status: "trading" | "win" | "loss";
}

function generateCandles(basePrice: number, count: number): Candle[] {
  const candles: Candle[] = [];
  let current = basePrice;
  const now = Date.now();

  for (let i = count; i >= 0; i--) {
    const timeStr = new Date(now - i * 5 * 60 * 1000)
      .toTimeString()
      .slice(0, 5);
    const change = (Math.random() - 0.48) * (basePrice * 0.0035);
    const open = current;
    const close = Math.max(10, open + change);
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.0018);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.0018);
    const volume = Math.floor(20 + Math.random() * 80);

    candles.push({
      time: timeStr,
      open,
      high,
      low,
      close,
      volume,
    });
    current = close;
  }
  return candles;
}

function SpotlineDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLang } = useI18n();
  const t = DETAIL_TRANSLATIONS[currentLang] || DETAIL_TRANSLATIONS["zh-CN"];

  const codenameParam = searchParams.get("codename") || "BTC/USDT";
  const [selectedTimeframe, setSelectedTimeframe] = useState("5m");
  const [activeSubTab, setActiveSubTab] = useState<"trading" | "closed">("trading");

  const [basePrice, setBasePrice] = useState(() => {
    if (codenameParam.toUpperCase().includes("ETH")) return 3480.5;
    if (codenameParam.toUpperCase().includes("SOL")) return 148.2;
    if (codenameParam.toUpperCase().includes("DOGE")) return 0.142;
    return 71320.72;
  });

  const [candles, setCandles] = useState<Candle[]>(() =>
    generateCandles(basePrice, 32)
  );

  // Order modal state
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderDirection, setOrderDirection] = useState<"long" | "short">("long");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [investAmount, setInvestAmount] = useState("100");
  const [userBalance, setUserBalance] = useState(2429.0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Active trades state
  const [trades, setTrades] = useState<ActiveTrade[]>([]);

  // Tải nến K-line thật và số dư thật từ MySQL CSDL
  useEffect(() => {
    async function loadLiveDetailData() {
      try {
        const [klineRes, profRes, ordersRes] = await Promise.all([
          tradingApi.getKline(codenameParam, selectedTimeframe),
          authApi.getProfile(),
          tradingApi.getMyOrders("all", 1, 20),
        ]);

        if (klineRes.code === 1 && klineRes.data?.candles?.length > 0) {
          setCandles(klineRes.data.candles);
          if (klineRes.data.current_price) {
            setBasePrice(klineRes.data.current_price);
          }
        }

        if (profRes.code === 1 && profRes.data?.money) {
          setUserBalance(parseFloat(profRes.data.money));
        }

        if (ordersRes.code === 1 && Array.isArray(ordersRes.data?.rows || ordersRes.data?.list || ordersRes.data)) {
          const rawOrders = ordersRes.data?.rows || ordersRes.data?.list || ordersRes.data;
          const mappedOrders: ActiveTrade[] = rawOrders.map((o: any) => ({
            id: String(o.id || o.order_sn),
            symbol: o.symbol || codenameParam,
            direction: o.ostyle === "buy_up" ? "long" : "short",
            amount: parseFloat(o.money || o.amount || "0"),
            entryPrice: parseFloat(o.buy_price || "0") || basePrice,
            duration: Number(o.second || 60),
            remaining: Math.max(0, Math.floor(((new Date(o.settle_time || o.created_at).getTime() + (Number(o.second || 60) * 1000)) - Date.now()) / 1000)),
            yieldRate: parseFloat(o.yield_rate || "85") / 100,
            status: o.status === "open" ? "trading" : (o.is_win === 1 ? "win" : "loss"),
          }));
          if (mappedOrders.length > 0) {
            setTrades(mappedOrders);
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ kline và số dư:", err);
      }
    }

    loadLiveDetailData();
  }, [codenameParam, selectedTimeframe]);

  // Periodically fluctuate current price
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const delta = (Math.random() - 0.49) * (last.close * 0.0006);
        const newClose = Number((last.close + delta).toFixed(2));
        const newHigh = Math.max(last.high, newClose);
        const newLow = Math.min(last.low, newClose);

        setBasePrice(newClose);

        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          close: newClose,
          high: newHigh,
          low: newLow,
        };
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer for active trades
  useEffect(() => {
    const timer = setInterval(() => {
      setTrades((prev) =>
        prev.map((trade) => {
          if (trade.status !== "trading") return trade;
          if (trade.remaining <= 1) {
            const isWin =
              trade.direction === "long"
                ? basePrice >= trade.entryPrice
                : basePrice <= trade.entryPrice;
            return {
              ...trade,
              remaining: 0,
              status: isWin ? "win" : "loss",
            };
          }
          return { ...trade, remaining: trade.remaining - 1 };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [basePrice]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Re-generate chart on timeframe switch
  const handleTimeframeChange = (tf: string) => {
    setSelectedTimeframe(tf);
    setCandles(generateCandles(basePrice, 32));
  };

  // Calculations for Candlestick Chart SVG
  const chartHeight = 220;
  const chartWidth = 460;
  const candlePadding = 4;
  const candleWidth = Math.max(
    4,
    (chartWidth - 50) / candles.length - candlePadding
  );

  const { minPrice, maxPrice, maPoints } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });
    const padding = (max - min) * 0.08 || 1;
    min -= padding;
    max += padding;

    // 5-period MA
    const ma = candles.map((c, idx) => {
      const slice = candles.slice(Math.max(0, idx - 4), idx + 1);
      const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / slice.length;
      return avg;
    });

    return { minPrice: min, maxPrice: max, maPoints: ma };
  }, [candles]);

  const getY = (val: number) => {
    if (maxPrice === minPrice) return chartHeight / 2;
    return (
      chartHeight -
      ((val - minPrice) / (maxPrice - minPrice)) * (chartHeight - 30) -
      15
    );
  };

  const currentPriceY = getY(basePrice);

  const handleOpenOrder = (dir: "long" | "short") => {
    setOrderDirection(dir);
    setIsOrderOpen(true);
  };

  const handleConfirmOrder = async () => {
    const num = parseFloat(investAmount);
    if (isNaN(num) || num <= 0) {
      showToast(t.investAmount);
      return;
    }
    if (num > userBalance) {
      showToast(t.insufficientBalance);
      return;
    }

    const dirParam = orderDirection === "long" ? "buy_up" : "buy_down";
    const res = await tradingApi.createOrder({
      symbol: codenameParam,
      direction: dirParam,
      money: num,
      duration: selectedDuration,
    });

    if (res.code !== 1) {
      showToast(res.msg || "Đặt lệnh thất bại");
      return;
    }

    setUserBalance((prev) => Number((prev - num).toFixed(2)));
    const newTrade: ActiveTrade = {
      id: String(res.data?.orderId || Math.random().toString(36).substring(2, 9).toUpperCase()),
      symbol: codenameParam,
      direction: orderDirection,
      amount: num,
      entryPrice: basePrice,
      duration: selectedDuration,
      remaining: selectedDuration,
      yieldRate: selectedDuration === 60 ? 0.85 : 0.88,
      status: "trading",
    };

    setTrades((prev) => [newTrade, ...prev]);
    setIsOrderOpen(false);
    showToast(t.orderSuccess);
  };

  const activeTrades = trades.filter((t) => t.status === "trading");
  const closedTrades = trades.filter((t) => t.status !== "trading");

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center select-none pb-20">
      <div className="w-full max-w-[480px] min-h-screen bg-[#f8fafc] flex flex-col relative shadow-sm">
        {/* Top Header */}
        <div className="bg-white flex items-center justify-between px-4 pt-3 pb-3 border-b border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all cursor-pointer border-0"
          >
            <ChevronLeft className="w-5 h-5 text-[#333333]" />
          </button>

          <div className="flex items-center gap-1.5 cursor-pointer">
            <ArrowLeftRight className="w-4 h-4 text-[#64748b]" />
            <span className="text-[17px] font-bold text-[#111827]">
              {codenameParam}
            </span>
          </div>

          <div className="w-9 h-9 flex items-center justify-center">
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">
              +{((basePrice % 100) / 120).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="bg-white flex items-center justify-around border-b border-gray-100 text-[14px]">
          {["1m", "5m", "30m", "1h", "1d"].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => handleTimeframeChange(tf)}
              className={`flex-1 py-2.5 font-medium transition-all text-center border-0 bg-transparent cursor-pointer relative ${
                selectedTimeframe === tf
                  ? "text-[#2563eb] font-bold text-[15px]"
                  : "text-[#94a3b8] hover:text-[#475569]"
              }`}
            >
              <span>{tf}</span>
              {selectedTimeframe === tf && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#2563eb] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3000] px-4 py-2.5 bg-black/80 backdrop-blur-sm text-white text-[13.5px] rounded-lg shadow-lg pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 text-center max-w-[80vw]">
            {toastMsg}
          </div>
        )}

        {/* Candlestick & MA Chart */}
        <div className="bg-[#ffffff] px-2 pt-3 pb-1 border-b border-gray-100 relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-[230px] overflow-visible"
          >
            {/* Grid lines & Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = chartHeight * ratio * 0.75 + 15;
              const priceLabel = (maxPrice - ratio * (maxPrice - minPrice)).toFixed(
                2
              );
              return (
                <g key={idx}>
                  <line
                    x1="10"
                    y1={y}
                    x2={chartWidth - 55}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <text
                    x={chartWidth - 48}
                    y={y + 3}
                    fill="#94a3b8"
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {priceLabel}
                  </text>
                </g>
              );
            })}

            {/* Current Price Dashed Guide Line */}
            <line
              x1="10"
              y1={currentPriceY}
              x2={chartWidth - 55}
              y2={currentPriceY}
              stroke="#64748b"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            {/* Current price badge */}
            <rect
              x={chartWidth - 54}
              y={currentPriceY - 9}
              width="50"
              height="18"
              rx="3"
              fill="#334155"
            />
            <text
              x={chartWidth - 29}
              y={currentPriceY + 3.5}
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {basePrice.toFixed(2)}
            </text>

            {/* Candlesticks */}
            {candles.map((c, i) => {
              const x = 12 + i * (candleWidth + candlePadding);
              const isUp = c.close >= c.open;
              const bodyTop = getY(Math.max(c.open, c.close));
              const bodyBottom = getY(Math.min(c.open, c.close));
              const bodyHeight = Math.max(2, bodyBottom - bodyTop);
              const color = isUp ? "#10b981" : "#ef4444";

              return (
                <g key={i}>
                  {/* High-Low Wick */}
                  <line
                    x1={x + candleWidth / 2}
                    y1={getY(c.high)}
                    x2={x + candleWidth / 2}
                    y2={getY(c.low)}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })}

            {/* Moving Average Line */}
            <polyline
              fill="none"
              stroke="#eab308"
              strokeWidth="1.5"
              points={maPoints
                .map((val, i) => {
                  const x = 12 + i * (candleWidth + candlePadding) + candleWidth / 2;
                  return `${x},${getY(val)}`;
                })
                .join(" ")}
            />
          </svg>

          {/* Volume bars container */}
          <div className="h-[45px] flex items-end px-3 gap-1 border-t border-gray-100 pt-1 pb-1">
            {candles.slice(-28).map((c, idx) => {
              const isUp = c.close >= c.open;
              const heightPct = Math.min(100, Math.max(15, (c.volume / 100) * 100));
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-t-[1px] transition-all ${
                    isUp ? "bg-[#10b981]/70" : "bg-[#ef4444]/70"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Position Tabs & Table */}
        <div className="bg-white mt-2 rounded-t-[16px] shadow-[0_-2px_10px_rgba(0,0,0,0.03)] flex-1 flex flex-col">
          <div className="flex items-center px-4 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveSubTab("trading")}
              className={`py-3 text-[15px] font-medium mr-6 transition-all relative border-0 bg-transparent cursor-pointer ${
                activeSubTab === "trading"
                  ? "text-[#0f172a] font-bold"
                  : "text-[#94a3b8]"
              }`}
            >
              <span>{t.posTrading}</span>
              {activeTrades.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-[#2563eb] text-[11px] rounded-full">
                  {activeTrades.length}
                </span>
              )}
              {activeSubTab === "trading" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2563eb] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("closed")}
              className={`py-3 text-[15px] font-medium transition-all relative border-0 bg-transparent cursor-pointer ${
                activeSubTab === "closed"
                  ? "text-[#0f172a] font-bold"
                  : "text-[#94a3b8]"
              }`}
            >
              <span>{t.posClosed}</span>
              {closedTrades.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-gray-100 text-gray-600 text-[11px] rounded-full">
                  {closedTrades.length}
                </span>
              )}
              {activeSubTab === "closed" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2563eb] rounded-full" />
              )}
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-4 px-4 py-2.5 bg-gray-50/70 text-[12px] text-[#94a3b8] font-medium">
            <span>{t.colDirectionQty}</span>
            <span>{t.colPriceStatus}</span>
            <span className="text-center">{t.colEstProfit}</span>
            <span className="text-right">{t.colCountdown}</span>
          </div>

          {/* Table Body */}
          <div className="flex-1 p-3">
            {activeSubTab === "trading" ? (
              activeTrades.length === 0 ? (
                <div className="py-12 text-center text-[13px] text-[#94a3b8]">
                  {t.noTradingRecords}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {activeTrades.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-4 items-center px-2 py-2.5 rounded-lg bg-gray-50/60 text-[13px]"
                    >
                      <div className="flex items-center gap-1 font-medium">
                        {item.direction === "long" ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span
                          className={
                            item.direction === "long"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }
                        >
                          {item.direction === "long" ? t.btnBuyLong : t.btnBuyShort}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          ${item.amount}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#475569]">
                        {item.entryPrice.toFixed(2)}
                      </div>
                      <div className="text-center text-[12.5px] font-semibold text-emerald-600">
                        +{(item.amount * item.yieldRate).toFixed(2)}
                      </div>
                      <div className="text-right text-[12px] font-mono text-[#2563eb] font-bold">
                        {item.remaining}s
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : closedTrades.length === 0 ? (
              <div className="py-12 text-center text-[13px] text-[#94a3b8]">
                {t.noClosedRecords}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {closedTrades.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-4 items-center px-2 py-2.5 rounded-lg bg-gray-50/60 text-[13px]"
                  >
                    <div className="flex items-center gap-1 font-medium">
                      <span
                        className={
                          item.direction === "long"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }
                      >
                        {item.direction === "long" ? t.btnBuyLong : t.btnBuyShort}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        ${item.amount}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#475569]">
                      {item.entryPrice.toFixed(2)}
                    </div>
                    <div
                      className={`text-center text-[12.5px] font-semibold ${
                        item.status === "win"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.status === "win"
                        ? `+${(item.amount * item.yieldRate).toFixed(2)}`
                        : `-${item.amount.toFixed(2)}`}
                    </div>
                    <div className="text-right text-[12px] text-gray-500">
                      {item.status === "win" ? "WIN" : "LOSS"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Trading Buttons (买涨 & 买跌) */}
        <div className="fixed bottom-0 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
          <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-md px-4 py-3 border-t border-gray-100 flex items-center gap-3 pointer-events-auto shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              onClick={() => handleOpenOrder("long")}
              className="flex-1 py-3.5 rounded-[12px] bg-[#00c087] text-white text-[16px] font-bold shadow-[0_4px_12px_rgba(0,192,135,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer border-0"
            >
              {t.btnBuyLong}
            </button>
            <button
              type="button"
              onClick={() => handleOpenOrder("short")}
              className="flex-1 py-3.5 rounded-[12px] bg-[#ef4444] text-white text-[16px] font-bold shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer border-0"
            >
              {t.btnBuyShort}
            </button>
          </div>
        </div>

        {/* Order Placement Modal / Sheet */}
        {isOrderOpen && (
          <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[480px] bg-white rounded-t-[20px] p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      orderDirection === "long" ? "bg-[#00c087]" : "bg-[#ef4444]"
                    }`}
                  />
                  <h3 className="text-[17px] font-bold text-[#111827]">
                    {orderDirection === "long" ? t.btnBuyLong : t.btnBuyShort} -{" "}
                    {codenameParam}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOrderOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer border-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Settlement Cycle */}
              <div>
                <label className="text-[13px] text-[#64748b] font-medium mb-2 block">
                  {t.selectTime}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { sec: 60, rate: 85 },
                    { sec: 120, rate: 88 },
                    { sec: 180, rate: 90 },
                    { sec: 300, rate: 92 },
                  ].map((item) => (
                    <button
                      key={item.sec}
                      type="button"
                      onClick={() => setSelectedDuration(item.sec)}
                      className={`py-2 px-1 rounded-[10px] text-center border transition-all cursor-pointer ${
                        selectedDuration === item.sec
                          ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] font-bold"
                          : "border-gray-200 bg-white text-[#475569] hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-[13px]">
                        {item.sec}
                        {t.seconds}
                      </div>
                      <div className="text-[11px] text-[#10b981]">
                        {item.rate}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment Amount */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[13px] text-[#64748b] font-medium">
                    {t.investAmount}
                  </label>
                  <span className="text-[12px] text-[#94a3b8]">
                    {t.balance}: RM{userBalance.toFixed(2)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder="100"
                    className="w-full bg-[#f8fafc] border border-gray-200 rounded-[10px] px-3.5 py-2.5 text-[15px] font-semibold text-[#1e293b] focus:outline-none focus:border-[#2563eb]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 font-medium">
                    USDT
                  </span>
                </div>
                {/* Quick Chips */}
                <div className="flex items-center gap-2 mt-2">
                  {["100", "500", "1000", "2000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setInvestAmount(amt)}
                      className="px-2.5 py-1 text-[12px] rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer border-0"
                    >
                      +{amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setInvestAmount(userBalance.toString())}
                    className="px-2.5 py-1 text-[12px] rounded-md bg-blue-50 text-[#2563eb] font-semibold hover:bg-blue-100 cursor-pointer border-0"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#f8fafc] rounded-[10px] p-3 flex items-center justify-between text-[13px]">
                <span className="text-gray-500">{t.estYield}:</span>
                <span className="font-bold text-[#10b981]">
                  +{(parseFloat(investAmount || "0") * 0.85).toFixed(2)} USDT
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                className={`w-full py-3.5 rounded-[12px] text-white text-[16px] font-bold shadow-md transition-all cursor-pointer border-0 ${
                  orderDirection === "long"
                    ? "bg-[#00c087] hover:brightness-105"
                    : "bg-[#ef4444] hover:brightness-105"
                }`}
              >
                {t.btnConfirmOrder}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpotlineDetailPage() {
  return (
    <I18nProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#f1f5f9]" />}>
        <SpotlineDetailInner />
      </Suspense>
    </I18nProvider>
  );
}
