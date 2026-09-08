"use client";

import React, { useState } from "react";
import { INITIAL_IP_WHITELIST, IpWhitelistItem } from "./ipWhitelistData";

export default function AdminIpWhitelistContent() {
  const [items, setItems] = useState<IpWhitelistItem[]>(INITIAL_IP_WHITELIST);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick search
  const [quickSearch, setQuickSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Sorting
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    ip: "",
    remark: "",
  });

  // Delete modal state
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter
  const filteredItems = items.filter((item) => {
    if (!quickSearch.trim()) return true;
    const q = quickSearch.trim().toLowerCase();
    return (
      String(item.id).includes(q) ||
      item.ip.toLowerCase().includes(q) ||
      item.remark.toLowerCase().includes(q) ||
      item.create_time.includes(q)
    );
  });

  // Sort
  const sortedItems = [...filteredItems].sort((a, b) =>
    sortOrder === "asc" ? a.id - b.id : b.id - a.id
  );

  // Paginate
  const totalRows = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const currentItems = sortedItems.slice(startIndex, endIndex);

  // Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentItems.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    currentItems.length > 0 &&
    currentItems.every((i) => selectedIds.includes(i.id));

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("刷新成功 (Refresh successful)");
    }, 400);
  };

  // Toggle IP status
  const handleToggleStatus = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === 1 ? 0 : 1 } : item
      )
    );
    showToast("操作成功 (Status updated)");
  };

  // Add IP
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.ip.trim()) {
      alert("请输入IP地址");
      return;
    }

    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    const newItem: IpWhitelistItem = {
      id: newId,
      ip: addForm.ip.trim(),
      remark: addForm.remark.trim(),
      status: 1,
      create_time: nowStr,
      update_time: nowStr,
    };

    setItems([newItem, ...items]);
    setShowAddModal(false);
    setAddForm({ ip: "", remark: "" });
    showToast("添加成功 (IP added successfully)");
  };

  // Batch delete click
  const handleBatchDeleteClick = () => {
    if (selectedIds.length === 0) {
      alert("请至少选择一条记录");
      return;
    }
    setDeleteConfirmIds(selectedIds);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    setItems((prev) => prev.filter((i) => !deleteConfirmIds.includes(i.id)));
    setSelectedIds((prev) =>
      prev.filter((id) => !deleteConfirmIds.includes(id))
    );
    setDeleteConfirmIds(null);
    showToast("删除成功 (Deleted successfully)");
  };

  return (
    <div className="admin-ipwhitelist-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fastadmin-toast">
          <i className="fa fa-check-circle"></i> {toastMessage}
        </div>
      )}

      {/* Ribbon Breadcrumb */}
      <div id="ribbon" className="ip-ribbon">
        <ol className="breadcrumb pull-left">
          <li>
            <a href="/admin/dashboard" className="addtabsit">
              <i className="fa fa-dashboard"></i> Dashboard
            </a>
          </li>
        </ol>
        <ol className="breadcrumb pull-right">
          <li>
            <a href="javascript:;" onClick={(e) => e.preventDefault()}>
              后台IP白名单
            </a>
          </li>
        </ol>
      </div>

      {/* Content */}
      <div className="content">
        <div className="panel panel-default panel-intro">
          {/* Panel Heading with Tab */}
          <div className="panel-heading">
            <ul className="nav nav-tabs">
              <li className="active">
                <a href="javascript:;" onClick={(e) => e.preventDefault()}>
                  IP白名单
                </a>
              </li>
            </ul>
          </div>

          <div className="panel-body">
            <div className="tab-content">
              <div className="tab-pane active in">
                <div className="widget-body no-padding">
                  {/* Toolbar */}
                  <div id="toolbar" className="toolbar clearfix">
                    <div className="pull-left toolbar-buttons">
                      <a
                        href="javascript:;"
                        className="btn btn-primary btn-refresh"
                        title="刷新"
                        onClick={handleRefresh}
                      >
                        <i
                          className={`fa fa-refresh ${
                            isRefreshing ? "fa-spin" : ""
                          }`}
                        ></i>
                      </a>
                      <a
                        href="javascript:;"
                        className="btn btn-success"
                        id="btn-add-whiteip"
                        onClick={() => setShowAddModal(true)}
                      >
                        <i className="fa fa-plus"></i> 添加IP
                      </a>
                      <a
                        href="javascript:;"
                        className={`btn btn-danger ${
                          selectedIds.length === 0 ? "btn-disabled disabled" : ""
                        }`}
                        id="btn-batch-del-whiteip"
                        onClick={handleBatchDeleteClick}
                      >
                        <i className="fa fa-trash"></i> 批量删除
                      </a>
                    </div>

                    <div className="pull-right toolbar-tools">
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control input-sm"
                          placeholder="Search"
                          value={quickSearch}
                          onChange={(e) => {
                            setQuickSearch(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-responsive">
                    <table
                      id="table"
                      className="table table-striped table-bordered table-hover table-nowrap"
                      width="100%"
                    >
                      <thead>
                        <tr>
                          <th className="bs-checkbox" style={{ width: "36px" }}>
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th
                            className="sortable"
                            style={{ width: "60px" }}
                            onClick={() =>
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            }
                          >
                            ID{" "}
                            <i
                              className={`fa fa-sort${
                                sortOrder === "asc"
                                  ? "-asc text-primary"
                                  : "-desc text-primary"
                              }`}
                            ></i>
                          </th>
                          <th style={{ width: "160px" }}>IP地址</th>
                          <th style={{ width: "200px" }}>备注</th>
                          <th style={{ width: "80px" }}>状态</th>
                          <th style={{ width: "160px" }}>创建时间</th>
                          <th style={{ width: "180px" }}>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center no-records">
                              没有找到匹配的记录 (No records found)
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((item) => (
                            <tr
                              key={item.id}
                              className={
                                selectedIds.includes(item.id) ? "selected" : ""
                              }
                            >
                              <td className="bs-checkbox">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(item.id)}
                                  onChange={() => handleSelectRow(item.id)}
                                />
                              </td>
                              <td>{item.id}</td>
                              <td>
                                <strong style={{ color: "#337ab7" }}>
                                  {item.ip}
                                </strong>
                              </td>
                              <td>{item.remark || "-"}</td>
                              <td>
                                <span
                                  className={`label ${
                                    item.status === 1
                                      ? "label-success"
                                      : "label-default"
                                  }`}
                                >
                                  {item.status === 1 ? "启用" : "禁用"}
                                </span>
                              </td>
                              <td>{item.create_time}</td>
                              <td>
                                {item.status === 1 ? (
                                  <button
                                    className="btn btn-xs btn-warning btn-toggle"
                                    onClick={() => handleToggleStatus(item.id)}
                                    style={{ marginRight: "5px" }}
                                  >
                                    禁用
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-xs btn-success btn-toggle"
                                    onClick={() => handleToggleStatus(item.id)}
                                    style={{ marginRight: "5px" }}
                                  >
                                    启用
                                  </button>
                                )}
                                <button
                                  className="btn btn-xs btn-danger btn-del-single"
                                  onClick={() => setDeleteConfirmIds([item.id])}
                                >
                                  删除
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="pagination-wrapper clearfix">
                    <div className="pull-left pagination-info">
                      总共 {totalRows} 条记录 (Showing{" "}
                      {totalRows > 0 ? startIndex + 1 : 0} to {endIndex} of{" "}
                      {totalRows} rows)
                    </div>
                    <div className="pull-right pagination-controls">
                      <div className="page-size-selector">
                        <select
                          className="form-control input-sm"
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                      <ul className="pagination pagination-sm">
                        <li className={currentPage === 1 ? "disabled" : ""}>
                          <a
                            href="javascript:;"
                            onClick={() =>
                              currentPage > 1 && setCurrentPage(currentPage - 1)
                            }
                          >
                            &laquo;
                          </a>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (pageNum) => (
                            <li
                              key={pageNum}
                              className={
                                currentPage === pageNum ? "active" : ""
                              }
                            >
                              <a
                                href="javascript:;"
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </a>
                            </li>
                          )
                        )}
                        <li
                          className={
                            currentPage === totalPages ? "disabled" : ""
                          }
                        >
                          <a
                            href="javascript:;"
                            onClick={() =>
                              currentPage < totalPages &&
                              setCurrentPage(currentPage + 1)
                            }
                          >
                            &raquo;
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add White IP Modal */}
      {showAddModal && (
        <div className="fastadmin-modal-overlay">
          <div
            className="fastadmin-modal-dialog"
            style={{ maxWidth: "450px" }}
          >
            <div className="fastadmin-modal-header">
              <span className="modal-title">添加白名单IP</span>
              <button
                type="button"
                className="close"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveAdd}>
              <div className="fastadmin-modal-body" style={{ padding: "20px" }}>
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      marginBottom: "6px",
                      fontWeight: 600,
                    }}
                  >
                    IP地址
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="whiteip-input"
                    placeholder="支持单IP / CIDR(如192.168.1.0/24) / 通配符(如192.168.1.*)"
                    value={addForm.ip}
                    required
                    autoFocus
                    onChange={(e) =>
                      setAddForm({ ...addForm, ip: e.target.value })
                    }
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      marginBottom: "6px",
                      fontWeight: 600,
                    }}
                  >
                    备注
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="whiteip-remark"
                    placeholder="可选"
                    value={addForm.remark}
                    onChange={(e) =>
                      setAddForm({ ...addForm, remark: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="fastadmin-modal-footer">
                <button type="submit" className="btn btn-primary btn-sm">
                  确定
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmIds && (
        <div className="fastadmin-modal-overlay">
          <div
            className="fastadmin-modal-dialog"
            style={{ maxWidth: "400px" }}
          >
            <div className="fastadmin-modal-header">
              <span className="modal-title">提示</span>
              <button
                type="button"
                className="close"
                onClick={() => setDeleteConfirmIds(null)}
              >
                &times;
              </button>
            </div>
            <div
              className="fastadmin-modal-body"
              style={{ padding: "25px 20px" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fa fa-question-circle"
                  style={{
                    fontSize: "30px",
                    color: "#f39c12",
                    marginRight: "15px",
                  }}
                ></i>
                <span style={{ fontSize: "14px" }}>
                  {deleteConfirmIds.length === 1
                    ? "确定删除该IP？"
                    : `确定删除选中的 ${deleteConfirmIds.length} 条记录？`}
                </span>
              </div>
            </div>
            <div className="fastadmin-modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleConfirmDelete}
              >
                确定
              </button>
              <button
                type="button"
                className="btn btn-default btn-sm"
                onClick={() => setDeleteConfirmIds(null)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-ipwhitelist-wrapper {
          padding: 0;
        }

        .ip-ribbon {
          background: #fff;
          border-bottom: 1px solid #e7e7e7;
          padding: 8px 15px;
          min-height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ip-ribbon ol.breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 12px;
        }

        .ip-ribbon ol.breadcrumb li {
          display: inline-block;
        }

        .ip-ribbon ol.breadcrumb li + li:before {
          content: "/ ";
          padding: 0 5px;
          color: #ccc;
        }

        .ip-ribbon a {
          color: #777;
          text-decoration: none;
        }

        .ip-ribbon a:hover {
          color: #333;
        }

        .content {
          padding: 15px;
        }

        .panel-intro {
          background: #fff;
          border-radius: 3px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
          border: 1px solid #e7e7e7;
          margin-bottom: 20px;
        }

        .panel-heading {
          padding: 10px 15px 0 15px;
          border-bottom: 1px solid #e7e7e7;
          background-color: #fafafa;
        }

        .nav-tabs {
          border-bottom: none;
          margin-bottom: -1px;
          display: flex;
          list-style: none;
          padding-left: 0;
        }

        .nav-tabs > li > a {
          margin-right: 2px;
          line-height: 1.42857143;
          border: 1px solid transparent;
          border-radius: 4px 4px 0 0;
          padding: 8px 16px;
          font-size: 13px;
          color: #555;
          text-decoration: none;
          display: block;
        }

        .nav-tabs > li.active > a {
          color: #555;
          background-color: #fff;
          border: 1px solid #e7e7e7;
          border-bottom-color: transparent;
          font-weight: 600;
        }

        .panel-body {
          padding: 15px;
        }

        .toolbar {
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .toolbar-buttons {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .toolbar-tools {
          display: flex;
          align-items: center;
        }

        .search-box input {
          width: 160px;
          height: 30px;
          border-radius: 3px;
          border: 1px solid #ccc;
          padding: 5px 10px;
          font-size: 12px;
        }

        .btn {
          display: inline-block;
          padding: 6px 12px;
          margin-bottom: 0;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.42857143;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 3px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-sm {
          padding: 4px 10px;
          font-size: 12px;
        }

        .btn-xs {
          padding: 2px 6px;
          font-size: 11px;
        }

        .btn-primary {
          color: #fff;
          background-color: #3c8dbc;
          border-color: #367fa9;
        }
        .btn-primary:hover {
          background-color: #367fa9;
        }

        .btn-success {
          color: #fff;
          background-color: #00a65a;
          border-color: #008d4c;
        }
        .btn-success:hover {
          background-color: #008d4c;
        }

        .btn-warning {
          color: #fff;
          background-color: #f39c12;
          border-color: #e08e0b;
        }
        .btn-warning:hover {
          background-color: #e08e0b;
        }

        .btn-danger {
          color: #fff;
          background-color: #dd4b39;
          border-color: #d73925;
        }
        .btn-danger:hover {
          background-color: #d73925;
        }

        .btn-default {
          color: #444;
          background-color: #f4f4f4;
          border-color: #ddd;
        }
        .btn-default:hover {
          background-color: #e7e7e7;
        }

        .btn-disabled,
        .btn.disabled {
          cursor: not-allowed;
          opacity: 0.65;
          pointer-events: none;
        }

        .label {
          display: inline;
          padding: 0.2em 0.6em 0.3em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25em;
        }

        .label-success {
          background-color: #5cb85c;
        }

        .label-default {
          background-color: #777;
        }

        .table-responsive {
          overflow-x: auto;
          min-height: 200px;
        }

        .table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          color: #333;
        }

        .table-bordered {
          border: 1px solid #e7e7e7;
        }

        .table-bordered > thead > tr > th,
        .table-bordered > tbody > tr > td {
          border: 1px solid #f4f4f4;
          padding: 8px 10px;
          vertical-align: middle;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: #f9f9f9;
        }

        .table-hover > tbody > tr:hover {
          background-color: #f5f5f5;
        }

        .table > tbody > tr.selected {
          background-color: #e8f4f8;
        }

        .table > thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
          color: #444;
        }

        .sortable {
          cursor: pointer;
          user-select: none;
        }

        .sortable:hover {
          background-color: #f0f0f0;
        }

        .bs-checkbox {
          width: 36px;
          text-align: center;
        }

        .pagination-wrapper {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #f4f4f4;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pagination-info {
          font-size: 12px;
          color: #777;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-size-selector select {
          height: 28px;
          border-radius: 3px;
          border: 1px solid #ccc;
          font-size: 12px;
          padding: 2px 6px;
        }

        .pagination {
          margin: 0;
          display: flex;
          list-style: none;
          padding-left: 0;
          border-radius: 3px;
        }

        .pagination > li > a {
          position: relative;
          padding: 4px 10px;
          margin-left: -1px;
          line-height: 1.42857143;
          color: #337ab7;
          text-decoration: none;
          background-color: #fff;
          border: 1px solid #ddd;
          font-size: 12px;
        }

        .pagination > li:first-child > a {
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
        }

        .pagination > li:last-child > a {
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }

        .pagination > li.active > a {
          z-index: 2;
          color: #fff;
          cursor: default;
          background-color: #337ab7;
          border-color: #337ab7;
        }

        .pagination > li.disabled > a {
          color: #777;
          cursor: not-allowed;
          background-color: #fff;
          border-color: #ddd;
        }

        /* Modal */
        .fastadmin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-in-out;
        }

        .fastadmin-modal-dialog {
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .fastadmin-modal-header {
          padding: 12px 15px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f8f8;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        .fastadmin-modal-header .modal-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .fastadmin-modal-header button.close {
          background: none;
          border: none;
          font-size: 20px;
          color: #aaa;
          cursor: pointer;
        }

        .fastadmin-modal-body {
          padding: 15px 20px;
        }

        .fastadmin-modal-footer {
          padding: 12px 15px;
          border-top: 1px solid #e5e5e5;
          text-align: right;
          background: #f8f8f8;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        .form-control {
          width: 100%;
          height: 32px;
          padding: 6px 12px;
          font-size: 12px;
          line-height: 1.42857143;
          color: #555;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 3px;
          box-sizing: border-box;
        }

        /* FastAdmin Toast */
        .fastadmin-toast {
          position: fixed;
          top: 65px;
          right: 25px;
          background-color: #00a65a;
          color: #fff;
          padding: 12px 20px;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 767px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .toolbar-tools {
            justify-content: flex-end;
          }
          .search-box input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
