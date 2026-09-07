"use client";

import React, { useState } from "react";

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

const initialOrders: OrderItem[] = [
  {
    id: 277,
    userId: 87,
    userAccount: "TheLoonChing",
    realName: "The Loon Ching",
    note: "",
    productTitle: "BTC/USDT",
    oStyle: "buy_down",
    isSelectOStyle: true,
    buyMoney: "225890.00",
    balanceBuyAfter: "0.00",
    buyPrice: "66343.07",
    sellPrice: "0",
    buyTime: "2026-07-17 01:08:25",
    sellTime: "2026-07-17 01:28:25",
    type: "1200/7.43",
    ploss: "0",
    kongType: "default",
    isSelectKongType: true,
    alertReminder: true,
  },
  {
    id: 276,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "BTC/USDT",
    oStyle: "buy_up",
    isSelectOStyle: true,
    buyMoney: "10000.00",
    balanceBuyAfter: "1302877.51",
    buyPrice: "66219.54027102",
    sellPrice: "0",
    buyTime: "2026-03-02 20:06:29",
    sellTime: "2026-03-02 20:09:29",
    type: "180/3",
    ploss: "0",
    kongType: "win",
    isSelectKongType: true,
    alertReminder: true,
  },
  {
    id: 275,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "BTC/USDT",
    oStyle: "buy_down",
    isSelectOStyle: false,
    buyMoney: "10000.00",
    balanceBuyAfter: "1289338.51",
    buyPrice: "66288.08888781",
    sellPrice: "66288.09",
    buyTime: "2026-03-02 20:03:54",
    sellTime: "2026-03-02 20:06:54",
    type: "180/3.1",
    ploss: "10310",
    kongType: "closed",
    isSelectKongType: false,
    alertReminder: true,
  },
  {
    id: 274,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "DOGE/USDT",
    oStyle: "buy_up",
    isSelectOStyle: false,
    buyMoney: "10000.00",
    balanceBuyAfter: "1299338.51",
    buyPrice: "0.091883",
    sellPrice: "0.091911",
    buyTime: "2026-03-02 20:03:21",
    sellTime: "2026-03-02 20:04:21",
    type: "60/19.42",
    ploss: "11942",
    kongType: "closed",
    isSelectKongType: false,
    alertReminder: true,
  },
  {
    id: 273,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    isSelectOStyle: false,
    buyMoney: "10000.00",
    balanceBuyAfter: "1309338.51",
    buyPrice: "0.09187",
    sellPrice: "0.09137",
    buyTime: "2026-03-02 20:03:17",
    sellTime: "2026-03-02 20:04:17",
    type: "60/15.97",
    ploss: "11597",
    kongType: "closed",
    isSelectKongType: false,
    alertReminder: true,
  },
  {
    id: 272,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "DOGE/USDT",
    oStyle: "buy_up",
    isSelectOStyle: false,
    buyMoney: "10000.00",
    balanceBuyAfter: "1295960.51",
    buyPrice: "0.09178711",
    sellPrice: "0.09179",
    buyTime: "2026-03-02 20:02:09",
    sellTime: "2026-03-02 20:03:09",
    type: "60/14.72",
    ploss: "11472",
    kongType: "closed",
    isSelectKongType: false,
    alertReminder: true,
  },
  {
    id: 271,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    isSelectOStyle: false,
    buyMoney: "10000.00",
    balanceBuyAfter: "1305960.51",
    buyPrice: "0.091801",
    sellPrice: "0.091774",
    buyTime: "2026-03-02 20:02:06",
    sellTime: "2026-03-02 20:03:06",
    type: "60/19.06",
    ploss: "11906",
    kongType: "closed",
    isSelectKongType: false,
    alertReminder: true,
  },
  {
    id: 270,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    isSelectOStyle: false,
    buyMoney: "10000.00",
    balanceBuyAfter: "1271052.51",
    buyPrice: "0.09177615",
    sellPrice: "0.091801",
    buyTime: "2026-03-02 20:01:02",
    sellTime: "2026-03-02 20:02:02",
    type: "60/14.57",
    ploss: "11457",
    kongType: "closed",
    isSelectKongType: false,
    alertReminder: true,
  },
  {
    id: 269,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    isSelectOStyle: false,
    buyMoney: "10000.00",
    balanceBuyAfter: "1281052.51",
    buyPrice: "0.09180344",
    sellPrice: "0.091801",
    buyTime: "2026-03-02 20:00:50",
    sellTime: "2026-03-02 20:01:50",
    type: "60/11",
    ploss: "11100",
    kongType: "closed",
    isSelectKongType: false,
    alertReminder: true,
  },
  {
    id: 268,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    note: "",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    isSelectOStyle: false,
    buyMoney: "10000.00",
    balanceBuyAfter: "1291052.51",
    buyPrice: "0.09180368",
    sellPrice: "0.091801",
    buyTime: "2026-03-02 20:00:45",
    sellTime: "2026-03-02 20:01:45",
    type: "60/11.75",
    ploss: "11175",
    kongType: "closed",
    isSelectKongType: false,
    alertReminder: true,
  },
];

