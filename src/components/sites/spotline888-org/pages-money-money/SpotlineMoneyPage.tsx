"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { I18nProvider, useI18n } from "../pages-login-login/i18n";
import { LanguageDrawer } from "../pages-login-login/LanguageDrawer";
import { IndexTabBar } from "../pages-index-index/IndexTabBar";
import { INDEX_TRANSLATIONS } from "../pages-index-index/indexI18n";
import { MONEY_TRANSLATIONS } from "./moneyI18n";
import { MONEY_ICONS } from "./moneyIcons";
import { MoneyDetailsModal, TransactionRecord } from "./MoneyDetailsModal";
import { X, ArrowRightLeft, Globe } from "lucide-react";
import { authApi, yuebaoApi, withdrawApi } from "@/lib/api";

interface PageData {
  all_money: number;
  yue_start_money: number;
  yue_stop_money: number;
  sy: number;
  yield: string;
  ru_count: number;
  chu_count: number;
}

function SpotlineMoneyPageContent() {
  const { currentLang } = useI18n();
  const tMoney = MONEY_TRANSLATIONS[currentLang] || MONEY_TRANSLATIONS["zh-CN"];
  const tIndex = INDEX_TRANSLATIONS[currentLang] || INDEX_TRANSLATIONS["zh-CN"];

  // State data matching Uni-app data()
  const [pageData, setPageData] = useState<PageData>({
    all_money: 0.0,
    yue_start_money: 0.0,
    yue_stop_money: 0.0,
    sy: 0.0,
    yield: "0.50%",
    ru_count: 0,
    chu_count: 0,
  });

  const [gradItem, setGradItem] = useState<number>(0);
  const [availableBalance, setAvailableBalance] = useState<number>(0.0);

  // Modals
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [transferModal, setTransferModal] = useState<{
    open: boolean;
    type: "buy" | "sell";
    amount: string;
  }>({
    open: false,
    type: "buy",
    amount: "",
  });

  const [records, setRecords] = useState<TransactionRecord[]>([]);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Convert 750rpx to actual container px
  const rpxToPx = useCallback((rpx: number, containerWidth: number) => {
    return (rpx / 750) * containerWidth;
  }, []);

  // Uni-app drawFitText implementation
  const drawFitText = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      baseSize: number,
      align: "left" | "right" | "center"
    ) => {
      const str = String(text || "");
      ctx.textAlign = align;
      let size = baseSize;
      ctx.font = `${Math.round(size)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
      let width = ctx.measureText(str).width;
      const minSize = Math.max(8, Math.floor(0.75 * baseSize));

      while (width > maxWidth && size > minSize) {
        size -= 1;
        ctx.font = `${Math.round(size)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
        width = ctx.measureText(str).width;
      }

      if (width > maxWidth) {
        let truncated = str;
        while (truncated.length > 0 && ctx.measureText(truncated + "…").width > maxWidth) {
          truncated = truncated.slice(0, -1);
        }
        ctx.fillText(truncated + "…", x, y);
      } else {
        ctx.fillText(str, x, y);
      }
    },
    []
  );

  // drawProgress matching Uni-app module daf1
  const drawProgress = useCallback(
    (progress: number, amount: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const container = canvas.parentElement;
      const containerWidth = container ? container.clientWidth : 315;
      const a = containerWidth;
      const n = (350 / 630) * containerWidth;

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.round(a * dpr);
      canvas.height = Math.round(n * dpr);
      canvas.style.width = `${a}px`;
      canvas.style.height = `${n}px`;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, a, n);
      ctx.lineCap = "round";

      const r = a / 2;
      const A = rpxToPx(280, a * (750 / 630));
      const o = a / 2 - rpxToPx(50, a * (750 / 630));
      const s = rpxToPx(32, a * (750 / 630));
      const c = Math.PI;
      const u = Math.PI * (1 + progress / 100);

      // 1. Background White Arc
      ctx.beginPath();
      ctx.arc(r, A, o, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = s;
      ctx.stroke();

      // 2. Foreground Progress Arc with Linear Gradient
      if (progress > 0) {
        ctx.beginPath();
        ctx.arc(r, A, o, c, u);
        const grad = ctx.createLinearGradient(r - o, A, r + o, A);
        grad.addColorStop(0, "rgba(234, 240, 251, 0.2)");
        grad.addColorStop(1, "#2e6bdb");
        ctx.strokeStyle = grad;
        ctx.lineWidth = s;
        ctx.stroke();
      }

      // 3. Center Label: Tổng số dư (money.yebze)
      ctx.fillStyle = "#8f8f8f";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      const labelFontSize = Math.max(11, Math.round(rpxToPx(24, a * (750 / 630))));
      ctx.font = `500 ${labelFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(tMoney.totalBalanceLabel + " (USDT)", r, A - rpxToPx(120, a * (750 / 630)));

      // 4. Center Number: Amount (all_money)
      ctx.fillStyle = "#000000";
      const amountFontSize = Math.max(22, Math.round(rpxToPx(52, a * (750 / 630))));
      ctx.font = `bold ${amountFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillText(Number(amount || 0).toFixed(2), r, A - rpxToPx(55, a * (750 / 630)));

      // 5. Left & Right endpoint labels
      ctx.fillStyle = "#8f8f8f";
      ctx.textBaseline = "middle";
      const f = tMoney.confirmedShares;
      const l = tMoney.total;
      const g = A + rpxToPx(55, a * (750 / 630));
      const v = rpxToPx(10, a * (750 / 630));
      const p = r - o + v;
      const w = r + o - v;
      const b = r - v - p;
      const h = w - (r + v);

      const endpointFontSize = Math.max(9, Math.round(rpxToPx(20, a * (750 / 630))));
      drawFitText(ctx, f, p, g, b, endpointFontSize, "left");
      drawFitText(ctx, l, w, g, h, endpointFontSize, "right");

      ctx.restore();
    },
    [rpxToPx, drawFitText, tMoney]
  );

  // 60-frame requestAnimationFrame counter
  const animateProgress = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    let frame = 0;
    const targetAmount = Number(pageData.all_money || 0);
    const amountStep = targetAmount / 60;
    let currentProgress = 0;
    let currentAmount = 0;

    const step = () => {
      if (frame <= 60) {
        currentProgress += 100 / 60;
        currentAmount += amountStep;
        if (currentAmount > targetAmount) currentAmount = targetAmount;
        drawProgress(Math.min(100, currentProgress), currentAmount);
        frame++;
        animFrameRef.current = requestAnimationFrame(step);
      }
    };
    step();
  }, [pageData.all_money, drawProgress]);

  // Mounted animation triggers
  useEffect(() => {
    // 1. Staggered 500ms gradItem timer
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setGradItem(count);
      if (count >= 5) {
        clearInterval(timer);
      }
    }, 500);

    // 2. Tải dữ liệu thực tế từ MySQL CSDL
    async function loadLiveData() {
      try {
        const [profRes, yueRes, logsRes] = await Promise.all([
          authApi.getProfile(),
          yuebaoApi.getInfo(),
          withdrawApi.getMoneyRecords(1, 20),
        ]);

        let curAvail = 1870.0;
        if (profRes.code === 1 && profRes.data) {
          curAvail = parseFloat(profRes.data.money || "0");
          setAvailableBalance(curAvail);
        }

        if (yueRes.code === 1 && yueRes.data) {
          const y = yueRes.data;
          const yBalance = parseFloat(y.balance || "0");
          setPageData({
            all_money: curAvail + yBalance,
            yue_start_money: yBalance,
            yue_stop_money: 0.0,
            sy: parseFloat(y.total_profit || "0"),
            yield: y.yield_rate || "0.50%",
            ru_count: 5,
            chu_count: 5,
          });
        }

        if (logsRes.code === 1 && Array.isArray(logsRes.data?.rows || logsRes.data)) {
          const rawLogs = logsRes.data?.rows || logsRes.data;
          const mappedLogs: TransactionRecord[] = rawLogs.map((item: any, idx: number) => ({
            id: `tx-${item.id || idx}`,
            type: item.type === "recharge" ? "deposit" : item.type === "withdraw" ? "withdraw" : "earnings",
            title: item.memo || (item.type === "recharge" ? tMoney.deposit : tMoney.withdraw),
            amount: Math.abs(parseFloat(item.money || "0")),
            time: item.created_at ? new Date(item.created_at).toISOString().slice(0, 16).replace("T", " ") : "2025-05-14 10:24",
            status: "Completed",
          }));
          if (mappedLogs.length > 0) {
            setRecords(mappedLogs);
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ ví tiền:", err);
      }
    }

    loadLiveData();

    // 3. Animate canvas progress
    animateProgress();

    return () => {
      clearInterval(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animateProgress, tMoney.deposit, tMoney.withdraw]);

  // Redraw when language or window resizes
  useEffect(() => {
    drawProgress(100, pageData.all_money);
    const handleResize = () => {
      drawProgress(100, pageData.all_money);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawProgress, pageData.all_money]);

  // Actions
  const handleOpenTransfer = (type: "buy" | "sell") => {
    setTransferModal({
      open: true,
      type,
      amount: "",
    });
  };

  const handleExecuteTransfer = async () => {
    const val = parseFloat(transferModal.amount);
    if (isNaN(val) || val <= 0) {
      alert(tMoney.amountInvalid);
      return;
    }

    const transferType = transferModal.type === "buy" ? "in" : "out";
    const res = await yuebaoApi.transfer(transferType, val, 1);

    if (res.code !== 1) {
      alert(res.msg || "Chuyển tiền thất bại");
      return;
    }

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (transferModal.type === "buy") {
      setAvailableBalance((prev) => Math.max(0, prev - val));
      setPageData((prev) => ({
        ...prev,
        all_money: prev.all_money + val,
        yue_start_money: prev.yue_start_money + val,
      }));
      setRecords((prev) => [
        {
          id: `tx-${Date.now()}`,
          type: "deposit",
          title: tMoney.deposit,
          amount: val,
          time: timeStr,
          status: "Completed",
        },
        ...prev,
      ]);
    } else {
      setAvailableBalance((prev) => prev + val);
      setPageData((prev) => ({
        ...prev,
        all_money: Math.max(0, prev.all_money - val),
        yue_start_money: Math.max(0, prev.yue_start_money - val),
      }));
      setRecords((prev) => [
        {
          id: `tx-${Date.now()}`,
          type: "withdraw",
          title: tMoney.withdraw,
          amount: val,
          time: timeStr,
          status: "Completed",
        },
        ...prev,
      ]);
    }

    setTransferModal({ open: false, type: "buy", amount: "" });
  };

  return (
    <div className="min-h-screen bg-[#eceff4] flex justify-center selection:bg-blue-500 selection:text-white">
      {/* Mobile Frame Container (Max 480px, Authentic #f6f7fb background) */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#f6f7fb] flex flex-col relative pb-[70px] shadow-sm overflow-x-hidden font-sans">

        {/* Scoped Uni-app CSS styles for data-v-82023098 */}
        <style jsx>{`
          .tui-content {
            padding: 0 30px;
          }
          @media (max-width: 480px) {
            .tui-content {
              padding: 0 20px;
            }
          }
          .tui-header {
            display: flex;
            justify-content: flex-end;
            padding-top: 14px;
            padding-bottom: 6px;
          }
          .tui-header .box {
            width: 43px;
            height: 43px;
            background-color: #cbcbcb;
            color: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            transition: transform 0.15s ease, background-color 0.15s ease;
          }
          .tui-header .box:active {
            transform: scale(0.92);
            background-color: #b0b0b0;
          }
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
          .progressCanvas {
            width: 100%;
            display: block;
          }
          .tui-card {
            background-color: #ffffff;
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 15px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
          }
          .tui-card .tui-border {
            width: 1px;
            height: 34px;
            background-color: #eeeeee;
          }
          .tui-card .tui-cardItem {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 15px;
            box-sizing: border-box;
            cursor: pointer;
            transition: transform 0.15s ease;
          }
          .tui-card .tui-cardItem:active {
            transform: scale(0.95);
          }
          .tui-card .tui-cardItem span {
            font-size: 13px;
            padding-top: 5px;
            color: #222222;
            font-weight: 500;
          }
          .tui-card .tui-cardItem img {
            width: 36px;
            height: 36px;
            object-fit: contain;
          }
          .tui-grad {
            border-radius: 0 0 13px 13px;
            padding-bottom: 34px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 10px;
          }
          .tui-grad .tui-gradItem {
            width: calc(50% - 6px);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 15px 0;
            box-sizing: border-box;
            background-color: #ffffff;
            border-radius: 13px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
            transition: all 0.5s ease;
          }
          .tui-grad .tui-gradItem:nth-child(odd) {
            transform: translateX(-200px);
            opacity: 0;
          }
          .tui-grad .tui-gradItem:nth-child(even) {
            transform: translateX(200px);
            opacity: 0;
          }
          .tui-grad .tui-gradItem.show {
            transform: translateX(0) !important;
            opacity: 1 !important;
          }
          .tui-grad .tui-gradItem .title {
            color: #a8a9ac;
            font-size: 12px;
            padding-top: 10px;
            text-align: center;
          }
          .oneLine {
            max-width: 85%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .tui-grad .tui-gradItem .desc {
            font-size: 16px;
            color: #222222;
            font-weight: 600;
            padding-top: 3px;
          }
          .tui-grad .tui-gradItem img {
            width: 36px;
            height: 36px;
            object-fit: contain;
          }
        `}</style>

        {/* Outer Uni-app Root View */}
        <div className="tui-content">

          {/* 1. Header with Top-Right Circular Button */}
          <div className="tui-header">
            <div
              className="box shadow-sm"
              onClick={() => setIsHelpOpen(true)}
              title="Hướng dẫn & Quy tắc"
            >
              {/* Authentic Uni-app icons type="help" */}
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          </div>

          {/* 2. HTML5 Canvas Semicircle Gauge Arc */}
          <div className="container">
            <canvas
              ref={canvasRef}
              id="progressCanvas"
              className="progressCanvas"
            />
          </div>

          {/* 3. 3-Action White Card (Deposit / Withdraw / Details) */}
          <div className="tui-card">
            {/* Deposit (8639 / product.cr) */}
            <div
              className="tui-cardItem"
              onClick={() => handleOpenTransfer("buy")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.deposit}
                alt={tMoney.deposit}
                draggable={false}
              />
              <span>{tMoney.deposit}</span>
            </div>

            {/* Separator Line */}
            <div className="tui-border"></div>

            {/* Withdraw (a137 / product.zc) */}
            <div
              className="tui-cardItem"
              onClick={() => handleOpenTransfer("sell")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.withdraw}
                alt={tMoney.withdraw}
                draggable={false}
              />
              <span>{tMoney.withdraw}</span>
            </div>

            {/* Separator Line */}
            <div className="tui-border"></div>

            {/* Details (6d64 / product.mx) */}
            <div
              className="tui-cardItem"
              onClick={() => setIsDetailsOpen(true)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.details}
                alt={tMoney.details}
                draggable={false}
              />
              <span>{tMoney.details}</span>
            </div>
          </div>

          {/* 4. 6 Staggered Alternating Slide-In Cards */}
          <div className="tui-grad">
            {/* Item 1: Confirmed Shares (f816 / product.yqrfe / show when gradItem > 0) */}
            <div className={`tui-gradItem ${gradItem > 0 ? "show" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.confirmedShares}
                alt={tMoney.confirmedShares}
                draggable={false}
              />
              <div className="title oneLine">{tMoney.confirmedShares}</div>
              <div className="desc">{Number(pageData.yue_start_money).toFixed(2)} USDT</div>
            </div>

            {/* Item 2: Pending Shares (b11b / product.dqrfe / show when gradItem > 3) */}
            <div className={`tui-gradItem ${gradItem > 3 ? "show" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.pendingShares}
                alt={tMoney.pendingShares}
                draggable={false}
              />
              <div className="title oneLine">{tMoney.pendingShares}</div>
              <div className="desc">{Number(pageData.yue_stop_money).toFixed(2)} USDT</div>
            </div>

            {/* Item 3: Earnings (22c4 / product.sy / show when gradItem > 2) */}
            <div className={`tui-gradItem ${gradItem > 2 ? "show" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.earnings}
                alt={tMoney.earnings}
                draggable={false}
              />
              <div className="title oneLine">{tMoney.earnings}</div>
              <div className="desc">{Number(pageData.sy).toFixed(2)} USDT</div>
            </div>

            {/* Item 4: Yield Rate (3efdb / product.syl / show when gradItem > 2) */}
            <div className={`tui-gradItem ${gradItem > 2 ? "show" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.yieldRate}
                alt={tMoney.yieldRate}
                draggable={false}
              />
              <div className="title oneLine">{tMoney.yieldRate}</div>
              <div className="desc">{pageData.yield}</div>
            </div>

            {/* Item 5: Remaining Deposit Quota (1e6e / product.jrsyrjcs / show when gradItem > 4) */}
            <div className={`tui-gradItem ${gradItem > 4 ? "show" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.depositQuota}
                alt={tMoney.remainingDepositsToday}
                draggable={false}
              />
              <div className="title oneLine">{tMoney.remainingDepositsToday}</div>
              <div className="desc">{pageData.ru_count}</div>
            </div>

            {/* Item 6: Remaining Withdraw Quota (c72e / product.jrsycjcs / show when gradItem > 1) */}
            <div className={`tui-gradItem ${gradItem > 1 ? "show" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MONEY_ICONS.withdrawQuota}
                alt={tMoney.remainingWithdrawalsToday}
                draggable={false}
              />
              <div className="title oneLine">{tMoney.remainingWithdrawalsToday}</div>
              <div className="desc">{pageData.chu_count}</div>
            </div>
          </div>
        </div>

        {/* 5. Fixed Bottom Tab Bar: Tab 3 (balance / Quỹ tài chính) Active */}
        <IndexTabBar
          t={tIndex}
          activeTab="balance"
          onTabChange={(tab) => {
            if (tab === "home") {
              window.location.hash = "#/pages/index/index";
            } else if (tab === "products") {
              window.location.hash = "#/pages/product/product";
            } else if (tab === "balance") {
              window.location.hash = "#/pages/money/money";
            } else if (tab === "mine") {
              window.location.hash = "#/pages/user/user";
            }
          }}
        />

        {/* 6. Interactive Transfer Modal (Deposit / Withdraw) */}
        {transferModal.open && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-[360px] p-5 shadow-xl relative animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-base">
                  {transferModal.type === "buy"
                    ? `${tMoney.toYuebao} (${tMoney.deposit})`
                    : `${tMoney.toBalance} (${tMoney.withdraw})`}
                </h3>
                <button
                  onClick={() =>
                    setTransferModal({ open: false, type: "buy", amount: "" })
                  }
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex justify-between">
                    <span>
                      {transferModal.type === "buy"
                        ? tMoney.availableAmount
                        : tMoney.totalBalanceLabel}
                    </span>
                    <span className="font-medium text-gray-700">
                      {transferModal.type === "buy"
                        ? availableBalance.toFixed(2)
                        : pageData.all_money.toFixed(2)}{" "}
                      USDT
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={transferModal.amount}
                      onChange={(e) =>
                        setTransferModal((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder={tMoney.transferAmountPlaceholder}
                      className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 font-medium"
                    />
                    <button
                      onClick={() =>
                        setTransferModal((prev) => ({
                          ...prev,
                          amount: String(
                            prev.type === "buy"
                              ? availableBalance
                              : pageData.all_money
                          ),
                        }))
                      }
                      className="absolute right-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {tMoney.all}
                    </button>
                  </div>
                </div>

                {/* Information bullet */}
                <div className="bg-[#f0f5ff] rounded-xl p-3 text-xs text-[#2e6bdb] space-y-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>
                      {transferModal.type === "buy"
                        ? tMoney.infoToYuebao
                        : tMoney.infoToBalance}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-80 pl-5">
                    {tMoney.infoInstant} • {tMoney.infoFee}
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() =>
                    setTransferModal({ open: false, type: "buy", amount: "" })
                  }
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={handleExecuteTransfer}
                  className="flex-1 py-2.5 rounded-xl bg-[#2e6bdb] text-white text-sm font-medium hover:bg-blue-700 active:scale-98 transition-all shadow-sm"
                >
                  {tMoney.confirmTransfer}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. Transaction Details Modal */}
        <MoneyDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          records={records}
          t={tMoney}
        />

        {/* 8. Help / Rule Info Modal */}
        {isHelpOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-[380px] p-5 shadow-xl relative animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-base">
                  {tMoney.transferInfoTitle}
                </h3>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-gray-600 leading-relaxed">
                <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>1. {tMoney.toYuebao}</span>
                  </div>
                  <p className="text-gray-600 pl-3">{tMoney.infoToYuebao}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>2. {tMoney.toBalance}</span>
                  </div>
                  <p className="text-gray-600 pl-3">{tMoney.infoToBalance}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                  <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>3. {tMoney.infoInstant}</span>
                  </div>
                  <p className="text-gray-600 pl-3">{tMoney.infoFee}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setIsLangOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg border border-gray-200"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Đổi ngôn ngữ</span>
                </button>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#2e6bdb] text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. Language Switcher Drawer */}
        <LanguageDrawer
          isOpen={isLangOpen}
          onClose={() => setIsLangOpen(false)}
        />
      </div>
    </div>
  );
}

export default function SpotlineMoneyPage() {
  return (
    <I18nProvider>
      <SpotlineMoneyPageContent />
    </I18nProvider>
  );
}
