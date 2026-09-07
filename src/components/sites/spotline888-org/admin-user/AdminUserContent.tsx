"use client";

import React, { useState } from "react";

interface UserItem {
  uid: number;
  avatarBg: string;
  account: string;
  realName: string;
  accountType: string;
  phone: string;
  profession: string;
  authStatus: string;
  money: string;
  usdtBalance: string;
}

const initialUsers: UserItem[] = [
  {
    uid: 196,
    avatarBg: "#d9534f",
    account: "WongLeeChu",
    realName: "Wong Lee Chu",
    accountType: "客户",
    phone: "12332",
    profession: "123213",
    authStatus: "已认证",
    money: "482256.73",
    usdtBalance: "0",
  },
  {
    uid: 195,
    avatarBg: "#d9534f",
    account: "simyeekun",
    realName: "sim yee kun",
    accountType: "客户",
    phone: "222",
    profession: "零",
    authStatus: "已认证",
    money: "0.00",
    usdtBalance: "0",
  },
  {
    uid: 194,
    avatarBg: "#f0ad4e",
    account: "CHOOILAIMEI",
    realName: "CHOOI LAI MEI",
    accountType: "客户",
    phone: "222",
    profession: "退休",
    authStatus: "已认证",
    money: "165300.00",
    usdtBalance: "0",
  },
  {
    uid: 193,
    avatarBg: "#5bc0de",
    account: "PONGCHOONYONG",
    realName: "PONG CHOON YONG",
    accountType: "客户",
    phone: "222",
    profession: "退休",
    authStatus: "已认证",
    money: "0.00",
    usdtBalance: "0",
  },
  {
    uid: 192,
    avatarBg: "#337ab7",
    account: "KHORHANKIONG",
    realName: "KHOR HAN KIONG",
    accountType: "客户",
    phone: "12312332",
    profession: "123123",
    authStatus: "已认证",
    money: "72566.73",
    usdtBalance: "0",
  },
  {
    uid: 191,
    avatarBg: "#d9534f",
    account: "LimVuiShing",
    realName: "Lim Vui Shing",
    accountType: "客户",
    phone: "222",
    profession: "退休",
    authStatus: "已认证",
    money: "120369.00",
    usdtBalance: "0",
  },
  {
    uid: 190,
    avatarBg: "#337ab7",
    account: "LimChengYong",
    realName: "Lim Cheng Yong",
    accountType: "客户",
    phone: "222",
    profession: "安装闭路电视",
    authStatus: "已认证",
    money: "44010.28",
    usdtBalance: "0",
  },
  {
    uid: 189,
    avatarBg: "#5bc0de",
    account: "wongchawfung",
    realName: "wong chaw fung",
    accountType: "客户",
    phone: "1233",
    profession: "123312",
    authStatus: "已认证",
    money: "0.00",
    usdtBalance: "0",
  },
];

