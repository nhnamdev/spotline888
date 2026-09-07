"use client";

import React, { useState } from "react";

interface DownmarkItem {
  id: number;
  userId: number;
  username: string;
  note: string;
  convertAmount: string;
  amount: string;
  actualAmount: string;
  fee: string;
  withdrawType: string;
  realName: string;
  cardNumber: string;
  bankName: string;
  idCard: string;
  phone: string;
  balanceBefore: string;
  balanceAfter: string;
  sourceIp: string;
  sourceAddress: string;
  submitTime: string;
  status: "approved" | "rejected";
  reminder: boolean;
}

const initialRecords: DownmarkItem[] = [
  {
    id: 1,
    userId: 190,
    username: "LimChengYong",
    note: "",
    convertAmount: "",
    amount: "15000.00",
    actualAmount: "15000.00",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "Lim Cheng Yong",
    cardNumber: "4337820924",
    bankName: "public bank",
    idCard: "-",
    phone: "-",
    balanceBefore: "44010.28",
    balanceAfter: "29010.28",
    sourceIp: "0.0.0.0",
    sourceAddress: "_",
    submitTime: "2026-09-07 16:27:11",
    status: "rejected",
    reminder: true,
  },
  {
    id: 2,
    userId: 190,
    username: "LimChengYong",
    note: "",
    convertAmount: "",
    amount: "1500.00",
    actualAmount: "1500.00",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "Lim Cheng Yong",
    cardNumber: "4337820924",
    bankName: "public bank",
    idCard: "-",
    phone: "-",
    balanceBefore: "45510.28",
    balanceAfter: "44010.28",
    sourceIp: "0.0.0.0",
    sourceAddress: "_",
    submitTime: "2026-09-07 16:16:06",
    status: "approved",
    reminder: true,
  },
  {
    id: 3,
    userId: 141,
    username: "LOSIEWYONG",
    note: "",
    convertAmount: "",
    amount: "135376.50",
    actualAmount: "135376.50",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "LO SIEW YONG",
    cardNumber: "107117414475",
    bankName: "MAYBANK",
    idCard: "-",
    phone: "-",
    balanceBefore: "135376.50",
    balanceAfter: "0",
    sourceIp: "0.0.0.0",
    sourceAddress: "_",
    submitTime: "2026-09-07 15:43:10",
    status: "rejected",
    reminder: true,
  },
  {
    id: 4,
    userId: 190,
    username: "LimChengYong",
    note: "",
    convertAmount: "",
    amount: "42233.75",
    actualAmount: "42233.75",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "Lim Cheng Yong",
    cardNumber: "4337820924",
    bankName: "public bank",
    idCard: "-",
    phone: "-",
    balanceBefore: "42233.75",
    balanceAfter: "0",
    sourceIp: "0.0.0.0",
    sourceAddress: "_",
    submitTime: "2026-09-07 15:38:41",
    status: "rejected",
    reminder: true,
  },
  {
    id: 5,
    userId: 196,
    username: "WongLeeChu",
    note: "",
    convertAmount: "",
    amount: "482256.73",
    actualAmount: "482256.73",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "Wong Lee Chu",
    cardNumber: "101262051746",
    bankName: "MAYBANK",
    idCard: "-",
    phone: "-",
    balanceBefore: "482256.73",
    balanceAfter: "0",
    sourceIp: "49.125.213.215",
    sourceAddress: "马来西亚_吉隆坡",
    submitTime: "2026-09-07 12:22:37",
    status: "rejected",
    reminder: true,
  },
  {
    id: 6,
    userId: 53,
    username: "CHUAKIMFUNG",
    note: "",
    convertAmount: "",
    amount: "386700.05",
    actualAmount: "386700.05",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "CHUA KIM FUNG",
    cardNumber: "8881024865843",
    bankName: "Ambank",
    idCard: "-",
    phone: "-",
    balanceBefore: "386700.05",
    balanceAfter: "0",
    sourceIp: "0.0.0.0",
    sourceAddress: "_",
    submitTime: "2026-09-07 10:25:10",
    status: "approved",
    reminder: true,
  },
  {
    id: 7,
    userId: 192,
    username: "KHORHANKIONG",
    note: "",
    convertAmount: "",
    amount: "36283.00",
    actualAmount: "36283.00",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "KHOR HAN KIONG",
    cardNumber: "157091075887",
    bankName: "MayBank",
    idCard: "-",
    phone: "-",
    balanceBefore: "36283.00",
    balanceAfter: "0",
    sourceIp: "0.0.0.0",
    sourceAddress: "_",
    submitTime: "2026-09-06 21:24:26",
    status: "rejected",
    reminder: true,
  },
  {
    id: 8,
    userId: 196,
    username: "WongLeeChu",
    note: "",
    convertAmount: "",
    amount: "1324.00",
    actualAmount: "1324.00",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "Wong Lee Chu",
    cardNumber: "101262051746",
    bankName: "MAYBANK",
    idCard: "-",
    phone: "-",
    balanceBefore: "1324.00",
    balanceAfter: "0",
    sourceIp: "49.125.213.215",
    sourceAddress: "马来西亚_吉隆坡",
    submitTime: "2026-09-06 21:02:37",
    status: "approved",
    reminder: true,
  },
  {
    id: 9,
    userId: 192,
    username: "KHORHANKIONG",
    note: "",
    convertAmount: "",
    amount: "36283.00",
    actualAmount: "36283.00",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "KHOR HAN KIONG",
    cardNumber: "157091075887",
    bankName: "MayBank",
    idCard: "-",
    phone: "-",
    balanceBefore: "36283.00",
    balanceAfter: "0",
    sourceIp: "0.0.0.0",
    sourceAddress: "_",
    submitTime: "2026-09-06 16:10:07",
    status: "rejected",
    reminder: true,
  },
  {
    id: 10,
    userId: 190,
    username: "LimChengYong",
    note: "",
    convertAmount: "",
    amount: "36725.00",
    actualAmount: "36725.00",
    fee: "0.00",
    withdrawType: "bank_card",
    realName: "Lim Cheng Yong",
    cardNumber: "4337820924",
    bankName: "public bank",
    idCard: "-",
    phone: "-",
    balanceBefore: "36725.00",
    balanceAfter: "0",
    sourceIp: "0.0.0.0",
    sourceAddress: "_",
    submitTime: "2026-09-06 13:20:33",
    status: "rejected",
    reminder: true,
  },
];

