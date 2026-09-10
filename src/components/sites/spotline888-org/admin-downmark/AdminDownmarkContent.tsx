"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { Loader2, Check, X, RefreshCw, AlertCircle } from "lucide-react";

interface DownmarkItem {
  id: number;
  order_sn?: string;
  user_id: number;
  username: string;
  real_name: string;
  money: string | number;
  real_money?: string | number;
  fee: string | number;
  balance?: string | number;
  withdraw_type: string;
  bank_name: string;
  bank_card: string;
  status: "approved" | "pending" | "rejected";
  remark?: string;
  created_at: string;
  check_time?: string;
}

export default function AdminDownmarkContent() {
  const [records, setRecords] = useState<DownmarkItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal reject
  const [rejectModalId, setRejectModalId] = useState<number | null>(null);
  const [rejectRemark, setRejectRemark] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDownmarks(statusFilter, currentPage, pageSize);
      if (res.code === 1 && res.data) {
        setRecords(res.data.rows || []);
        setTotal(res.data.total || 0);
      } else {
        showToast(res.msg || "获取提现列表失败", "error");
      }
    } catch (err: any) {
      showToast(err.message || "获取提现列表异常", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, pageSize, statusFilter]);

  const handleAudit = async (id: number, status: "approved" | "rejected", remark = "") => {
    try {
      setActionLoadingId(id);
      const res = await adminApi.checkDownmark(id, status, remark);
      if (res.code === 1) {
        showToast(
          status === "approved"
            ? "审核通过成功"
            : "已驳回提现申请并退还余额",
          "success"
        );
        setRejectModalId(null);
        setRejectRemark("");
        fetchRecords();
      } else {
        showToast(res.msg || "操作失败", "error");
      }
    } catch (err: any) {
      showToast(err.message || "操作异常", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === records.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(records.map((r) => r.id));
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="tab-pane active" id="tab-downmark">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Main Panel */}
      <div className="panel panel-default panel-intro">
        <div className="panel-heading">
          <div className="panel-lead">
            <em>提现管理</em>
          </div>
          <ul className="nav nav-tabs">
            <li className={statusFilter === "all" ? "active" : ""}>
              <a href="#all" onClick={(e) => { e.preventDefault(); setStatusFilter("all"); setCurrentPage(1); }}>
                全部
              </a>
            </li>
            <li className={statusFilter === "pending" ? "active" : ""}>
              <a href="#pending" onClick={(e) => { e.preventDefault(); setStatusFilter("pending"); setCurrentPage(1); }}>
                未审核
              </a>
            </li>
            <li className={statusFilter === "approved" ? "active" : ""}>
              <a href="#approved" onClick={(e) => { e.preventDefault(); setStatusFilter("approved"); setCurrentPage(1); }}>
                审核通过
              </a>
            </li>
            <li className={statusFilter === "rejected" ? "active" : ""}>
              <a href="#rejected" onClick={(e) => { e.preventDefault(); setStatusFilter("rejected"); setCurrentPage(1); }}>
                审核未通过
              </a>
            </li>
          </ul>
        </div>

        <div className="panel-body">
          <div className="bootstrap-table">
            {/* Toolbar */}
            <div className="fixed-table-toolbar flex justify-between items-center mb-3">
              <div className="bs-bars pull-left flex gap-2">
                <button
                  type="button"
                  className="btn btn-default btn-refresh"
                  onClick={fetchRecords}
                  disabled={loading}
                  title="刷新"
                >
                  <RefreshCw className={`w-3.5 h-3.5 inline mr-1 ${loading ? "animate-spin" : ""}`} />
                  刷新
                </button>
              </div>

              <div className="columns columns-right btn-group pull-right flex items-center gap-2">
                <select
                  className="form-control input-sm"
                  style={{ width: "130px" }}
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">全部状态</option>
                  <option value="pending">未审核</option>
                  <option value="approved">审核通过</option>
                  <option value="rejected">审核未通过</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="col-checkbox" style={{ width: "36px" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === records.length && records.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>ID</th>
                    <th>订单号</th>
                    <th>会员</th>
                    <th>收款人</th>
                    <th>提现金额</th>
                    <th>手续费</th>
                    <th>实际到账</th>
                    <th>提现方式</th>
                    <th>开户银行/渠道</th>
                    <th>银行卡号/钱包地址</th>
                    <th>申请时间</th>
                    <th>备注/原因</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={15} className="text-center py-8 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin inline mr-2 text-primary" />
                        正在加载提现数据...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="text-center py-8 text-gray-400">
                        暂无提现记录
                      </td>
                    </tr>
                  ) : (
                    records.map((item) => {
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
                          <td>{item.id}</td>
                          <td className="font-mono text-xs">{item.order_sn || `WITH${item.id}`}</td>
                          <td><strong>{item.username || item.user_id}</strong></td>
                          <td><strong>{item.real_name || "-"}</strong></td>
                          <td className="text-right font-bold text-rose-600">
                            -{Number(item.money).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="text-right text-xs text-gray-500">
                            {Number(item.fee || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="text-right font-bold text-emerald-600">
                            {Number(item.real_money || item.money).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td>
                            <span className={`label ${item.withdraw_type === "usdt" ? "label-success" : "label-info"}`}>
                              {item.withdraw_type === "usdt" ? "USDT钱包" : "银行转账"}
                            </span>
                          </td>
                          <td>{item.bank_name || "-"}</td>
                          <td className="font-mono text-xs font-bold text-slate-800">{item.bank_card || "-"}</td>
                          <td className="cell-time text-xs text-gray-500">{item.created_at?.slice(0, 19).replace("T", " ")}</td>
                          <td className="text-xs">{item.remark || "-"}</td>
                          <td>
                            {item.status === "approved" ? (
                              <span className="badge badge-success">审核通过</span>
                            ) : item.status === "rejected" ? (
                              <span className="badge badge-danger">审核未通过</span>
                            ) : (
                              <span className="badge badge-warning">未审核</span>
                            )}
                          </td>
                          <td>
                            {item.status === "pending" ? (
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  disabled={actionLoadingId === item.id}
                                  onClick={() => handleAudit(item.id, "approved")}
                                  className="btn btn-xs btn-success flex items-center gap-1"
                                >
                                  {actionLoadingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                  通过
                                </button>
                                <button
                                  type="button"
                                  disabled={actionLoadingId === item.id}
                                  onClick={() => setRejectModalId(item.id)}
                                  className="btn btn-xs btn-danger flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> 驳回
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">已处理</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-container flex justify-between items-center mt-3">
              <div className="pagination-info text-sm text-gray-500">
                显示第 {currentPage} / {totalPages} 页 (共 {total} 条记录)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  上一页
                </button>
                <span className="px-2 text-sm font-semibold">{currentPage}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 驳回提现申请 */}
      {rejectModalId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl">
            <h4 className="font-bold text-gray-800 text-base mb-2">驳回提现申请 #{rejectModalId}</h4>
            <p className="text-xs text-gray-500 mb-3">
              提现金额将自动退回到会员账户。请输入驳回原因：
            </p>
            <textarea
              className="form-control w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-4"
              rows={3}
              value={rejectRemark}
              onChange={(e) => setRejectRemark(e.target.value)}
              placeholder="例如：银行卡信息有误、未完成打码量..."
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-default"
                onClick={() => { setRejectModalId(null); setRejectRemark(""); }}
              >
                取消
              </button>
              <button
                type="button"
                disabled={actionLoadingId !== null}
                onClick={() => handleAudit(rejectModalId, "rejected", rejectRemark)}
                className="btn btn-danger"
              >
                确认驳回并退款
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tab-pane {
          padding: 15px;
          background-color: #f1f4f6;
          min-height: calc(100vh - 50px);
          font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
            "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
          color: #333333;
        }

        .panel-intro {
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-radius: 3px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }

        .panel-heading {
          background-color: #f5f5f6;
          border-bottom: 1px solid #e7eaec;
          padding: 12px 15px 0 15px;
          position: relative;
        }

        .panel-lead {
          margin-bottom: 10px;
          font-size: 14px;
          color: #333333;
          font-weight: 600;
        }

        .panel-lead em {
          font-style: normal;
        }

        .nav-tabs {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          border-bottom: 1px solid transparent;
          gap: 4px;
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
          cursor: pointer;
          transition: all 0.15s;
        }

        .nav-tabs > li > a:hover {
          background-color: #e6e6e6;
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
          background-color: #ffffff;
        }

        .bootstrap-table {
          position: relative;
          clear: both;
        }

        .fixed-table-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .form-control {
          height: 31px;
          padding: 4px 10px;
          font-size: 12px;
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

        .input-sm {
          height: 30px;
          font-size: 12px;
        }

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
          background-color: #ffffff;
        }

        .table > thead > tr > th {
          vertical-align: middle;
          border-bottom: 2px solid #ddd;
          border-top: 0;
          border-left: 1px solid #e7eaec;
          border-right: 1px solid #e7eaec;
          padding: 9px 8px;
          line-height: 1.42857143;
          text-align: center;
          font-weight: 600;
          background-color: #f5f5f6;
          color: #333333;
        }

        .table > tbody > tr > td {
          padding: 8px 8px;
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

        .table > tbody > tr.selected {
          background-color: #fcf8e3 !important;
        }

        .col-checkbox {
          width: 36px;
          text-align: center;
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
          transition: all 0.15s ease-in-out;
        }

        .btn:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .btn-default {
          color: #333333;
          background-color: #ffffff;
          border-color: #cccccc;
        }

        .btn-default:hover:not(:disabled) {
          background-color: #e6e6e6;
          border-color: #adadad;
        }

        .btn-primary {
          color: #ffffff;
          background-color: #18bc9c;
          border-color: #18bc9c;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #15a589;
          border-color: #15a589;
        }

        .btn-success {
          color: #ffffff;
          background-color: #2c3e50;
          border-color: #2c3e50;
        }

        .btn-success:hover:not(:disabled) {
          background-color: #1a252f;
        }

        .btn-danger {
          color: #ffffff;
          background-color: #e74c3c;
          border-color: #e74c3c;
        }

        .btn-danger:hover:not(:disabled) {
          background-color: #d62c1a;
        }

        .btn-xs {
          padding: 2px 6px;
          font-size: 11px;
          height: 22px;
        }

        .btn-sm {
          padding: 4px 10px;
          font-size: 12px;
          height: 28px;
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

        .label-info {
          background-color: #3498db;
        }

        .badge {
          display: inline-block;
          min-width: 10px;
          padding: 3px 7px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1;
          color: #fff;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          border-radius: 10px;
        }

        .badge-success {
          background-color: #27ae60;
        }

        .badge-warning {
          background-color: #f39c12;
        }

        .badge-danger {
          background-color: #e74c3c;
        }

        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding: 0 4px;
        }

        .pagination-info {
          font-size: 12px;
          color: #777777;
        }
      `}</style>
    </div>
  );
}