export default function AdminUserContent() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "blacklist">("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search filters
  const [searchForm, setSearchForm] = useState({
    account: "",
    accountType: "Choose",
    phone: "",
    parentUser: "",
    inviteCode: "",
    loginIp: "",
    riskControl: "Choose",
    status: "Choose",
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(users.map((u) => u.uid));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (uid: number) => {
    setSelectedIds((prev) =>
      prev.includes(uid) ? prev.filter((item) => item !== uid) : [...prev, uid]
    );
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterReset = () => {
    setSearchForm({
      account: "",
      accountType: "Choose",
      phone: "",
      parentUser: "",
      inviteCode: "",
      loginIp: "",
      riskControl: "Choose",
      status: "Choose",
    });
  };

  return (
    <div className="user-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">会员管理</div>
      </div>

      {/* Page Title */}
      <div className="page-header-title">
        <h1>
          会员管理 <small>会员管理</small>
        </h1>
      </div>

      <div className="content-body">
        <div className="panel panel-default">
          {/* Nav Tabs */}
          <div className="panel-heading-tabs">
            <ul className="nav nav-tabs">
              <li className={activeTab === "users" ? "active" : ""}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("users");
                  }}
                >
                  用户管理
                </a>
              </li>
              <li className={activeTab === "blacklist" ? "active" : ""}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("blacklist");
                  }}
                >
                  IP黑名单
                </a>
              </li>
            </ul>
          </div>

          <div className="panel-body">
            {/* Common Search Form */}
            <form className="form-commonsearch" onSubmit={handleFilterSubmit}>
              <div className="search-grid">
                {/* Account */}
                <div className="form-group">
                  <label className="control-label">Account</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="用户ID|姓名|登录IP搜索"
                      value={searchForm.account}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, account: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 账号类型 */}
                <div className="form-group">
                  <label className="control-label">账号类型</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.accountType}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          accountType: e.target.value,
                        })
                      }
                    >
                      <option value="Choose">Choose</option>
                      <option value="1">客户</option>
                      <option value="2">代理</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="control-label">Phone</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone"
                      value={searchForm.phone}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 上级用户 */}
                <div className="form-group">
                  <label className="control-label">上级用户</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="上级用户"
                      value={searchForm.parentUser}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          parentUser: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 邀请码 */}
                <div className="form-group">
                  <label className="control-label">邀请码</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="邀请码"
                      value={searchForm.inviteCode}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          inviteCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 登录IP */}
                <div className="form-group">
                  <label className="control-label">登录IP</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="登录IP"
                      value={searchForm.loginIp}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, loginIp: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 会员风控 */}
                <div className="form-group">
                  <label className="control-label">会员风控</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.riskControl}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          riskControl: e.target.value,
                        })
                      }
                    >
                      <option value="Choose">Choose</option>
                      <option value="0">正常</option>
                      <option value="1">风控</option>
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
                      <option value="1">正常</option>
                      <option value="0">禁用</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit & Reset Buttons */}
              <div className="form-actions">
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
            </form>

            {/* Action Toolbar */}
            <div className="toolbar-container">
              <button
                type="button"
                className="btn btn-primary btn-refresh"
                title="Refresh"
                onClick={() => setUsers([...initialUsers])}
              >
                <i className="fa fa-refresh"></i>
              </button>
              <button type="button" className="btn btn-success btn-add">
                <i className="fa fa-plus"></i> Add
              </button>
            </div>

            {/* Table Responsive */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === users.length &&
                          users.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Uid</th>
                    <th>会员头像</th>
                    <th>Account</th>
                    <th>Real_name</th>
                    <th>账号类型</th>
                    <th>Phone</th>
                    <th>Profession</th>
                    <th>Auth_status</th>
                    <th>
                      Money <i className="fa fa-sort text-muted"></i>
                    </th>
                    <th>USDT余额</th>
                    <th className="col-operate-header">Operate</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isSelected = selectedIds.includes(user.uid);
                    return (
                      <tr key={user.uid} className={isSelected ? "selected" : ""}>
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(user.uid)}
                          />
                        </td>
                        <td>{user.uid}</td>
                        <td className="col-avatar">
                          <div
                            className="avatar-circle"
                            style={{ backgroundColor: user.avatarBg }}
                          >
                            <i className="fa fa-user"></i>
                          </div>
                        </td>
                        <td className="col-account">{user.account}</td>
                        <td>{user.realName}</td>
                        <td>
                          <span className="badge badge-primary">
                            {user.accountType}
                          </span>
                        </td>
                        <td>{user.phone}</td>
                        <td>{user.profession}</td>
                        <td>
                          <span className="badge-outline-success">
                            {user.authStatus}
                          </span>
                        </td>
                        <td className="text-right">{user.money}</td>
                        <td>{user.usdtBalance}</td>
                        <td className="col-operate">
                          <div className="btn-group-operate">
                            <button
                              type="button"
                              className="btn btn-xs btn-success"
                            >
                              <i className="fa fa-list"></i> Detail
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-dark-blue"
                            >
                              <i className="fa fa-comment"></i> 发送消息
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-warning"
                            >
                              <i className="fa fa-shopping-cart"></i> 分数
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-warning"
                            >
                              <i className="fa fa-lock"></i> 冻结资金
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-warning"
                            >
                              <i className="fa fa-shopping-cart"></i> 信誉分
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-info"
                            >
                              <i className="fa fa-area-chart"></i> 报表
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger"
                            >
                              <i className="fa fa-user"></i> 设置黑名单
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger"
                            >
                              <i className="fa fa-user"></i> 冻结
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger"
                            >
                              <i className="fa fa-ban"></i> 拉黑IP
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-success btn-icon-only"
                              title="Edit"
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger btn-icon-only"
                              title="Delete"
                            >
                              <i className="fa fa-trash"></i>
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
                <span>显示第 1 到第 10 条记录，总共 177 条记录</span>
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
                      setCurrentPage(18);
                    }}
                  >
                    18
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
        .user-page-wrapper {
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

        /* Panel Nav Tabs */
        .panel-heading-tabs {
          background-color: #f5f5f6;
          border-bottom: 1px solid #e7eaec;
          padding: 10px 10px 0 10px;
        }

        .nav-tabs {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          border-bottom: 1px solid transparent;
        }

        .nav-tabs > li {
          margin-bottom: -1px;
        }

        .nav-tabs > li > a {
          display: block;
          padding: 8px 16px;
          font-size: 13px;
          color: #555555;
          text-decoration: none;
          border: 1px solid transparent;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          background-color: #f5f5f6;
        }

        .nav-tabs > li.active > a {
          color: #333333;
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-bottom-color: #ffffff;
          border-top: 2px solid #18bc9c;
          font-weight: 600;
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
          margin-top: 12px;
          padding-left: 87px;
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

        .btn-add {
          gap: 4px;
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

        .col-avatar {
          width: 40px;
        }

        .avatar-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .col-account {
          font-weight: 500;
        }

        .badge-primary {
          background-color: #337ab7;
          color: #ffffff;
          padding: 2px 6px;
          font-size: 11px;
          border-radius: 2px;
          font-weight: normal;
        }

        .badge-outline-success {
          display: inline-block;
          color: #18bc9c;
          border: 1px solid #18bc9c;
          background-color: #e8f8f5;
          padding: 1px 6px;
          font-size: 11px;
          border-radius: 2px;
          font-weight: 500;
        }

        .text-right {
          text-align: right !important;
        }

        .col-operate-header {
          min-width: 480px;
        }

        .col-operate {
          text-align: left !important;
          padding: 4px 6px !important;
        }

        .btn-group-operate {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          flex-wrap: nowrap;
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

        .btn-icon-only {
          padding: 2px 5px;
          gap: 0;
        }

        .btn-dark-blue {
          background-color: #2c3e50;
        }

        .btn-dark-blue:hover {
          background-color: #1a252f;
        }

        .btn-warning {
          background-color: #f39c12;
        }

        .btn-warning:hover {
          background-color: #e08e0b;
        }

        .btn-info {
          background-color: #00c0ef;
        }

        .btn-info:hover {
          background-color: #00acd6;
        }

        .btn-danger {
          background-color: #d9534f;
        }

        .btn-danger:hover {
          background-color: #c9302c;
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
