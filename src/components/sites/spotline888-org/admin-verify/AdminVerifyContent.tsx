"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";
import { Loader2, Check, X, Eye, RefreshCw, AlertCircle } from "lucide-react";

interface VerifyItem {
  id: number;
  user_id: number;
  account?: string;
  phone?: string;
  real_name: string;
  id_card: string;
  id_img_front: string;
  id_img_back: string;
  profession?: string;
  status: number; // 1: chờ duyệt, 2: duyệt, 3: từ chối
  error_reason?: string;
  created_at: string;
  audit_time?: string;
}

export default function AdminVerifyContent() {
  const [items, setItems] = useState<VerifyItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal preview ảnh
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  // Modal từ chối
  const [rejectModalId, setRejectModalId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVerifies = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getVerifies(
        statusFilter,
        currentPage,
        pageSize,
        searchKeyword.trim() || undefined
      );
      if (res.code === 1 && res.data) {
        setItems(res.data.rows || []);
        setTotal(res.data.total || 0);
      } else {
        showToast(res.msg || "Không thể tải danh sách KYC", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi tải hồ sơ KYC", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifies();
  }, [currentPage, pageSize, statusFilter]);

  const handleAudit = async (id: number, status: "approved" | "rejected", reason = "") => {
    try {
      setActionLoadingId(id);
      const res = await adminApi.auditVerify(id, status, reason);
      if (res.code === 1) {
        showToast(status === "approved" ? "Đã duyệt hồ sơ KYC thành công" : "Đã từ chối hồ sơ KYC", "success");
        setRejectModalId(null);
        setRejectReason("");
        fetchVerifies();
      } else {
        showToast(res.msg || "Xử lý thất bại", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi xử lý", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((r) => r.id));
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
    <div className="tab-pane active" id="tab-verify">
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
            <em>实名认证管理 (Quản lý duyệt KYC)</em>
          </div>
          <ul className="nav nav-tabs">
            <li className={statusFilter === "all" ? "active" : ""}>
              <a href="#all" onClick={(e) => { e.preventDefault(); setStatusFilter("all"); setCurrentPage(1); }}>
                全部 (Tất cả)
              </a>
            </li>
            <li className={statusFilter === "pending" || statusFilter === "1" ? "active" : ""}>
              <a href="#pending" onClick={(e) => { e.preventDefault(); setStatusFilter("1"); setCurrentPage(1); }}>
                未审核 (Chờ duyệt)
              </a>
            </li>
            <li className={statusFilter === "approved" || statusFilter === "2" ? "active" : ""}>
              <a href="#approved" onClick={(e) => { e.preventDefault(); setStatusFilter("2"); setCurrentPage(1); }}>
                审核通过 (Đã duyệt)
              </a>
            </li>
            <li className={statusFilter === "rejected" || statusFilter === "3" ? "active" : ""}>
              <a href="#rejected" onClick={(e) => { e.preventDefault(); setStatusFilter("3"); setCurrentPage(1); }}>
                审核未通过 (Đã từ chối)
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
                  onClick={fetchVerifies}
                  disabled={loading}
                  title="Làm mới"
                >
                  <RefreshCw className={`w-3.5 h-3.5 inline mr-1 ${loading ? "animate-spin" : ""}`} />
                  刷新 (Làm mới)
                </button>
              </div>

              <div className="columns columns-right btn-group pull-right flex items-center gap-2">
                <input
                  type="text"
                  className="form-control input-sm"
                  placeholder="Tìm tên, TK, CCCD..."
                  style={{ width: "200px" }}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setCurrentPage(1);
                      fetchVerifies();
                    }
                  }}
                />
                <select
                  className="form-control input-sm"
                  style={{ width: "130px" }}
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="1">Chờ duyệt</option>
                  <option value="2">Đã duyệt</option>
                  <option value="3">Từ chối</option>
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
                        checked={selectedIds.length === items.length && items.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>ID</th>
                    <th>Hội viên</th>
                    <th>Số điện thoại</th>
                    <th>Họ và tên thật</th>
                    <th>Số CMND / CCCD</th>
                    <th>Nghề nghiệp</th>
                    <th>Ảnh mặt trước (R2)</th>
                    <th>Ảnh mặt sau (R2)</th>
                    <th>Thời gian gửi</th>
                    <th>Lý do từ chối</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin inline mr-2 text-primary" />
                        Đang tải danh sách hồ sơ xác thực...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8 text-gray-400">
                        Không có hồ sơ xác minh nào
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
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
                          <td><strong>{item.account || `UID:${item.user_id}`}</strong></td>
                          <td>{item.phone || "-"}</td>
                          <td><strong className="text-primary">{item.real_name}</strong></td>
                          <td className="font-mono font-bold text-slate-800">{item.id_card}</td>
                          <td>{item.profession || "-"}</td>
                          <td className="text-center">
                            {item.id_img_front ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage({ url: item.id_img_front, title: `Mặt trước CCCD - ${item.real_name}` })}
                                className="btn btn-xs btn-primary inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Mặt trước
                              </button>
                            ) : (
                              <span className="text-gray-300 text-xs">Không có</span>
                            )}
                          </td>
                          <td className="text-center">
                            {item.id_img_back ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage({ url: item.id_img_back, title: `Mặt sau CCCD - ${item.real_name}` })}
                                className="btn btn-xs btn-primary inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Mặt sau
                              </button>
                            ) : (
                              <span className="text-gray-300 text-xs">Không có</span>
                            )}
                          </td>
                          <td className="cell-time text-xs text-gray-500">{item.created_at?.slice(0, 19).replace("T", " ")}</td>
                          <td className="text-xs text-rose-600">{item.error_reason || "-"}</td>
                          <td>
                            {item.status === 2 ? (
                              <span className="badge badge-success">审核通过 (Đã duyệt)</span>
                            ) : item.status === 3 ? (
                              <span className="badge badge-danger">审核未通过 (Từ chối)</span>
                            ) : (
                              <span className="badge badge-warning">未审核 (Chờ duyệt)</span>
                            )}
                          </td>
                          <td>
                            {item.status === 1 ? (
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  disabled={actionLoadingId === item.id}
                                  onClick={() => handleAudit(item.id, "approved")}
                                  className="btn btn-xs btn-success flex items-center gap-1"
                                >
                                  {actionLoadingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                  Duyệt
                                </button>
                                <button
                                  type="button"
                                  disabled={actionLoadingId === item.id}
                                  onClick={() => setRejectModalId(item.id)}
                                  className="btn btn-xs btn-danger flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Từ chối
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">Hoàn tất</span>
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
                Hiển thị trang {currentPage} / {totalPages} (Tổng số {total} hồ sơ)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Trang trước
                </button>
                <span className="px-2 text-sm font-semibold">{currentPage}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Trang sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xem Ảnh Phóng To (Cloudflare R2) */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-3">
              <h4 className="font-bold text-gray-800 text-sm">{previewImage.title}</h4>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="relative w-full h-[480px] bg-slate-100 rounded-lg overflow-hidden">
              <Image
                src={getR2Url(previewImage.url)}
                alt={previewImage.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex justify-end w-full">
              <button
                type="button"
                className="btn btn-sm btn-default"
                onClick={() => setPreviewImage(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Từ Chối KYC Kèm Lý Do */}
      {rejectModalId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl">
            <h4 className="font-bold text-gray-800 text-base mb-2">Từ chối hồ sơ KYC #{rejectModalId}</h4>
            <p className="text-xs text-gray-500 mb-3">Vui lòng nhập lý do từ chối để hội viên biết và gửi lại:</p>
            <textarea
              className="form-control w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-4"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Ảnh mờ không rõ số CCCD, Họ tên không trùng khớp..."
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-default"
                onClick={() => { setRejectModalId(null); setRejectReason(""); }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={actionLoadingId !== null}
                onClick={() => handleAudit(rejectModalId, "rejected", rejectReason)}
                className="btn btn-danger"
              >
                Xác nhận từ chối
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