export default function AdminDownmarkContent() {
  const [records, setRecords] = useState<DownmarkItem[]>(initialRecords);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter form
  const [searchForm, setSearchForm] = useState({
    userId: "",
    submitTime: "",
    reminder: "",
    status: "Choose",
    check: "",
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(records.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleReminder = (id: number) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reminder: !r.reminder } : r))
    );
  };

  const handleToggleStatus = (id: number) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "approved" ? "rejected" : "approved",
            }
          : r
      )
    );
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterReset = () => {
    setSearchForm({
      userId: "",
      submitTime: "",
      reminder: "",
      status: "Choose",
      check: "",
    });
    setRecords([...initialRecords]);
  };

  return (
    <div className="downmark-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">提现管理</div>
      </div>

      {/* Page Title */}
      <div className="page-header-title">
        <h1>
          提现管理 <small>下分记录</small>
        </h1>
      </div>

      <div className="content-body">
        <div className="panel panel-default">
          <div className="panel-body">
            {/* Common Search Form */}
            <form className="form-commonsearch" onSubmit={handleFilterSubmit}>
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

                {/* 提交时间 */}
                <div className="form-group">
                  <label className="control-label">提交时间</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="提交时间"
                      value={searchForm.submitTime}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          submitTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 提现提醒 */}
                <div className="form-group">
                  <label className="control-label">提现提醒</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="提现提醒"
                      value={searchForm.reminder}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          reminder: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 状态 */}
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
                      <option value="Choose">Choose</option>
                      <option value="0">未审核</option>
                      <option value="1">审核通过</option>
                      <option value="2">审核未通过</option>
                    </select>
                  </div>
                </div>

                {/* 核对 */}
                <div className="form-group">
                  <label className="control-label">核对</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="核对"
                      value={searchForm.check}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, check: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Submit & Reset */}
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
              <button type="button" className="btn btn-danger btn-alert">
                开启提示音
              </button>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === records.length &&
                          records.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>User_id</th>
                    <th>Username</th>
                    <th>备注</th>
                    <th>折合数量</th>
                    <th>金额</th>
                    <th>实际到账</th>
                    <th>手续费</th>
                    <th>提现方式</th>
                    <th>姓名</th>
                    <th>卡号(账号)</th>
                    <th>银行名称</th>
                    <th>身份证号</th>
                    <th>手机号</th>
                    <th>出款前余额</th>
                    <th>出款后余额</th>
                    <th>来源IP</th>
                    <th>来源地址</th>
                    <th>提交时间</th>
                    <th>提现提醒</th>
                    <th>状态</th>
                    <th>核对</th>
                    <th>Operate</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr key={item.id} className={isSelected ? "selected" : ""}>
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(item.id)}
                          />
                        </td>
                        <td>{item.userId}</td>
                        <td>{item.username}</td>
                        <td>{item.note}</td>
                        <td>{item.convertAmount}</td>
                        <td className="text-right">{item.amount}</td>
                        <td className="text-right">{item.actualAmount}</td>
                        <td>{item.fee}</td>
                        <td>{item.withdrawType}</td>
                        <td>{item.realName}</td>
                        <td>{item.cardNumber}</td>
                        <td>{item.bankName}</td>
                        <td>{item.idCard}</td>
                        <td>{item.phone}</td>
                        <td className="text-right">{item.balanceBefore}</td>
                        <td className="text-right">{item.balanceAfter}</td>
                        <td>{item.sourceIp}</td>
                        <td>{item.sourceAddress}</td>
                        <td className="cell-time">{item.submitTime}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-xs btn-success btn-reminder"
                            onClick={() => toggleReminder(item.id)}
                          >
                            <i className="fa fa-stop-circle"></i> 关闭提示音
                          </button>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === "approved"
                                ? "badge-success"
                                : "badge-danger"
                            }`}
                          >
                            {item.status === "approved"
                              ? "审核通过"
                              : "审核未通过"}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group-cell">
                            <button
                              type="button"
                              className="btn btn-xs btn-warning"
                            >
                              <i className="fa fa-pencil"></i> 转账说明
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-teal"
                            >
                              <i className="fa fa-pencil"></i> 转账截图
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="btn-group-cell">
                            {item.status === "rejected" ? (
                              <button
                                type="button"
                                className="btn btn-xs btn-success"
                                onClick={() => handleToggleStatus(item.id)}
                              >
                                <i className="fa fa-check"></i> 改为通过
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-xs btn-danger"
                                onClick={() => handleToggleStatus(item.id)}
                              >
                                <i className="fa fa-times"></i> 改为拒绝
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-xs btn-teal"
                            >
                              <i className="fa fa-pencil"></i> 编辑
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>显示第 1 到第 10 条记录，总共 373 条记录</span>
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
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </a>
                </li>
                <li className={currentPage === 2 ? "active" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(2);
                    }}
                  >
                    2
                  </a>
                </li>
                <li className={currentPage === 3 ? "active" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(3);
                    }}
                  >
                    3
                  </a>
                </li>
                <li className={currentPage === 4 ? "active" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(4);
                    }}
                  >
                    4
                  </a>
                </li>
                <li className={currentPage === 5 ? "active" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(5);
                    }}
                  >
                    5
                  </a>
                </li>
                <li className="disabled">
                  <span>...</span>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(38);
                    }}
                  >
                    38
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(2);
                    }}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .downmark-page-wrapper {
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

        /* Page Title */
        .page-header-title {
          padding: 15px 15px 5px 15px;
        }

        .page-header-title h1 {
          font-size: 20px;
          font-weight: 500;
          margin: 0;
          color: #333333;
        }

        .page-header-title small {
          font-size: 12px;
          color: #777777;
          font-weight: 400;
          margin-left: 6px;
        }

        /* Content Body */
        .content-body {
          padding: 10px 15px 20px 15px;
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
          margin-bottom: 15px;
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
          width: 75px;
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
          margin-bottom: 12px;
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
          padding: 6px 8px;
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

        .text-right {
          text-align: right !important;
        }

        .badge {
          display: inline-block;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.2;
          color: #ffffff;
          text-align: center;
          white-space: nowrap;
          border-radius: 2px;
        }

        .badge-success {
          background-color: #00a65a;
        }

        .badge-danger {
          background-color: #dd4b39;
        }

        .btn-group-cell {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .btn-xs {
          padding: 2px 6px;
          font-size: 11px;
          line-height: 1.3;
          border-radius: 2px;
          height: 22px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          border: none;
          color: #ffffff;
          cursor: pointer;
          white-space: nowrap;
        }

        .btn-warning {
          background-color: #f39c12;
        }

        .btn-warning:hover {
          background-color: #e08e0b;
        }

        .btn-teal {
          background-color: #18bc9c;
        }

        .btn-teal:hover {
          background-color: #15a589;
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
