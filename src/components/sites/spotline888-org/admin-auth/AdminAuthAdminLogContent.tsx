"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

interface AdminLog {
  id: number;
  admin_id: number;
  username: string;
  url: string;
  title: string;
  content: string;
  ip: string;
  useragent: string;
  createtime: number; // Unix timestamp
}

function formatDateTime(timestamp: number): string {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, "0");
  const D = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

export default function AdminAuthAdminLogContent() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommonSearchOpen, setIsCommonSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Commonsearch fields
  const [commonSearch, setCommonSearch] = useState({
    username: "",
    title: "",
    url: "",
    ip: "",
  });

  // Modal dialog state (Detail view)
  const [detailLog, setDetailLog] = useState<AdminLog | null>(null);

  // Delete confirmation modal
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const loadLogs = async () => {
    try {
      const res = await adminApi.getAdminLogs(50);
      if (res.code === 1 && Array.isArray(res.data)) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error("Failed to load admin logs:", err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === logs.length && logs.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(logs.map((l) => l.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Delete handlers
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirmIds(selectedIds);
  };

  const handleDeleteOne = (id: number) => {
    setDeleteConfirmIds([id]);
  };

  const executeDelete = async () => {
    if (!deleteConfirmIds) return;
    try {
      await adminApi.deleteAdminLogs(deleteConfirmIds);
      showToast("删除成功！");
      await loadLogs();
      setSelectedIds((prev) => prev.filter((id) => !deleteConfirmIds.includes(id)));
    } catch (err) {
      console.error("Delete logs failed:", err);
      alert("删除日志失败");
    }
    setDeleteConfirmIds(null);
  };

  // Filtered rows
  const filteredLogs = logs.filter((log) => {
    // Quick search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchQuick =
        log.username.toLowerCase().includes(q) ||
        log.title.toLowerCase().includes(q) ||
        log.url.toLowerCase().includes(q) ||
        log.ip.toLowerCase().includes(q) ||
        log.useragent.toLowerCase().includes(q);
      if (!matchQuick) return false;
    }

    // Common search
    if (commonSearch.username && !log.username.toLowerCase().includes(commonSearch.username.toLowerCase().trim())) return false;
    if (commonSearch.title && !log.title.toLowerCase().includes(commonSearch.title.toLowerCase().trim())) return false;
    if (commonSearch.url && !log.url.toLowerCase().includes(commonSearch.url.toLowerCase().trim())) return false;
    if (commonSearch.ip && !log.ip.toLowerCase().includes(commonSearch.ip.toLowerCase().trim())) return false;

    return true;
  });

  return (
    <div className="auth-adminlog-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> 控制台
        </div>
        <div className="breadcrumb-right">
          <span>系统设置</span>
          <span className="breadcrumb-sep">/</span>
          <span>权限管理</span>
          <span className="breadcrumb-sep">/</span>
          <span>管理员日志</span>
        </div>
      </div>

      <div className="content-body">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="alert alert-success alert-dismissible">
            <button
              type="button"
              className="close"
              onClick={() => setToastMessage(null)}
            >
              &times;
            </button>
            <i className="fa fa-check"></i> {toastMessage}
          </div>
        )}

        <div className="panel panel-default panel-intro">
          <div className="panel-heading">
            <div className="panel-lead">
              <em>管理员日志</em>管理人员操作日志,可以记录管理人员详细操作信息
            </div>
          </div>

          <div className="panel-body">
            {/* Common Search Form (Collapsible) */}
            {isCommonSearchOpen && (
              <div className="commonsearch-table">
                <form
                  className="form-horizontal"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <fieldset>
                    <div className="row search-grid">
                      <div className="form-group-col">
                        <label className="control-label">用户名</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={commonSearch.username}
                          onChange={(e) =>
                            setCommonSearch({
                              ...commonSearch,
                              username: e.target.value,
                            })
                          }
                          placeholder="用户名"
                        />
                      </div>

                      <div className="form-group-col">
                        <label className="control-label">标题</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={commonSearch.title}
                          onChange={(e) =>
                            setCommonSearch({
                              ...commonSearch,
                              title: e.target.value,
                            })
                          }
                          placeholder="模糊搜索"
                        />
                      </div>

                      <div className="form-group-col">
                        <label className="control-label">操作URL</label>
                        <input
                          type="text"
                          className="form-control"
                          name="url"
                          value={commonSearch.url}
                          onChange={(e) =>
                            setCommonSearch({
                              ...commonSearch,
                              url: e.target.value,
                            })
                          }
                          placeholder="操作URL"
                        />
                      </div>

                      <div className="form-group-col">
                        <label className="control-label">IP地址</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ip"
                          value={commonSearch.ip}
                          onChange={(e) =>
                            setCommonSearch({
                              ...commonSearch,
                              ip: e.target.value,
                            })
                          }
                          placeholder="IP地址"
                        />
                      </div>

                      <div className="form-group-col actions-col">
                        <label className="control-label">&nbsp;</label>
                        <div className="search-buttons">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => showToast("查询完成")}
                          >提交</button>
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={() =>
                              setCommonSearch({
                                username: "",
                                title: "",
                                url: "",
                                ip: "",
                              })
                            }
                          >重置</button>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            )}

            {/* Toolbar Row */}
            <div className="toolbar-container">
              {/* Left Action Buttons */}
              <div className="toolbar-left">
                <button
                  type="button"
                  className="btn btn-primary btn-refresh"
                  title="刷新"
                  onClick={() => showToast("刷新成功")}
                >
                  <i className="fa fa-refresh"></i>
                </button>
                <button
                  type="button"
                  className={`btn btn-danger btn-del ${
                    selectedIds.length === 0 ? "btn-disabled disabled" : ""
                  }`}
                  title="删除"
                  disabled={selectedIds.length === 0}
                  onClick={handleDeleteSelected}
                >
                  <i className="fa fa-trash"></i> 删除
                </button>
              </div>

              {/* Right Search & Controls */}
              <div className="toolbar-right">
                <div className="search-input-group">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="搜索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-default"
                    title="切换视图"
                    onClick={() => {}}
                  >
                    <i className="fa fa-list-alt"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    title="列"
                    onClick={() => {}}
                  >
                    <i className="fa fa-th"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    title="导出"
                    onClick={() => showToast("导出日志成功")}
                  >
                    <i className="fa fa-sign-out"></i>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-default ${
                      isCommonSearchOpen ? "active" : ""
                    }`}
                    title="通用搜索"
                    onClick={() => setIsCommonSearchOpen(!isCommonSearchOpen)}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Log Table */}
            <div className="table-responsive-container">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "38px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={
                          logs.length > 0 && selectedIds.length === logs.length
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th style={{ width: "70px" }}>ID</th>
                    <th style={{ width: "90px" }}>用户名</th>
                    <th>标题</th>
                    <th>操作页面</th>
                    <th style={{ width: "120px" }}>IP</th>
                    <th style={{ width: "100px" }}>浏览器</th>
                    <th style={{ width: "160px" }}>操作时间</th>
                    <th style={{ width: "90px", textAlign: "center" }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center no-records">
                        没有找到匹配的记录
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const browserSummary = log.useragent
                        ? log.useragent.split(" ")[0]
                        : "Mozilla/5.0";
                      return (
                        <tr key={log.id}>
                          {/* Checkbox */}
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(log.id)}
                              onChange={() => toggleSelectOne(log.id)}
                            />
                          </td>
                          {/* ID */}
                          <td>{log.id}</td>
                          {/* Username */}
                          <td>
                            <a
                              href="javascript:;"
                              onClick={(e) => {
                                e.preventDefault();
                                setSearchQuery(log.username);
                              }}
                            >
                              {log.username}
                            </a>
                          </td>
                          {/* Title */}
                          <td>{log.title || "-"}</td>
                          {/* Url */}
                          <td className="url-cell" title={log.url}>
                            <a
                              href={log.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="log-url-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              {log.url}
                            </a>
                          </td>
                          {/* IP */}
                          <td>
                            <a
                              href="javascript:;"
                              onClick={(e) => {
                                e.preventDefault();
                                setSearchQuery(log.ip);
                              }}
                            >
                              {log.ip}
                            </a>
                          </td>
                          {/* Browser */}
                          <td>
                            <span className="btn btn-xs btn-browser">
                              {browserSummary}
                            </span>
                          </td>
                          {/* Create Time */}
                          <td>{formatDateTime(log.createtime)}</td>
                          {/* Operate */}
                          <td style={{ textAlign: "center" }}>
                            <div className="operate-buttons">
                              <button
                                type="button"
                                className="btn btn-info btn-xs btn-detail btn-dialog"
                                title="详情"
                                onClick={() => setDetailLog(log)}
                              >
                                <i className="fa fa-list"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-xs btn-delone"
                                title="删除"
                                onClick={() => handleDeleteOne(log.id)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Record Count */}
            <div className="pagination-wrapper">
              <div className="pagination-info">
                显示第 1 到第 {filteredLogs.length} 条记录，总共 54278 条记录 每页显示 10 条记录
              </div>
              <div className="pagination-controls">
                <ul className="pagination">
                  <li className="disabled">
                    <a href="javascript:;" onClick={(e) => e.preventDefault()}>
                      &laquo;
                    </a>
                  </li>
                  <li className="active">
                    <a href="javascript:;" onClick={(e) => e.preventDefault()}>
                      1
                    </a>
                  </li>
                  <li>
                    <a href="javascript:;" onClick={(e) => e.preventDefault()}>
                      2
                    </a>
                  </li>
                  <li>
                    <a href="javascript:;" onClick={(e) => e.preventDefault()}>
                      3
                    </a>
                  </li>
                  <li>
                    <a href="javascript:;" onClick={(e) => e.preventDefault()}>
                      &raquo;
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal Dialog */}
      {detailLog && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => setDetailLog(null)}
                >
                  &times;
                </button>
                <h4 className="modal-title">操作日志详情</h4>
              </div>
              <div className="modal-body modal-scroll">
                <table className="table table-striped table-detail">
                  <thead>
                    <tr>
                      <th style={{ width: "25%" }}>字段</th>
                      <th style={{ width: "75%" }}>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>ID</strong></td>
                      <td>{detailLog.id}</td>
                    </tr>
                    <tr>
                      <td><strong>管理员ID</strong></td>
                      <td>{detailLog.admin_id}</td>
                    </tr>
                    <tr>
                      <td><strong>用户名</strong></td>
                      <td>{detailLog.username}</td>
                    </tr>
                    <tr>
                      <td><strong>操作URL</strong></td>
                      <td><code>{detailLog.url}</code></td>
                    </tr>
                    <tr>
                      <td><strong>日志标题</strong></td>
                      <td>{detailLog.title || "-"}</td>
                    </tr>
                    <tr>
                      <td><strong>操作内容</strong></td>
                      <td>
                        <pre className="pre-content">{detailLog.content}</pre>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>IP地址</strong></td>
                      <td>{detailLog.ip}</td>
                    </tr>
                    <tr>
                      <td><strong>用户代理</strong></td>
                      <td>{detailLog.useragent}</td>
                    </tr>
                    <tr>
                      <td><strong>操作时间</strong></td>
                      <td>{detailLog.createtime} ({formatDateTime(detailLog.createtime)})</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-embossed"
                  onClick={() => setDetailLog(null)}
                >关闭</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmIds && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => setDeleteConfirmIds(null)}
                >
                  &times;
                </button>
                <h4 className="modal-title">温馨提示</h4>
              </div>
              <div className="modal-body">
                <p>
                  确定要删除所选的 <strong>{deleteConfirmIds.length}</strong>{" "}
                  条操作日志吗？此操作无法撤销。
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger btn-embossed"
                  onClick={executeDelete}
                >
                  确定删除
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-embossed"
                  onClick={() => setDeleteConfirmIds(null)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .auth-adminlog-wrapper {
          padding: 0;
          background-color: #f1f4f6;
          min-height: calc(100vh - 50px);
          font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
            "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
          font-size: 13px;
          color: #333333;
        }

        .content-header-ribbon {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 15px;
          background-color: #e8ecf0;
          border-bottom: 1px solid #d2d6de;
          font-size: 12px;
        }

        .breadcrumb-left {
          color: #777777;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .breadcrumb-right {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #777777;
        }

        .breadcrumb-sep {
          color: #cccccc;
        }

        .content-body {
          padding: 15px;
        }

        .alert-success {
          background-color: #dff0d8;
          border-color: #d6e9c6;
          color: #3c763d;
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 15px;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .alert-success .close {
          border: none;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
          color: #3c763d;
        }

        .panel-default {
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-radius: 4px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .panel-heading {
          padding: 12px 15px;
          border-bottom: 1px solid #e7eaec;
          background-color: #ffffff;
        }

        .panel-lead {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        .panel-lead em {
          font-style: normal;
          color: #18bc9c;
          margin-right: 8px;
        }

        .panel-body {
          padding: 15px;
        }

        /* Commonsearch */
        .commonsearch-table {
          background-color: #f9f9f9;
          padding: 15px;
          border: 1px solid #e7eaec;
          border-radius: 3px;
          margin-bottom: 15px;
        }

        .search-grid {
          display: flex;
          flex-wrap: wrap;
          margin-left: -5px;
          margin-right: -5px;
        }

        .form-group-col {
          padding-left: 5px;
          padding-right: 5px;
          margin-bottom: 10px;
          flex: 1 1 20%;
          min-width: 150px;
        }

        .form-group-col label.control-label {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #555;
        }

        .actions-col {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-width: 130px;
        }

        .search-buttons {
          display: flex;
          gap: 6px;
        }

        /* Toolbar */
        .toolbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-input {
          height: 31px;
          font-size: 12px;
          padding: 4px 10px;
          width: 170px;
        }

        .btn {
          display: inline-block;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.42857143;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 3px;
          transition: background-color 0.2s;
        }

        .btn-xs {
          padding: 2px 6px;
          font-size: 11px;
          border-radius: 2px;
        }

        .btn-primary {
          color: #ffffff;
          background-color: #3498db;
          border-color: #3498db;
        }

        .btn-primary:hover {
          background-color: #217dbb;
          border-color: #2077b2;
        }

        .btn-info {
          color: #ffffff;
          background-color: #00c0ef;
          border-color: #00acd6;
        }

        .btn-info:hover {
          background-color: #00a7d0;
          border-color: #0097bc;
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

        .btn-danger {
          color: #ffffff;
          background-color: #e74c3c;
          border-color: #e74c3c;
        }

        .btn-danger:hover {
          background-color: #d62c1a;
          border-color: #cd2a19;
        }

        .btn-default {
          color: #333333;
          background-color: #ffffff;
          border-color: #cccccc;
        }

        .btn-default:hover,
        .btn-default.active {
          background-color: #e6e6e6;
          border-color: #adadad;
        }

        .btn-browser {
          background-color: #f4f4f4;
          border: 1px solid #ddd;
          color: #444;
          font-size: 10px;
        }

        .btn-embossed {
          box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.15);
        }

        .btn-disabled,
        .btn:disabled {
          cursor: not-allowed;
          filter: alpha(opacity=65);
          opacity: 0.65;
          box-shadow: none;
        }

        .btn-group {
          display: inline-flex;
        }

        .btn-group .btn {
          border-radius: 0;
          margin-left: -1px;
        }

        .btn-group .btn:first-child {
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
          margin-left: 0;
        }

        .btn-group .btn:last-child {
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }

        /* Table */
        .table-responsive-container {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border: 1px solid #e7eaec;
          border-radius: 3px;
        }

        .table {
          width: 100%;
          min-width: 900px;
          margin-bottom: 0;
          border-collapse: collapse;
          font-size: 12px;
        }

        .table > thead > tr > th {
          background-color: #f5f5f6;
          color: #333333;
          font-weight: 600;
          padding: 8px 10px;
          border-bottom: 2px solid #e7eaec;
          border-top: none;
          vertical-align: middle;
        }

        .table > tbody > tr > td {
          padding: 8px 10px;
          border-top: 1px solid #e7eaec;
          vertical-align: middle;
          color: #555555;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: #f9f9f9;
        }

        .table-hover > tbody > tr:hover {
          background-color: #f1f8ff;
        }

        .url-cell {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .log-url-link {
          color: #337ab7;
          text-decoration: none;
        }

        .log-url-link:hover {
          text-decoration: underline;
        }

        .operate-buttons {
          display: inline-flex;
          gap: 4px;
        }

        .no-records {
          padding: 25px !important;
          color: #888888;
        }

        /* Pagination */
        .pagination-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          font-size: 12px;
          color: #777;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pagination {
          display: inline-flex;
          padding-left: 0;
          margin: 0;
          border-radius: 3px;
          list-style: none;
        }

        .pagination > li > a {
          position: relative;
          float: left;
          padding: 5px 10px;
          line-height: 1.42857143;
          text-decoration: none;
          color: #337ab7;
          background-color: #ffffff;
          border: 1px solid #ddd;
          margin-left: -1px;
        }

        .pagination > li.active > a {
          z-index: 2;
          color: #ffffff;
          background-color: #18bc9c;
          border-color: #18bc9c;
          cursor: default;
        }

        .pagination > li.disabled > a {
          color: #777777;
          background-color: #ffffff;
          border-color: #ddd;
          cursor: not-allowed;
        }

        /* Modal Dialogs */
        .modal-backdrop {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1050;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 20px;
        }

        .modal-dialog {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.2);
        }

        .modal-lg {
          max-width: 700px;
        }

        .modal-sm {
          max-width: 400px;
        }

        .modal-content {
          position: relative;
          background-color: #ffffff;
          border-radius: 4px;
        }

        .modal-header {
          padding: 15px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
        }

        .modal-header .close {
          border: none;
          background: transparent;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          color: #888888;
        }

        .modal-body {
          padding: 20px 25px;
        }

        .modal-scroll {
          max-height: 70vh;
          overflow-y: auto;
        }

        .table-detail {
          width: 100%;
          border: 1px solid #e7eaec;
        }

        .table-detail td {
          padding: 8px 12px;
          word-break: break-word;
        }

        .pre-content {
          margin: 0;
          padding: 8px;
          background-color: #f8f8f8;
          border: 1px solid #e5e5e5;
          border-radius: 3px;
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 12px;
        }

        .modal-footer {
          padding: 12px 25px 15px;
          text-align: right;
          border-top: 1px solid #e5e5e5;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .form-control {
          display: block;
          width: 100%;
          height: 31px;
          padding: 4px 10px;
          font-size: 12px;
          line-height: 1.42857143;
          color: #555555;
          background-color: #ffffff;
          border: 1px solid #cccccc;
          border-radius: 3px;
          box-sizing: border-box;
        }

        .form-control:focus {
          border-color: #18bc9c;
          outline: 0;
        }

        @media (max-width: 768px) {
          .toolbar-container {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-left,
          .toolbar-right {
            justify-content: space-between;
          }

          .search-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
