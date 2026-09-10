"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

interface OrderItem {
  id: number;
  userId: number;
  userAccount: string;
  realName: string;
  note: string;
  productTitle: string;
  oStyle: "buy_down" | "buy_up";
  isSelectOStyle?: boolean;
  buyMoney: string;
  balanceBuyAfter: string;
  buyPrice: string;
  sellPrice: string;
  buyTime: string;
  sellTime: string;
  type: string;
  ploss: string;
  kongType: "default" | "win" | "loss" | "closed";
  isSelectKongType?: boolean;
  alertReminder: boolean;
}

export default function AdminOrderContent() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Search filter state
  const [searchForm, setSearchForm] = useState({
    userId: "",
    oStyle: "Choose",
    buyTime: "",
    sellTime: "",
    kongType: "Choose",
    status: "Choose",
    alertReminder: "",
  });

  const fetchOrders = async (customStatus?: string) => {
    try {
      setLoading(true);
      const st = customStatus !== undefined 
        ? customStatus 
        : (searchForm.status !== 'Choose' ? searchForm.status : undefined);
      const res = await adminApi.getOrders(currentPage, pageSize, st);
      if (res && res.code === 1 && res.data?.rows && res.data.rows.length > 0) {
        const mapped: OrderItem[] = res.data.rows.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          userAccount: row.username || `User_${row.user_id}`,
          realName: row.real_name || '-',
          note: row.type_desc || '',
          productTitle: row.product_title || 'BTC/USDT',
          oStyle: (row.ostyle === 'buy_up' || row.ostyle === '1') ? 'buy_up' : 'buy_down',
          isSelectOStyle: row.status === 'holding',
          buyMoney: parseFloat(row.buy_money || 0).toFixed(2),
          balanceBuyAfter: parseFloat(row.balance_after || 0).toFixed(2),
          buyPrice: String(row.buy_price || 0),
          sellPrice: String(row.sell_price || 0),
          buyTime: row.buy_time ? String(row.buy_time).replace('T', ' ').substring(0, 19) : '',
          sellTime: row.sell_time ? String(row.sell_time).replace('T', ' ').substring(0, 19) : '',
          type: row.duration ? `${row.duration}/${row.yield_rate || 85}%` : (row.type_desc || '60/85%'),
          ploss: parseFloat(row.ploss || 0).toFixed(0),
          kongType: (row.kong_type || 'default') as "default" | "win" | "loss" | "closed",
          isSelectKongType: row.status === 'holding',
          alertReminder: true,
        }));
        setOrders(mapped);
        setTotal(res.data.total || mapped.length);
      }
    } catch (err) {
      console.error('加载订单列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, searchForm.status]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(orders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSoundAlert = (id: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, alertReminder: !o.alertReminder } : o))
    );
  };

  const updateOStyle = (id: number, style: "buy_down" | "buy_up") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, oStyle: style } : o))
    );
  };

  const updateKongType = async (
    id: number,
    kong: "default" | "win" | "loss" | "closed"
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, kongType: kong } : o))
    );
    try {
      await adminApi.controlOrder(id, kong as any);
    } catch (err) {
      console.error('更新干预模式失败:', err);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(searchForm.status !== 'Choose' ? searchForm.status : undefined);
  };

  const handleFilterReset = () => {
    const reset = {
      userId: "",
      oStyle: "Choose",
      buyTime: "",
      sellTime: "",
      kongType: "Choose",
      status: "Choose",
      alertReminder: "",
    };
    setSearchForm(reset);
    fetchOrders(undefined);
  };

  return (
    <div className="order-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> 控制台
        </div>
        <div className="breadcrumb-right">订单管理</div>
      </div>

      <div className="content-body">
        <div className="panel panel-default">
          <div className="panel-body">
            {/* Common Search Filter Form */}
            <form
              className="form-commonsearch"
              onSubmit={handleFilterSubmit}
            >
              <div className="search-grid">
                {/* User_id */}
                <div className="form-group">
                  <label className="control-label">用户ID</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="用户ID|姓名|登录IP搜索"
                      value={searchForm.userId}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, userId: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* O_style */}
                <div className="form-group">
                  <label className="control-label">方向</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.oStyle}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, oStyle: e.target.value })
                      }
                    >
                      <option value="Choose">选择</option>
                      <option value="0">买跌</option>
                      <option value="1">买涨</option>
                    </select>
                  </div>
                </div>

                {/* Buy_time */}
                <div className="form-group">
                  <label className="control-label">买入时间</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="买入时间"
                      value={searchForm.buyTime}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, buyTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Sell_time */}
                <div className="form-group">
                  <label className="control-label">卖出时间</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="卖出时间"
                      value={searchForm.sellTime}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, sellTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Kong_type */}
                <div className="form-group">
                  <label className="control-label">控制类型</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.kongType}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, kongType: e.target.value })
                      }
                    >
                      <option value="Choose">选择</option>
                      <option value="0">默认</option>
                      <option value="1">赢</option>
                      <option value="2">亏</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="control-label">状态</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.status}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, status: e.target.value })
                      }
                    >
                      <option value="Choose">选择</option>
                      <option value="1">未结算</option>
                      <option value="3">已结算</option>
                    </select>
                  </div>
                </div>

                {/* 下单提醒 */}
                <div className="form-group">
                  <label className="control-label">下单提醒</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="下单提醒"
                      value={searchForm.alertReminder}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          alertReminder: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Submit & Reset Buttons */}
                <div className="form-group form-actions">
                  <button type="submit" className="btn btn-success">
                    提交
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={handleFilterReset}
                  >
                    刷新
                  </button>
                </div>
              </div>
            </form>

            {/* Action Toolbar */}
            <div className="toolbar-container">
              <button
                type="button"
                className="btn btn-primary btn-refresh"
                title="刷新"
                onClick={() => fetchOrders()}
              >
                <i className={`fa fa-refresh ${loading ? "fa-spin" : ""}`}></i>
              </button>
              <button type="button" className="btn btn-danger">
                取消自动刷新
              </button>
              <button type="button" className="btn btn-danger">
                开启提示音
              </button>
            </div>

            {/* Table Container */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === orders.length &&
                          orders.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>ID</th>
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th>真实姓名</th>
                    <th>备注</th>
                    <th>产品名称</th>
                    <th>买涨/买跌</th>
                    <th>买入金额</th>
                    <th>购买后余额</th>
                    <th>买入价格</th>
                    <th>卖出价格</th>
                    <th>买入时间</th>
                    <th>卖出时间</th>
                    <th>类型</th>
                    <th>盈亏金额</th>
                    <th>控制类型</th>
                    <th>下单提醒</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={19} className="text-center py-8 text-gray-500">
                        <i className="fa fa-refresh fa-spin mr-2"></i> 正在加载订单数据...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={19} className="text-center py-8 text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                    const isSelected = selectedIds.includes(order.id);
                    return (
                      <tr key={order.id} className={isSelected ? "selected" : ""}>
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(order.id)}
                          />
                        </td>
                        <td>{order.id}</td>
                        <td>{order.userId}</td>
                        <td>{order.userAccount}</td>
                        <td>{order.realName}</td>
                        <td>{order.note}</td>
                        <td>{order.productTitle}</td>
                        <td>
                          {order.isSelectOStyle ? (
                            <select
                              className="form-control inline-select"
                              value={order.oStyle === "buy_down" ? "0" : "1"}
                              onChange={(e) =>
                                updateOStyle(
                                  order.id,
                                  e.target.value === "0" ? "buy_down" : "buy_up"
                                )
                              }
                            >
                              <option value="0">买跌</option>
                              <option value="1">买涨</option>
                            </select>
                          ) : (
                            <span
                              className={`badge ${
                                order.oStyle === "buy_down"
                                  ? "badge-danger"
                                  : "badge-success"
                              }`}
                            >
                              {order.oStyle === "buy_down" ? "买跌" : "买涨"}
                            </span>
                          )}
                        </td>
                        <td>{order.buyMoney}</td>
                        <td>{order.balanceBuyAfter}</td>
                        <td>{order.buyPrice}</td>
                        <td>{order.sellPrice}</td>
                        <td className="cell-time">{order.buyTime}</td>
                        <td className="cell-time">{order.sellTime}</td>
                        <td>{order.type}</td>
                        <td>{order.ploss}</td>
                        <td>
                          {order.isSelectKongType ? (
                            <select
                              className="form-control inline-select"
                              value={
                                order.kongType === "default"
                                  ? "0"
                                  : order.kongType === "win"
                                  ? "1"
                                  : "2"
                              }
                              onChange={(e) =>
                                updateKongType(
                                  order.id,
                                  e.target.value === "0"
                                    ? "default"
                                    : e.target.value === "1"
                                    ? "win"
                                    : "loss"
                                )
                              }
                            >
                              <option value="0">默认</option>
                              <option value="1">赢</option>
                              <option value="2">亏</option>
                            </select>
                          ) : (
                            <span className="badge badge-danger">已平仓</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-xs btn-success btn-reminder"
                            onClick={() => toggleSoundAlert(order.id)}
                          >
                            <i className="fa fa-stop-circle"></i> 关闭提示音
                          </button>
                        </td>
                        <td className="cell-operate">
                          <button
                            type="button"
                            className="btn btn-xs btn-success"
                            title="编辑"
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs btn-danger"
                            title="删除"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  显示第 {total > 0 ? (currentPage - 1) * pageSize + 1 : 0} 到第 {Math.min(currentPage * pageSize, total)} 条记录，总共 {total} 条记录
                </span>
                <span className="page-size-select">
                  每页显示{" "}
                  <select
                    className="form-control page-size-control"
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>{" "}
                  条记录
                </span>
              </div>
              <ul className="pagination">
                <li className={currentPage <= 1 ? "disabled" : ""}>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}>
                    上一页
                  </a>
                </li>
                {Array.from({ length: Math.min(10, Math.max(1, Math.ceil(total / pageSize))) }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={currentPage === p ? "active" : ""}>
                    <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p); }}>
                      {p}
                    </a>
                  </li>
                ))}
                <li className={currentPage >= Math.ceil(total / pageSize) ? "disabled" : ""}>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (currentPage < Math.ceil(total / pageSize)) setCurrentPage(currentPage + 1); }}>
                    下一页
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-page-wrapper {
          min-height: calc(100vh - 50px);
          background-color: #f1f4f6;
          font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
            "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
          color: #333333;
        }

        /* Ribbon Header */
        .content-header-ribbon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
          padding: 8px 15px;
          border-bottom: 1px solid #e7eaec;
          font-size: 12px;
        }

        .breadcrumb-left {
          color: #777777;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .breadcrumb-left :global(.fa-dashboard) {
          font-size: 13px;
        }

        .breadcrumb-right {
          color: #777777;
        }

        /* Content Body */
        .content-body {
          padding: 15px;
        }

        .panel {
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-radius: 3px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .panel-body {
          padding: 15px;
        }

        /* Search Filter Form */
        .form-commonsearch {
          background-color: #ffffff;
          padding-bottom: 15px;
          border-bottom: 1px dashed #e7eaec;
        }

        .search-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px 16px;
        }

        @media (max-width: 1200px) {
          .search-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .search-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          align-items: center;
          margin: 0;
        }

        .control-label {
          width: 80px;
          text-align: right;
          margin-right: 12px;
          font-size: 13px;
          font-weight: 500;
          color: #333333;
          flex-shrink: 0;
        }

        .control-input {
          flex: 1;
        }

        .form-control {
          width: 100%;
          height: 31px;
          padding: 4px 10px;
          font-size: 12px;
          line-height: 1.42857143;
          color: #555555;
          background-color: #ffffff;
          background-image: none;
          border: 1px solid #cccccc;
          border-radius: 2px;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          outline: none;
          box-sizing: border-box;
          transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
        }

        .form-control:focus {
          border-color: #18bc9c;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(24, 188, 156, 0.4);
        }

        .form-control::placeholder {
          color: #999999;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: flex-start;
          padding-left: 10px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.42857143;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 3px;
          user-select: none;
          box-sizing: border-box;
          height: 31px;
        }

        .btn-success {
          color: #ffffff;
          background-color: #18bc9c;
          border-color: #18bc9c;
        }

        .btn-success:hover {
          background-color: #15a589;
          border-color: #15a589;
        }

        .btn-default {
          color: #333333;
          background-color: #ffffff;
          border-color: #cccccc;
        }

        .btn-default:hover {
          background-color: #e6e6e6;
          border-color: #adadad;
        }

        .btn-primary {
          color: #ffffff;
          background-color: #2c3e50;
          border-color: #2c3e50;
        }

        .btn-primary:hover {
          background-color: #1a252f;
        }

        .btn-danger {
          color: #ffffff;
          background-color: #d9534f;
          border-color: #d43f3a;
        }

        .btn-danger:hover {
          background-color: #c9302c;
        }

        /* Toolbar */
        .toolbar-container {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 15px 0 12px 0;
        }

        .btn-refresh {
          width: 32px;
          padding: 0;
        }

        /* Table */
        .table-responsive {
          min-height: 0.01%;
          overflow-x: auto;
          border: 1px solid #e7eaec;
          margin-bottom: 15px;
        }

        .table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          white-space: nowrap;
        }

        .table > thead > tr > th {
          vertical-align: middle;
          border-bottom: 2px solid #ddd;
          border-top: 0;
          border-left: 1px solid #e7eaec;
          border-right: 1px solid #e7eaec;
          padding: 8px 6px;
          line-height: 1.42857143;
          text-align: center;
          font-weight: 600;
          background-color: #f5f5f6;
          color: #333333;
        }

        .table > tbody > tr > td {
          padding: 6px 6px;
          line-height: 1.42857143;
          vertical-align: middle;
          border: 1px solid #e7eaec;
          text-align: center;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: #f9f9f9;
        }

        .table-hover > tbody > tr:hover {
          background-color: #f5f5f5;
        }

        .col-checkbox {
          width: 36px;
          text-align: center;
        }

        .cell-time {
          font-family: monospace;
          font-size: 11px;
        }

        .inline-select {
          height: 24px;
          padding: 2px 4px;
          font-size: 11px;
          border-radius: 2px;
          width: auto;
          display: inline-block;
        }

        .badge {
          display: inline-block;
          min-width: 10px;
          padding: 3px 6px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          color: #ffffff;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          border-radius: 2px;
        }

        .badge-danger {
          background-color: #d9534f;
        }

        .badge-success {
          background-color: #18bc9c;
        }

        .btn-xs {
          padding: 2px 6px;
          font-size: 11px;
          line-height: 1.3;
          border-radius: 2px;
          height: 22px;
        }

        .btn-reminder {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .cell-operate {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        /* Pagination */
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 5px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pagination-info {
          font-size: 12px;
          color: #777777;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-size-select {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .page-size-control {
          width: 55px;
          height: 26px;
          padding: 2px 6px;
          font-size: 12px;
          display: inline-block;
        }

        .pagination {
          display: inline-flex;
          padding-left: 0;
          margin: 0;
          border-radius: 4px;
          list-style: none;
        }

        .pagination > li > a,
        .pagination > li > span {
          position: relative;
          float: left;
          padding: 4px 10px;
          margin-left: -1px;
          line-height: 1.42857143;
          color: #333333;
          text-decoration: none;
          background-color: #ffffff;
          border: 1px solid #dddddd;
          font-size: 12px;
        }

        .pagination > li:first-child > a,
        .pagination > li:first-child > span {
          margin-left: 0;
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
        }

        .pagination > li:last-child > a,
        .pagination > li:last-child > span {
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }

        .pagination > li > a:hover {
          background-color: #eeeeee;
        }

        .pagination > .active > a,
        .pagination > .active > a:hover {
          z-index: 3;
          color: #ffffff;
          cursor: default;
          background-color: #2c3e50;
          border-color: #2c3e50;
        }

        .pagination > .disabled > span {
          color: #777777;
          cursor: not-allowed;
          background-color: #ffffff;
          border-color: #dddddd;
        }
      `}</style>
    </div>
  );
}
