"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { YuebaoOrderItem } from "./yuebaoOrderData";

export default function AdminYuebaoOrderContent() {
  const [orders, setOrders] = useState<YuebaoOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick search
  const [quickSearch, setQuickSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Sort state
  const [sortField, setSortField] = useState<keyof YuebaoOrderItem>("share_id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    user_id: "",
    username: "",
    amount: "",
    type: "1",
    status: "2",
    config_id: "",
    tx: "0",
  });

  // Delete modal state
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchYuebaoOrders = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      const res = await adminApi.getYuebaoOrders(currentPage, pageSize);
      if (res && res.code === 1 && res.data?.rows) {
        const mapped: YuebaoOrderItem[] = res.data.rows.map((r: any) => ({
          share_id: r.id,
          user_id: r.user_id,
          username: r.username || `User_${r.user_id}`,
          amount: parseFloat(r.amount || 0).toFixed(2),
          create_time: r.created_at ? String(r.created_at).replace('T', ' ').substring(0, 19) : '',
        }));
        setOrders(mapped);
      }
    } catch {
      //
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchYuebaoOrders();
  }, [currentPage, pageSize]);

  // Filter
  const filteredOrders = orders.filter((item) => {
    if (!quickSearch.trim()) return true;
    const q = quickSearch.trim().toLowerCase();
    return (
      String(item.share_id).includes(q) ||
      String(item.user_id).includes(q) ||
      item.username.toLowerCase().includes(q) ||
      item.amount.includes(q) ||
      item.create_time.includes(q)
    );
  });

  // Sort
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    const strA = String(valA);
    const strB = String(valB);
    return sortOrder === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  // Paginate
  const totalRows = sortedOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const currentOrders = sortedOrders.slice(startIndex, endIndex);

  // Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentOrders.map((o) => o.share_id));
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
    currentOrders.length > 0 &&
    currentOrders.every((o) => selectedIds.includes(o.share_id));

  // Sort toggle
  const handleSort = (field: keyof YuebaoOrderItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Refresh
  const handleRefresh = () => {
    fetchYuebaoOrders();
    showToast("刷新成功 (Refresh successful)");
  };

  // Add order
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.user_id.trim() || !addForm.amount.trim()) {
      alert("请填写完整的订单信息 (Please fill required fields)");
      return;
    }

    const newId = Math.max(...orders.map((o) => o.share_id), 0) + 1;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    const newOrder: YuebaoOrderItem = {
      share_id: newId,
      user_id: Number(addForm.user_id),
      username: addForm.username.trim() || `user_${addForm.user_id}`,
      amount: Number(addForm.amount).toFixed(2),
      create_time: nowStr,
    };

    setOrders([newOrder, ...orders]);
    setShowAddModal(false);
    setAddForm({
      user_id: "",
      username: "",
      amount: "",
      type: "1",
      status: "2",
      config_id: "",
      tx: "0",
    });
    showToast("添加成功 (Order created successfully)");
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    setOrders((prev) =>
      prev.filter((o) => !deleteConfirmIds.includes(o.share_id))
    );
    setSelectedIds((prev) =>
      prev.filter((id) => !deleteConfirmIds.includes(id))
    );
    setDeleteConfirmIds(null);
    showToast("删除成功 (Deleted successfully)");
  };

  return (
    <div className="admin-yuebao-order-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fastadmin-toast">
          <i className="fa fa-check-circle"></i> {toastMessage}
        </div>
      )}

      {/* Ribbon Breadcrumb */}
      <div id="ribbon" className="order-ribbon">
        <ol className="breadcrumb pull-left">
          <li>
            <a href="/admin/dashboard" className="addtabsit">
              <i className="fa fa-dashboard"></i> 控制台
            </a>
          </li>
        </ol>
        <ol className="breadcrumb pull-right">
          <li>
            <a href="javascript:;" onClick={(e) => e.preventDefault()}>
              余额宝管理
            </a>
          </li>
          <li>
            <a href="javascript:;" onClick={(e) => e.preventDefault()}>
              余额宝订单
            </a>
          </li>
        </ol>
      </div>

      {/* Content */}
      <div className="content">
        <div className="panel panel-default panel-intro">
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
                        className="btn btn-success btn-add"
                        title="添加"
                        onClick={() => setShowAddModal(true)}
                      >
                        <i className="fa fa-plus"></i> 添加
                      </a>
                      <a
                        href="javascript:;"
                        className={`btn btn-danger btn-del ${
                          selectedIds.length === 0 ? "btn-disabled disabled" : ""
                        }`}
                        title="删除"
                        onClick={() =>
                          selectedIds.length > 0 &&
                          setDeleteConfirmIds(selectedIds)
                        }
                      >
                        <i className="fa fa-trash"></i> 删除
                      </a>
                    </div>

                    <div className="pull-right toolbar-tools">
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control input-sm"
                          placeholder="搜索"
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
                            style={{ width: "80px" }}
                            onClick={() => handleSort("share_id")}
                          >
                            ID{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "share_id"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th
                            className="sortable"
                            style={{ width: "80px" }}
                            onClick={() => handleSort("user_id")}
                          >
                            用户ID{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "user_id"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th
                            className="sortable"
                            style={{ width: "120px" }}
                            onClick={() => handleSort("username")}
                          >
                            用户名{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "username"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th
                            className="sortable"
                            style={{ width: "150px" }}
                            onClick={() => handleSort("amount")}
                          >
                            金额{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "amount"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th
                            className="sortable"
                            style={{ width: "180px" }}
                            onClick={() => handleSort("create_time")}
                          >
                            创建时间{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "create_time"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th className="text-center" style={{ width: "150px" }}>
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-gray-500">
                              <i className="fa fa-refresh fa-spin mr-2"></i> 正在加载余利宝订单...
                            </td>
                          </tr>
                        ) : currentOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center no-records">
                              没有找到匹配的记录
                            </td>
                          </tr>
                        ) : (
                          currentOrders.map((item) => (
                            <tr
                              key={item.share_id}
                              className={
                                selectedIds.includes(item.share_id)
                                  ? "selected"
                                  : ""
                              }
                            >
                              <td className="bs-checkbox">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(item.share_id)}
                                  onChange={() =>
                                    handleSelectRow(item.share_id)
                                  }
                                />
                              </td>
                              <td>{item.share_id}</td>
                              <td>{item.user_id}</td>
                              <td>
                                <strong>{item.username}</strong>
                              </td>
                              <td style={{ color: "#00a65a", fontWeight: "bold" }}>
                                {item.amount}
                              </td>
                              <td>{item.create_time || "未设置"}</td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-xs btn-danger btn-delone"
                                  title="删除"
                                  onClick={() =>
                                    setDeleteConfirmIds([item.share_id])
                                  }
                                >
                                  <i className="fa fa-trash"></i> 删除
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
                      显示第 {totalRows > 0 ? startIndex + 1 : 0} 到第 {endIndex} 条记录，总共 {totalRows} 条记录
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fastadmin-modal-overlay">
          <div className="fastadmin-modal-dialog">
            <div className="fastadmin-modal-header">
              <span className="modal-title">添加 - 余额宝订单</span>
              <button
                type="button"
                className="close"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveAdd}>
              <div className="fastadmin-modal-body">
                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    用户ID:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="number"
                      className="form-control"
                      value={addForm.user_id}
                      placeholder="请输入用户ID"
                      required
                      onChange={(e) =>
                        setAddForm({ ...addForm, user_id: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    用户名:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={addForm.username}
                      placeholder="用户名（选填）"
                      onChange={(e) =>
                        setAddForm({ ...addForm, username: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    金额:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={addForm.amount}
                      placeholder="0.00"
                      required
                      onChange={(e) =>
                        setAddForm({ ...addForm, amount: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    订单类型:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <select
                      className="form-control"
                      value={addForm.type}
                      onChange={(e) =>
                        setAddForm({ ...addForm, type: e.target.value })
                      }
                    >
                      <option value="1">已确定</option>
                      <option value="2">待确定</option>
                      <option value="3">收益</option>
                      <option value="4">转出</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    状态:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <select
                      className="form-control"
                      value={addForm.status}
                      onChange={(e) =>
                        setAddForm({ ...addForm, status: e.target.value })
                      }
                    >
                      <option value="1">待确认</option>
                      <option value="2">已确认</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    配置ID:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="number"
                      className="form-control"
                      value={addForm.config_id}
                      placeholder="配置ID（选填）"
                      onChange={(e) =>
                        setAddForm({ ...addForm, config_id: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    转入/转出:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <select
                      className="form-control"
                      value={addForm.tx}
                      onChange={(e) =>
                        setAddForm({ ...addForm, tx: e.target.value })
                      }
                    >
                      <option value="0">转入</option>
                      <option value="1">转出</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="fastadmin-modal-footer">
                <button type="submit" className="btn btn-success btn-embossed">
                  确定
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-embossed"
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
            style={{ maxWidth: "420px" }}
          >
            <div className="fastadmin-modal-header">
              <span className="modal-title">温馨提示</span>
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
                  className="fa fa-exclamation-triangle"
                  style={{
                    fontSize: "32px",
                    color: "#dd4b39",
                    marginRight: "15px",
                  }}
                ></i>
                <span style={{ fontSize: "14px" }}>
                  {deleteConfirmIds.length === 1
                    ? "确定删除这条记录吗？"
                    : `确定删除选中的 ${deleteConfirmIds.length} 条记录?`}
                </span>
              </div>
            </div>
            <div className="fastadmin-modal-footer">
              <button
                type="button"
                className="btn btn-danger btn-sm"
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
        .admin-yuebao-order-wrapper {
          padding: 0;
        }

        .order-ribbon {
          background: #fff;
          border-bottom: 1px solid #e7e7e7;
          padding: 8px 15px;
          min-height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-ribbon ol.breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 12px;
        }

        .order-ribbon ol.breadcrumb li {
          display: inline-block;
        }

        .order-ribbon ol.breadcrumb li + li:before {
          content: "/ ";
          padding: 0 5px;
          color: #ccc;
        }

        .order-ribbon a {
          color: #777;
          text-decoration: none;
        }

        .order-ribbon a:hover {
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

        .table-responsive {
          overflow-x: auto;
          min-height: 250px;
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
          max-width: 600px;
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

        .fastadmin-modal-body .form-group {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .fastadmin-modal-body .control-label {
          font-size: 12px;
          text-align: right;
          color: #555;
          margin-bottom: 0;
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
          .fastadmin-modal-body .form-group {
            flex-direction: column;
            align-items: flex-start;
          }
          .fastadmin-modal-body .control-label {
            text-align: left;
            margin-bottom: 4px;
          }
        }
      `}</style>
    </div>
  );
}
