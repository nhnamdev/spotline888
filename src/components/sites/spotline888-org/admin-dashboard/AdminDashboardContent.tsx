"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminDashboardCharts from "./AdminDashboardCharts";
import { adminApi } from "@/lib/api";

export default function AdminDashboardContent() {
  const [timeRange, setTimeRange] = useState("2026-09-07 00:00:00 - 2026-09-07 23:59:59");
  const [onlineCount] = useState(1);
  const [stats, setStats] = useState<any>({
    user: { total_users: 195, today_users: 0, total_money: 0, total_usdt: 0 },
    recharge: { total_recharge: 0, today_recharge: 0, pending_recharge_count: 0 },
    withdraw: { total_withdraw: 0, today_withdraw: 0, pending_withdraw_count: 0 },
    order: { total_orders: 0, today_orders: 0, holding_orders_count: 0 },
    pending_kyc: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      if (res.code === 1 && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("加载控制台统计数据失败:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats();
  };

  return (
    <div className="dashboard-content-root">
      {/* RIBBON */}
      <div id="ribbon">
        <ol className="breadcrumb pull-left">
          <li>
            <Link href="/admin/dashboard" className="addtabsit">
              <i className="fa fa-dashboard"></i> 控制台
            </Link>
          </li>
        </ol>
        <ol className="breadcrumb pull-right">
          <li>
            <span className="ribbon-target">控制台</span>
          </li>
        </ol>
      </div>

      {/* Main Content Area */}
      <div className="content">
        <div className="dash-wrap">
          {/* Summary Banner */}
          <div className="dash-summary">
            <div className="sum-item">
              <i className="fa fa-users"></i>
              <span>
                总注册用户 <strong>{stats.user?.total_users || 0}</strong>
              </span>
            </div>
            <div className="sum-item">
              <i className="fa fa-database"></i>
              <span>
                用户总余额 (USDT) <strong>{Number(stats.user?.total_usdt || stats.user?.total_money || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT</strong>
              </span>
            </div>
          </div>

          {/* Time Filter Form */}
          <form role="form" className="filter-form" onSubmit={handleQuery}>
            <div className="dash-filter">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="fa fa-calendar"></i>
                </span>
                <input
                  id="zhangbiantime"
                  type="text"
                  name="time_text"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="form-control"
                  placeholder="选择时间范围"
                />
              </div>
              <button type="submit" className="btn-query">
                <i className="fa fa-search"></i> 查询
              </button>
            </div>
          </form>

          {/* Stat Cards */}
          <div className="dash-cards">
            {/* 总注册人数 */}
            <div className="dash-card">
              <div className="card-deco cd-blue"></div>
              <div className="card-icon ci-blue">
                <i className="fa fa-users"></i>
              </div>
              <div className="card-val">{stats.user?.total_users || 0}</div>
              <div className="card-label">总注册人数</div>
              <Link href="/admin/user" className="card-link">
                查看用户列表 <i className="fa fa-arrow-right"></i>
              </Link>
            </div>

            {/* 待审核认证 */}
            <div className="dash-card">
              <div className="card-deco cd-green"></div>
              <div className="card-icon ci-green">
                <i className="fa fa-id-card-o"></i>
              </div>
              <div className="card-val">
                <span className="pulse-dot"></span> <span>{stats.pending_kyc || 0}</span>
              </div>
              <div className="card-label">KYC 待审核</div>
              <Link href="/admin/verify" className="card-link">
                前往审核 <i className="fa fa-arrow-right"></i>
              </Link>
            </div>

            {/* 今日注册 */}
            <div className="dash-card">
              <div className="card-deco cd-amber"></div>
              <div className="card-icon ci-amber">
                <i className="fa fa-user-plus"></i>
              </div>
              <div className="card-val">{stats.user?.today_users || 0}</div>
              <div className="card-label">今日注册</div>
            </div>

            {/* 待处理充值 */}
            <div className="dash-card">
              <div className="card-deco cd-purple"></div>
              <div className="card-icon ci-purple">
                <i className="fa fa-clock-o"></i>
              </div>
              <div className="card-val">{stats.recharge?.pending_recharge_count || 0}</div>
              <div className="card-label">充值待审核</div>
              <Link href="/admin/upmark" className="card-link">
                前往审核 <i className="fa fa-arrow-right"></i>
              </Link>
            </div>

            {/* 今日充值 */}
            <div className="dash-card">
              <div className="card-deco cd-cyan"></div>
              <div className="card-icon ci-cyan">
                <i className="fa fa-arrow-circle-up"></i>
              </div>
              <div className="card-val-sm">
                总计: <span>{Number(stats.recharge?.total_recharge || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT</span>
                <br />
                今日: <span>{Number(stats.recharge?.today_recharge || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT</span>
              </div>
              <div className="card-label">充值统计</div>
            </div>

            {/* 今日提现 */}
            <div className="dash-card">
              <div className="card-deco cd-rose"></div>
              <div className="card-icon ci-rose">
                <i className="fa fa-arrow-circle-down"></i>
              </div>
              <div className="card-val-sm">
                总计: <span>{Number(stats.withdraw?.total_withdraw || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT</span>
                <br />
                今日: <span>{Number(stats.withdraw?.today_withdraw || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT</span>
              </div>
              <div className="card-label">提现统计</div>
            </div>
          </div>

          {/* Charts */}
          <AdminDashboardCharts />
        </div>
      </div>

      <style jsx>{`
        .dashboard-content-root {
          width: 100%;
          min-height: 100%;
          background-color: #f1f4f6;
          box-sizing: border-box;
        }

        #ribbon {
          min-height: 40px;
          background: #ffffff;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e0e6ed;
        }

        .breadcrumb {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #777777;
        }

        .breadcrumb a {
          color: #333333;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .breadcrumb a:hover {
          color: #18bc9c;
        }

        .ribbon-target {
          color: #777777;
        }

        .content {
          padding: 20px;
        }

        .dash-wrap {
          padding: 0;
        }

        .dash-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 18px 28px;
          margin-bottom: 22px;
          color: #ffffff;
          flex-wrap: wrap;
          gap: 10px;
        }

        @media (max-width: 767px) {
          .content {
            padding: 12px 10px;
          }

          .dash-summary {
            padding: 14px 16px;
            gap: 8px;
          }

          .sum-item {
            font-size: 13px;
          }

          .sum-item strong {
            font-size: 18px;
          }
        }

        .sum-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        :global(.sum-item i.fa) {
          font-size: 22px;
          opacity: 0.9;
        }

        .sum-item strong {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-left: 6px;
        }

        .filter-form {
          margin-bottom: 22px;
        }

        .dash-filter {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .dash-filter .input-group {
          display: flex;
          align-items: center;
          max-width: 440px;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          background: #ffffff;
        }

        .dash-filter .input-group-addon {
          background: #f7f9fc;
          border: 1px solid #e0e6ed;
          border-right: none;
          color: #667eea;
          font-size: 13px;
          padding: 0 14px;
          height: 38px;
          display: flex;
          align-items: center;
        }

        .dash-filter .form-control {
          border: 1px solid #e0e6ed;
          border-left: none;
          height: 38px;
          padding: 0 12px;
          font-size: 13px;
          width: 100%;
          flex: 1;
          outline: none;
          color: #333333;
        }

        .btn-query {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0 24px;
          height: 38px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-query:hover {
          opacity: 0.88;
        }

        @media (max-width: 640px) {
          .dash-filter {
            flex-direction: column;
            align-items: stretch;
          }

          .dash-filter .input-group {
            max-width: 100%;
          }

          .btn-query {
            width: 100%;
            justify-content: center;
          }
        }

        .dash-cards {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 26px;
        }

        @media (max-width: 1400px) {
          .dash-cards {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dash-cards {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .dash-cards {
            grid-template-columns: 1fr;
          }
        }

        .dash-card {
          position: relative;
          background: #ffffff;
          border-radius: 14px;
          padding: 22px 20px 18px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .dash-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .card-deco {
          position: absolute;
          top: -16px;
          right: -16px;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          opacity: 0.12;
        }

        .cd-blue {
          background: #667eea;
        }
        .cd-green {
          background: #48bb78;
        }
        .cd-amber {
          background: #f6ad55;
        }
        .cd-purple {
          background: #9f7aea;
        }
        .cd-cyan {
          background: #4fd1c5;
        }
        .cd-rose {
          background: #e53e3e;
        }

        .card-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #ffffff;
          margin-bottom: 14px;
        }

        .ci-blue {
          background: linear-gradient(135deg, #667eea, #5a67d8);
        }
        .ci-green {
          background: linear-gradient(135deg, #48bb78, #38a169);
        }
        .ci-amber {
          background: linear-gradient(135deg, #f6ad55, #ed8936);
        }
        .ci-purple {
          background: linear-gradient(135deg, #9f7aea, #805ad5);
        }
        .ci-cyan {
          background: linear-gradient(135deg, #4fd1c5, #38b2ac);
        }
        .ci-rose {
          background: linear-gradient(135deg, #fc8181, #e53e3e);
        }

        .card-val {
          font-size: 26px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.1;
          margin-bottom: 4px;
          font-variant-numeric: tabular-nums;
        }

        .card-val-sm {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.4;
          font-variant-numeric: tabular-nums;
          margin-bottom: 4px;
        }

        .card-label {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .card-sub {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .card-link {
          display: block;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
          font-size: 12px;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }

        .card-link:hover {
          color: #764ba2;
        }

        .pulse-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #48bb78;
          margin-right: 4px;
          animation: pulseDot 1.5s infinite;
          vertical-align: middle;
        }

        @keyframes pulseDot {
          0% {
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.6);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(72, 187, 120, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
          }
        }
      `}</style>
    </div>
  );
}
