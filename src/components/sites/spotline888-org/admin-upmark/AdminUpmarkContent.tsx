"use client";

import React, { useState } from "react";

interface UpmarkItem {
  id: number;
  userId: number;
  username: string;
  realName: string;
  money: string;
  balance: string;
  payType: string;
  time: string;
  memberNote: string;
  sourceIp: string;
  sourceAddress: string;
  status: "approved" | "pending" | "rejected";
  checkAccount: string;
}

const initialRecords: UpmarkItem[] = [
  {
    id: 1,
    userId: 190,
    username: "LimChengYong",
    realName: "Lim Cheng Yong",
    money: "3276.53",
    balance: "45510.28",
    payType: "系统存入",
    time: "2026-09-07 15:59:32",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 2,
    userId: 141,
    username: "LOSIEWYONG",
    realName: "LO SIEW YONG",
    money: "6446.50",
    balance: "135376.5",
    payType: "系统存入",
    time: "2026-09-07 14:54:30",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 3,
    userId: 196,
    username: "WongLeeChu",
    realName: "Wong Lee Chu",
    money: "3000.00",
    balance: "3000",
    payType: "网银入金",
    time: "2026-09-07 10:53:58",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 4,
    userId: 53,
    username: "CHUAKIMFUNG",
    realName: "CHUA KIM FUNG",
    money: "6210.00",
    balance: "386700.05",
    payType: "系统存入",
    time: "2026-09-07 09:59:46",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 5,
    userId: 196,
    username: "WongLeeChu",
    realName: "Wong Lee Chu",
    money: "200.00",
    balance: "200",
    payType: "网银入金",
    time: "2026-09-06 20:06:49",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 6,
    userId: 190,
    username: "LimChengYong",
    realName: "Lim Cheng Yong",
    money: "5508.75",
    balance: "42233.75",
    payType: "系统存入",
    time: "2026-09-06 13:14:21",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 7,
    userId: 194,
    username: "CHOOILAIMEI",
    realName: "CHOOI LAI MEI",
    money: "3000.00",
    balance: "3000",
    payType: "网银入金",
    time: "2026-09-05 15:29:09",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 8,
    userId: 194,
    username: "CHOOILAIMEI",
    realName: "CHOOI LAI MEI",
    money: "200.00",
    balance: "200",
    payType: "网银入金",
    time: "2026-09-05 11:04:56",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 9,
    userId: 160,
    username: "TANGHIEKIONG",
    realName: "TANG HIE KIONG",
    money: "4500.00",
    balance: "43704.4",
    payType: "系统存入",
    time: "2026-09-05 10:32:13",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
  {
    id: 10,
    userId: 164,
    username: "CHUNGFUNGMEE",
    realName: "CHUNG FUNG MEE",
    money: "200.00",
    balance: "200",
    payType: "网银入金",
    time: "2026-09-04 19:50:37",
    memberNote: "",
    sourceIp: "-",
    sourceAddress: "-",
    status: "approved",
    checkAccount: "admin(管理编号:1)",
  },
];

export default function AdminUpmarkContent() {
  const [records, setRecords] = useState<UpmarkItem[]>(initialRecords);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search filter
  const [searchForm, setSearchForm] = useState({
    userId: "",
    username: "",
    realName: "",
    time: "",
    status: "Choose",
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

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterReset = () => {
    setSearchForm({
      userId: "",
      username: "",
      realName: "",
      time: "",
      status: "Choose",
    });
    setRecords([...initialRecords]);
  };

  return (
    <div className="upmark-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">充值管理</div>
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

                {/* Username */}
                <div className="form-group">
                  <label className="control-label">Username</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={searchForm.username}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 姓名 */}
                <div className="form-group">
                  <label className="control-label">姓名</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="姓名"
                      value={searchForm.realName}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          realName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="form-group">
                  <label className="control-label">Time</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Time"
                      value={searchForm.time}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, time: e.target.value })
                      }
                    />
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
                      <option value="0">未审核</option>
                      <option value="1">审核通过</option>
                      <option value="2">审核未通过</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
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

            {/* Table Responsive */}
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
                    <th>姓名</th>
                    <th>Money</th>
                    <th>剩余</th>
                    <th>Pay_type</th>
                    <th>Time</th>
                    <th>会员备注</th>
                    <th>来源IP</th>
                    <th>来源地址</th>
                    <th>Status</th>
                    <th>Check_account</th>
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
                        <td>{item.realName}</td>
                        <td className="text-right">{item.money}</td>
                        <td className="text-right">{item.balance}</td>
                        <td>{item.payType}</td>
                        <td className="cell-time">{item.time}</td>
                        <td>{item.memberNote}</td>
                        <td>{item.sourceIp}</td>
                        <td>{item.sourceAddress}</td>
                        <td>
                          <span className="badge badge-success">审核通过</span>
                        </td>
                        <td>{item.checkAccount}</td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>显示第 1 到第 10 条记录，总共 296 条记录</span>
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
                      setCurrentPage(30);
                    }}
                  >
                    30
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
        .upmark-page-wrapper {
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