export default function AdminOrderContent() {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const updateKongType = (
    id: number,
    kong: "default" | "win" | "loss" | "closed"
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, kongType: kong } : o))
    );
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterReset = () => {
    setSearchForm({
      userId: "",
      oStyle: "Choose",
      buyTime: "",
      sellTime: "",
      kongType: "Choose",
      status: "Choose",
      alertReminder: "",
    });
  };

  return (
    <div className="order-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
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
                  <label className="control-label">User_id</label>
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
                  <label className="control-label">O_style</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.oStyle}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, oStyle: e.target.value })
                      }
                    >
                      <option value="Choose">Choose</option>
                      <option value="0">买跌</option>
                      <option value="1">买涨</option>
                    </select>
                  </div>
                </div>

                {/* Buy_time */}
                <div className="form-group">
                  <label className="control-label">Buy_time</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buy_time"
                      value={searchForm.buyTime}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, buyTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Sell_time */}
                <div className="form-group">
                  <label className="control-label">Sell_time</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Sell_time"
                      value={searchForm.sellTime}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, sellTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Kong_type */}
                <div className="form-group">
                  <label className="control-label">Kong_type</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.kongType}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, kongType: e.target.value })
                      }
                    >
                      <option value="Choose">Choose</option>
                      <option value="0">默认</option>
                      <option value="1">赢</option>
                      <option value="2">亏</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="control-label">Status</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.status}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, status: e.target.value })
                      }
                    >
                      <option value="Choose">Choose</option>
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
                    Submit
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
                title="Refresh"
                onClick={() => setOrders([...initialOrders])}
              >
                <i className="fa fa-refresh"></i>
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
                    <th>Id</th>
                    <th>User_id</th>
                    <th>User.account</th>
                    <th>真实姓名</th>
                    <th>备注</th>
                    <th>Product.title</th>
                    <th>O_style</th>
                    <th>Buy_money</th>
                    <th>Balance_buy_after</th>
                    <th>Buy_price</th>
                    <th>Sell_price</th>
                    <th>Buy_time</th>
                    <th>Sell_time</th>
                    <th>类型</th>
                    <th>Ploss</th>
                    <th>Kong_type</th>
                    <th>下单提醒</th>
                    <th>Operate</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
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
                            title="Edit"
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs btn-danger"
                            title="Delete"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>显示第 1 到第 10 条记录，总共 277 条记录</span>
                <span className="page-size-select">
                  每页显示{" "}
                  <select
                    className="form-control page-size-control"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
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
                <li className="disabled">
                  <span>Previous</span>
                </li>
                <li className={currentPage === 1 ? "active" : ""}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(1); }}>
                    1
                  </a>
                </li>
                <li className={currentPage === 2 ? "active" : ""}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(2); }}>
                    2
                  </a>
                </li>
                <li className={currentPage === 3 ? "active" : ""}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(3); }}>
                    3
                  </a>
                </li>
                <li className={currentPage === 4 ? "active" : ""}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(4); }}>
                    4
                  </a>
                </li>
                <li className={currentPage === 5 ? "active" : ""}>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(5); }}>
                    5
                  </a>
                </li>
                <li className="disabled">
                  <span>...</span>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(28); }}>
                    28
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(2); }}>
                    Next
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
