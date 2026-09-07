"use client";

import React, { useState } from "react";
import { X, ArrowDownLeft, ArrowUpRight, Coins, Inbox } from "lucide-react";
import { MoneyTranslations } from "./moneyI18n";

export interface TransactionRecord {
  id: string;
  type: "deposit" | "withdraw" | "earnings";
  title: string;
  amount: number;
  time: string;
  status: string;
}

interface MoneyDetailsModalProps {
  t: MoneyTranslations;
  isOpen: boolean;
  onClose: () => void;
  records?: TransactionRecord[];
}

export const MoneyDetailsModal: React.FC<MoneyDetailsModalProps> = ({
  t,
  isOpen,
  onClose,
  records = [],
}) => {
  const [filterTab, setFilterTab] = useState<"all" | "deposit" | "withdraw" | "earnings">("all");

  if (!isOpen) return null;

  const defaultRecords: TransactionRecord[] = [
    {
      id: "tx-1",
      type: "deposit",
      title: t.deposit,
      amount: 500.0,
      time: "2025-05-14 10:24",
      status: "Completed",
    },
    {
      id: "tx-2",
      type: "earnings",
      title: t.earnings,
      amount: 1.25,
      time: "2025-05-14 00:05",
      status: "Completed",
    },
    {
      id: "tx-3",
      type: "earnings",
      title: t.earnings,
      amount: 1.18,
      time: "2025-05-13 00:05",
      status: "Completed",
    },
  ];

  const dataList = records.length > 0 ? records : defaultRecords;

  const filteredList = dataList.filter((item) => {
    if (filterTab === "all") return true;
    return item.type === filterTab;
  });

  const tabs: Array<{ key: "all" | "deposit" | "withdraw" | "earnings"; label: string }> = [
    { key: "all", label: t.all },
    { key: "deposit", label: t.deposit },
    { key: "withdraw", label: t.withdraw },
    { key: "earnings", label: t.earnings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Bottom Sheet */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-900">{t.yuebaoDetails}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center px-4 border-b border-gray-100 bg-[#f8fafc]/50">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className={`flex-1 py-3 text-[13px] font-semibold text-center relative transition-colors ${
                filterTab === tab.key ? "text-[#1150c2]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {filterTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#1150c2] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Records List Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 min-h-[220px]">
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Inbox className="w-10 h-10 stroke-1 mb-2 text-gray-300" />
              <span className="text-[13px]">{t.noRecords}</span>
            </div>
          ) : (
            filteredList.map((rec) => {
              const isGain = rec.type === "deposit" || rec.type === "earnings";
              return (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8fafc] border border-gray-100 hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        rec.type === "deposit"
                          ? "bg-blue-100 text-[#1150c2]"
                          : rec.type === "withdraw"
                          ? "bg-amber-100 text-[#f8b83d]"
                          : "bg-emerald-100 text-[#0ecb81]"
                      }`}
                    >
                      {rec.type === "deposit" && <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />}
                      {rec.type === "withdraw" && <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />}
                      {rec.type === "earnings" && <Coins className="w-4 h-4 stroke-[2.5]" />}
                    </div>

                    <div>
                      <div className="text-[14px] font-semibold text-gray-800">{rec.title}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{rec.time}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-[15px] font-bold ${
                        isGain ? "text-[#0ecb81]" : "text-[#f6465d]"
                      }`}
                    >
                      {isGain ? "+" : "-"}
                      {rec.amount.toFixed(2)} USDT
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">{rec.status}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
