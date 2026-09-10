"use client";

import React, { useState } from "react";

export interface LoanRecordItem {
  id: number;
  userId: number;
  account: string;
  realName: string;
  configName: string;
  amount: string; // 借款金额
  interest: string; // 利息
  totalRepay: string; // 应还总额
  days: number; // 借款天数
  remainingDays: number; // 剩余天数
  status: number; // 0: 待审核, 1: 借款中, 2: 已还款, 3: 逾期, 4: 审核拒绝
  borrowTime: string; // 借款时间
  dueTime: string; // 到期时间
  repayTime: string; // 还款时间
}

export default function AdminLoanRecordContent() {
  const [records, setRecords] = useState<LoanRecordItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [quickSearch, setQuickSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Commonsearch form fields
  const [searchForm, setSearchForm] = useState({
    id: "",
    userId: "",
    status: "Choose",
    borrowTime: "",
    dueTime: "",
    repayTime: "",
  });

  // Column visibility state
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [columns, setColumns] = useState({
    id: true,
    userId: true,
    account: true,
    realName: true,
    configName: true,
    amount: true,
    interest: true,
    totalRepay: true,
    days: true,
    remainingDays: true,
    status: true,
    borrowTime: true,
    dueTime: true,
    repayTime: true,
  });

  // Select all / deselect all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRecords.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter records
  const filteredRecords = records.filter((item) => {
    if (searchForm.id && !String(item.id).includes(searchForm.id.trim())) {
      return false;
    }
    if (searchForm.userId && !String(item.userId).includes(searchForm.userId.trim())) {
      return false;
    }
    if (searchForm.status !== "Choose" && String(item.status) !== searchForm.status) {
      return false;
    }
    if (searchForm.borrowTime && !item.borrowTime.includes(searchForm.borrowTime.trim())) {
      return false;
    }
    if (searchForm.dueTime && !item.dueTime.includes(searchForm.dueTime.trim())) {
      return false;
    }
    if (searchForm.repayTime && !item.repayTime.includes(searchForm.repayTime.trim())) {
      return false;
    }
    if (quickSearch) {
      const q = quickSearch.toLowerCase();
      const match =
        String(item.id).includes(q) ||
        String(item.userId).includes(q) ||
        item.account.toLowerCase().includes(q) ||
        item.realName.toLowerCase().includes(q) ||
        item.configName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterReset = () => {
    setSearchForm({
      id: "",
      userId: "",
      status: "Choose",
      borrowTime: "",
      dueTime: "",
      repayTime: "",
    });
    setQuickSearch("");
  };

  // Action button handlers
  const handleApprove = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定审核通过选中的 ${selectedIds.length} 笔借款吗？`)) {
      setRecords((prev) =>
        prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: 1 } : r))
      );
      setSelectedIds([]);
    }
  };

  const handleReject = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定审核拒绝选中的 ${selectedIds.length} 笔借款吗？`)) {
      setRecords((prev) =>
        prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: 4 } : r))
      );
      setSelectedIds([]);
    }
  };

  const handleSettle = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定手动结清选中的 ${selectedIds.length} 笔借款吗？`)) {
      setRecords((prev) =>
        prev.map((r) =>
          selectedIds.includes(r.id)
            ? { ...r, status: 2, repayTime: "2026-09-08 08:30:00" }
            : r
        )
      );
      setSelectedIds([]);
    }
  };

  const handleForceRepay = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定强制扣款结清选中的 ${selectedIds.length} 笔借款吗？`)) {
      setRecords((prev) =>
        prev.map((r) =>
          selectedIds.includes(r.id)
            ? { ...r, status: 2, repayTime: "2026-09-08 08:30:00" }
            : r
        )
      );
      setSelectedIds([]);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <small className="label bg-yellow">待审核</small>;
      case 1:
        return <small className="label bg-blue">借款中</small>;
      case 2:
        return <small className="label bg-green">已还款</small>;
      case 3:
        return <small className="label bg-red">逾期</small>;
      case 4:
        return <small className="label bg-red">审核拒绝</small>;
      default:
        return <small className="label bg-gray">未知</small>;
    }
  };

  return (
    <div className="loan-record-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> 控制台
        </div>
        <div className="breadcrumb-right">
          <span>贷款管理</span>
          <span className="breadcrumb-sep">/</span>
          <span>贷款记录管理</span>
        </div>
      </div>

      <div className="content-body">
        <div className="panel panel-default panel-intro">
          <div className="panel-body">
            {/* Common Search Form */}
            {showSearchForm && (
              <form
                className="form-horizontal form-commonsearch"
                onSubmit={handleFilterSubmit}
              >
                <div className="search-grid">
                  {/* ID */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-id">
                      ID
                    </label>
                    <div className="control-input">
                      <input
                        id="search-id"
                        type="text"
                        className="form-control"
                        placeholder="ID"
                        value={searchForm.id}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            id: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* 用户ID */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-userId">
                      用户ID
                    </label>
                    <div className="control-input">
                      <input
                        id="search-userId"
                        type="text"
                        className="form-control"
                        placeholder="用户ID"
                        value={searchForm.userId}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            userId: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* 状态 */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-status">
                      状态
                    </label>
                    <div className="control-input">
                      <select
                        id="search-status"
                        className="form-control"
                        value={searchForm.status}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Choose">选择</option>
                        <option value="0">待审核</option>
                        <option value="1">借款中</option>
                        <option value="2">已还款</option>
                        <option value="3">逾期</option>
                        <option value="4">审核拒绝</option>
                      </select>
                    </div>
                  </div>

                  {/* 借款时间 */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-borrowTime">
                      借款时间
                    </label>
                    <div className="control-input">
                      <input
                        id="search-borrowTime"
                        type="text"
                        className="form-control"
                        placeholder="借款时间"
                        value={searchForm.borrowTime}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            borrowTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* 到期时间 */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-dueTime">
                      到期时间
                    </label>
                    <div className="control-input">
                      <input
                        id="search-dueTime"
                        type="text"
                        className="form-control"
                        placeholder="到期时间"
                        value={searchForm.dueTime}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            dueTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* 还款时间 */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-repayTime">
                      还款时间
                    </label>
                    <div className="control-input">
                      <input
                        id="search-repayTime"
                        type="text"
                        className="form-control"
                        placeholder="还款时间"
                        value={searchForm.repayTime}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            repayTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
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
            )}

            {/* Action Toolbar */}
            <div className="toolbar-container">
              <div className="toolbar-left">
                {/* Refresh */}
                <button
                  type="button"
                  className="btn btn-primary btn-refresh"
                  title="刷新"
                  onClick={() => {
                    setRecords([]);
                    setSelectedIds([]);
                  }}
                >
                  <i className="fa fa-refresh"></i>
                </button>

                {/* 审核通过 */}
                <button
                  type="button"
                  className={`btn btn-success btn-approve ${
                    selectedIds.length === 0 ? "disabled" : ""
                  }`}
                  disabled={selectedIds.length === 0}
                  onClick={handleApprove}
                >
                  <i className="fa fa-check-circle"></i> 审核通过
                </button>

                {/* 审核拒绝 */}
                <button
                  type="button"
                  className={`btn btn-danger btn-reject ${
                    selectedIds.length === 0 ? "disabled" : ""
                  }`}
                  disabled={selectedIds.length === 0}
                  onClick={handleReject}
                >
                  <i className="fa fa-times-circle"></i> 审核拒绝
                </button>

                {/* 手动结清 */}
                <button
                  type="button"
                  className={`btn btn-info btn-settle ${
                    selectedIds.length === 0 ? "disabled" : ""
                  }`}
                  disabled={selectedIds.length === 0}
                  onClick={handleSettle}
                >
                  <i className="fa fa-check"></i> 手动结清
                </button>

                {/* 强制扣款结清 */}
                <button
                  type="button"
                  className={`btn btn-warning btn-force-repay ${
                    selectedIds.length === 0 ? "disabled" : ""
                  }`}
                  disabled={selectedIds.length === 0}
                  onClick={handleForceRepay}
                >
                  <i className="fa fa-money"></i> 强制扣款结清
                </button>
              </div>

              {/* Right Utility Toolbar */}
              <div className="toolbar-right">
                {/* Quick Search */}
                <div className="quick-search-box">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="搜索"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                  />
                </div>

                {/* View toggle */}
                <button
                  type="button"
                  className="btn btn-default"
                  title="切换"
                >
                  <i className="fa fa-list-alt"></i>
                </button>

                {/* Columns */}
                <div className="dropdown" style={{ position: "relative", display: "inline-block" }}>
                  <button
                    type="button"
                    className="btn btn-default"
                    title="列"
                    onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                  >
                    <i className="fa fa-th"></i> <span className="caret"></span>
                  </button>
                  {showColumnsMenu && (
                    <ul className="dropdown-menu dropdown-menu-right show-dropdown">
                      {Object.keys(columns).map((key) => (
                        <li key={key}>
                          <label className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={columns[key as keyof typeof columns]}
                              onChange={() =>
                                setColumns((prev) => ({
                                  ...prev,
                                  [key]: !prev[key as keyof typeof columns],
                                }))
                              }
                            />{" "}
                            {key}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Export */}
                <div className="dropdown" style={{ position: "relative", display: "inline-block" }}>
                  <button
                    type="button"
                    className="btn btn-default"
                    title="导出数据"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                  >
                    <i className="fa fa-sign-out"></i> <span className="caret"></span>
                  </button>
                  {showExportMenu && (
                    <ul className="dropdown-menu dropdown-menu-right show-dropdown">
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          JSON
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          XML
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          CSV
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          TXT
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          MS-Excel
                        </a>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Search toggle */}
                <button
                  type="button"
                  className="btn btn-default"
                  title="通用搜索"
                  onClick={() => setShowSearchForm(!showSearchForm)}
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
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
                          selectedIds.length === filteredRecords.length &&
                          filteredRecords.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    {columns.id && <th>ID</th>}
                    {columns.userId && <th>用户ID</th>}
                    {columns.account && <th>用户账号</th>}
                    {columns.realName && <th>真实姓名</th>}
                    {columns.configName && <th>贷款配置</th>}
                    {columns.amount && <th>借款金额</th>}
                    {columns.interest && <th>利息</th>}
                    {columns.totalRepay && <th>应还总额</th>}
                    {columns.days && <th>借款天数</th>}
                    {columns.remainingDays && <th>剩余天数</th>}
                    {columns.status && <th>状态</th>}
                    {columns.borrowTime && <th>借款时间</th>}
                    {columns.dueTime && <th>到期时间</th>}
                    {columns.repayTime && <th>还款时间</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="no-records-found text-center">
                        没有找到匹配的记录
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item) => {
                      const isSelected = selectedIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={isSelected ? "selected-row" : ""}
                        >
                          <td className="col-checkbox">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(item.id)}
                            />
                          </td>
                          {columns.id && <td>{item.id}</td>}
                          {columns.userId && <td>{item.userId}</td>}
                          {columns.account && <td>{item.account}</td>}
                          {columns.realName && <td>{item.realName}</td>}
                          {columns.configName && <td>{item.configName}</td>}
                          {columns.amount && (
                            <td className="font-amount">{item.amount}</td>
                          )}
                          {columns.interest && (
                            <td className="font-amount">{item.interest}</td>
                          )}
                          {columns.totalRepay && (
                            <td className="font-amount">{item.totalRepay}</td>
                          )}
                          {columns.days && (
                            <td className="text-center">{item.days}</td>
                          )}
                          {columns.remainingDays && (
                            <td className="text-center">{item.remainingDays}</td>
                          )}
                          {columns.status && (
                            <td className="text-center">
                              {getStatusBadge(item.status)}
                            </td>
                          )}
                          {columns.borrowTime && (
                            <td className="text-nowrap">{item.borrowTime}</td>
                          )}
                          {columns.dueTime && (
                            <td className="text-nowrap">{item.dueTime}</td>
                          )}
                          {columns.repayTime && (
                            <td className="text-nowrap">{item.repayTime}</td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Container */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  显示第 1 到第 {filteredRecords.length} 条记录，总共 {filteredRecords.length} 条记录
                </span>
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
                  <span>上一页</span>
                </li>
                <li className="disabled">
                  <span>下一页</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loan-record-page-wrapper {
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
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .breadcrumb-sep {
          color: #cccccc;
        }

        .content-body {
          padding: 15px;
        }

        .panel-default {
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-radius: 4px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .panel-body {
          padding: 15px;
        }

        /* Common Search Form */
        .form-commonsearch {
          padding: 10px 10px 15px 10px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 15px;
        }

        .search-grid {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          gap: 15px;
        }

        .form-group {
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 700;
          color: #555555;
        }

        .control-input {
          width: 170px;
        }

        .form-control {
          height: 31px;
          padding: 4px 8px;
          font-size: 12px;
          border: 1px solid #d2d6de;
          border-radius: 3px;
          color: #555555;
          outline: none;
          background-color: #ffffff;
          width: 100%;
          box-sizing: border-box;
        }

        .form-control:focus {
          border-color: #18bc9c;
        }

        .form-actions {
          display: flex;
          flex-direction: row;
          gap: 6px;
        }

        /* Action Toolbar */
        .toolbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .quick-search-box {
          width: 160px;
          margin-right: 4px;
        }

        .search-input {
          height: 31px;
          padding: 4px 8px;
          font-size: 12px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.42857143;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          border: 1px solid transparent;
          border-radius: 3px;
          height: 31px;
          box-sizing: border-box;
          transition: all 0.15s ease-in-out;
        }

        .btn.disabled,
        .btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-primary {
          background-color: #2c3e50;
          border-color: #2c3e50;
          color: #ffffff;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #1a242f;
          border-color: #161f29;
        }

        .btn-refresh {
          background-color: #18bc9c;
          border-color: #18bc9c;
          color: #ffffff;
          width: 31px;
          padding: 0;
        }

        .btn-refresh:hover {
          background-color: #15a589;
          border-color: #15a589;
        }

        .btn-success {
          background-color: #18bc9c;
          border-color: #18bc9c;
          color: #ffffff;
        }

        .btn-success:hover:not(:disabled) {
          background-color: #15a589;
          border-color: #15a589;
        }

        .btn-danger {
          background-color: #e74c3c;
          border-color: #e74c3c;
          color: #ffffff;
        }

        .btn-danger:hover:not(:disabled) {
          background-color: #d62c1a;
          border-color: #cd2a19;
        }

        .btn-info {
          background-color: #3498db;
          border-color: #3498db;
          color: #ffffff;
        }

        .btn-info:hover:not(:disabled) {
          background-color: #2980b9;
          border-color: #2980b9;
        }

        .btn-warning {
          background-color: #f39c12;
          border-color: #f39c12;
          color: #ffffff;
        }

        .btn-warning:hover:not(:disabled) {
          background-color: #e67e22;
          border-color: #e67e22;
        }

        .btn-default {
          background-color: #ffffff;
          border-color: #cccccc;
          color: #333333;
        }

        .btn-default:hover {
          background-color: #e6e6e6;
          border-color: #adadad;
        }

        .caret {
          display: inline-block;
          width: 0;
          height: 0;
          margin-left: 2px;
          vertical-align: middle;
          border-top: 4px dashed;
          border-top: 4px solid\\9;
          border-right: 4px solid transparent;
          border-left: 4px solid transparent;
        }

        /* Dropdown Menus */
        .show-dropdown {
          display: block;
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          float: left;
          min-width: 140px;
          padding: 5px 0;
          margin: 2px 0 0;
          font-size: 12px;
          text-align: left;
          list-style: none;
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        }

        .show-dropdown li {
          padding: 4px 12px;
        }

        .show-dropdown li:hover {
          background-color: #f5f5f5;
        }

        .show-dropdown li a {
          color: #333333;
          text-decoration: none;
          display: block;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 12px;
          color: #333;
        }

        /* Table */
        .table-responsive {
          min-height: 0.01%;
          overflow-x: auto;
          border: 1px solid #e7eaec;
        }

        .table {
          width: 100%;
          max-width: 100%;
          margin-bottom: 0;
          border-collapse: collapse;
          font-size: 12px;
        }

        .table > thead > tr > th {
          vertical-align: middle;
          border-bottom: 1px solid #e7eaec;
          border-top: 0;
          border-left: 1px solid #e7eaec;
          border-right: 1px solid #e7eaec;
          background-color: #f9fafb;
          color: #333333;
          font-weight: 600;
          padding: 8px 10px;
          white-space: nowrap;
          text-align: left;
        }

        .table > tbody > tr > td {
          padding: 8px 10px;
          line-height: 1.42857143;
          vertical-align: middle;
          border-top: 1px solid #e7eaec;
          border-left: 1px solid #e7eaec;
          border-right: 1px solid #e7eaec;
          color: #555555;
        }

        .no-records-found {
          padding: 20px !important;
          color: #777777 !important;
          font-size: 13px !important;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: #fcfcfc;
        }

        .table-hover > tbody > tr:hover {
          background-color: #f5f7fa;
        }

        .selected-row {
          background-color: #f0f7fd !important;
        }

        .col-checkbox {
          width: 36px;
          text-align: center !important;
        }

        .font-amount {
          color: #2c3e50;
          font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        }

        .label {
          display: inline-block;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          color: #ffffff;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 3px;
        }

        .bg-green {
          background-color: #00a65a !important;
        }

        .bg-blue {
          background-color: #0073b7 !important;
        }

        .bg-yellow {
          background-color: #f39c12 !important;
        }

        .bg-red {
          background-color: #dd4b39 !important;
        }

        .bg-gray {
          background-color: #d2d6de !important;
          color: #444444 !important;
        }

        /* Pagination */
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pagination-info {
          font-size: 12px;
          color: #777777;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-size-control {
          display: inline-block;
          width: 58px;
          height: 26px;
          padding: 2px 6px;
          font-size: 12px;
          vertical-align: middle;
        }

        .pagination {
          display: flex;
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
          color: #337ab7;
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

        .pagination > li.disabled > span {
          color: #777777;
          cursor: not-allowed;
          background-color: #ffffff;
          border-color: #dddddd;
        }

        @media (max-width: 768px) {
          .search-grid {
            flex-direction: column;
            align-items: stretch;
          }

          .control-input {
            width: 100%;
          }

          .toolbar-container {
            flex-direction: column;
            align-items: stretch;
          }

          .pagination-container {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
