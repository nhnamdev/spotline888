"use client";

import React, { useState } from "react";
import { INITIAL_PROFILE_LOGS, ProfileLogItem } from "./profileData";
import { getR2Url } from "@/lib/r2";

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

export default function AdminProfileContent() {
  // Profile Form State
  const [profile, setProfile] = useState({
    username: "admin",
    email: "admin@admin.com",
    nickname: "Spot",
    avatar: getR2Url("/uploads/20251210/c3daf0015559501fb836681ca784c977.jpg"),
    password: "",
  });

  // Admin Logs State
  const [logs, setLogs] = useState<ProfileLogItem[]>(INITIAL_PROFILE_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Profile Form Submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.nickname.trim()) {
      alert("昵称不能为空");
      return;
    }
    if (!profile.email.trim()) {
      alert("电子邮箱不能为空");
      return;
    }

    // Add a new log entry representing the update
    const newLog: ProfileLogItem = {
      id: Math.max(...logs.map((l) => l.id), 0) + 1,
      admin_id: 1,
      username: profile.username,
      url: "/coinht.php/general/profile/update",
      title: "系统设置 Profile Update",
      content: JSON.stringify({
        nickname: profile.nickname,
        email: profile.email,
      }),
      ip: "14.241.251.56",
      useragent: navigator.userAgent || "Mozilla/5.0",
      createtime: Math.floor(Date.now() / 1000),
    };

    setLogs([newLog, ...logs]);
    setProfile({ ...profile, password: "" });
    showToast("个人资料更新成功");
  };

  // Reset Profile Form
  const handleProfileReset = () => {
    setProfile({
      username: "admin",
      email: "admin@admin.com",
      nickname: "Spot",
      avatar: getR2Url("/uploads/20251210/c3daf0015559501fb836681ca784c977.jpg"),
      password: "",
    });
    showToast("表单已重置");
  };

  // Refresh Logs
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("日志刷新成功");
    }, 400);
  };

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      String(log.id).includes(q) ||
      log.title.toLowerCase().includes(q) ||
      log.url.toLowerCase().includes(q) ||
      log.ip.toLowerCase().includes(q)
    );
  });

  // Pagination calculation
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

  return (
    <div className="admin-profile-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fastadmin-toast">
          <i className="fa fa-check-circle"></i> {toastMessage}
        </div>
      )}

      {/* Ribbon Breadcrumb */}
      <div id="ribbon" className="profile-ribbon">
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
              系统设置
            </a>
          </li>
          <li>
            <a href="javascript:;" onClick={(e) => e.preventDefault()}>
              个人资料
            </a>
          </li>
        </ol>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="row">
          {/* Left Column: Profile Card */}
          <div className="col-xs-12 col-md-4">
            <div className="box box-success profile-card-box">
              <div className="panel-heading">个人资料</div>
              <div className="panel-body">
                <form id="update-form" role="form" onSubmit={handleProfileSubmit}>
                  <div className="box-body box-profile">
                    {/* Avatar with hover "Click to edit" */}
                    <div
                      className="profile-avatar-container"
                      onClick={() => setIsAvatarModalOpen(true)}
                      title="点击修改头像"
                    >
                      <img
                        className="profile-user-img img-responsive img-circle"
                        src={profile.avatar}
                        alt={profile.nickname}
                      />
                      <div className="profile-avatar-text img-circle">
                        点击修改
                      </div>
                    </div>

                    <h3 className="profile-username text-center">
                      {profile.username}
                    </h3>
                    <p className="text-muted text-center">{profile.email}</p>

                    <div className="form-group">
                      <label htmlFor="username" className="control-label">
                        用户名:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={profile.username}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="control-label">
                        电子邮箱:
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        required
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="nickname" className="control-label">
                        昵称:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nickname"
                        required
                        value={profile.nickname}
                        onChange={(e) =>
                          setProfile({ ...profile, nickname: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" className="control-label">
                        密码:
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="不修改密码请留空"
                        autoComplete="new-password"
                        value={profile.password}
                        onChange={(e) =>
                          setProfile({ ...profile, password: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group profile-button-group">
                      <button type="submit" className="btn btn-success">提交</button>
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={handleProfileReset}
                      >重置</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Admin Log Card */}
          <div className="col-xs-12 col-md-8">
            <div className="panel panel-default panel-intro panel-nav">
              <div className="panel-heading">
                <ul className="nav nav-tabs">
                  <li className="active">
                    <a href="#one" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-list"></i> 管理员日志
                    </a>
                  </li>
                </ul>
              </div>

              <div className="panel-body">
                <div className="tab-content">
                  <div className="tab-pane active in">
                    <div className="widget-body no-padding">
                      {/* Toolbar */}
                      <div id="toolbar" className="toolbar">
                        <div className="toolbar-left">
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
                        </div>

                        <div className="toolbar-right">
                          <div className="search-box">
                            <input
                              type="text"
                              className="form-control input-sm search-input"
                              placeholder="搜索"
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Log Table */}
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: 80 }} className="text-center">
                                <div className="th-inner">ID</div>
                              </th>
                              <th style={{ width: 180 }} className="text-left">
                                <div className="th-inner">标题</div>
                              </th>
                              <th className="text-left">
                                <div className="th-inner">操作URL</div>
                              </th>
                              <th style={{ width: 140 }} className="text-center">
                                <div className="th-inner">IP地址</div>
                              </th>
                              <th style={{ width: 160 }} className="text-center">
                                <div className="th-inner">操作时间</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentLogs.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="text-center no-records"
                                >
                                  没有找到匹配的记录
                                </td>
                              </tr>
                            ) : (
                              currentLogs.map((log) => (
                                <tr key={log.id}>
                                  <td className="text-center">{log.id}</td>
                                  <td className="text-left font-medium">
                                    {log.title}
                                  </td>
                                  <td className="text-left">
                                    <a
                                      href={log.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="label bg-green log-url-label"
                                      title={log.url}
                                    >
                                      {log.url}
                                    </a>
                                  </td>
                                  <td className="text-center">
                                    <span className="label label-info">
                                      {log.ip}
                                    </span>
                                  </td>
                                  <td className="text-center text-muted font-mono">
                                    {formatDateTime(log.createtime)}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer */}
                      <div className="fixed-table-pagination">
                        <div className="pull-left pagination-detail">
                          <span className="pagination-info">
                            显示第 {totalItems > 0 ? startIndex + 1 : 0} 到第 {Math.min(startIndex + pageSize, totalItems)} 条记录，总共 {totalItems} 条记录
                          </span>
                          <span className="page-list">
                            每页显示{" "}
                            <select
                              className="btn-group dropdown dropup"
                              value={pageSize}
                              onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                            >
                              <option value="10">10</option>
                              <option value="25">25</option>
                              <option value="50">50</option>
                            </select>{" "}
                            条
                          </span>
                        </div>

                        <div className="pull-right pagination">
                          <ul className="pagination-list">
                            <li
                              className={`page-pre ${
                                currentPage === 1 ? "disabled" : ""
                              }`}
                            >
                              <a
                                href="javascript:;"
                                onClick={() =>
                                  currentPage > 1 &&
                                  setCurrentPage(currentPage - 1)
                                }
                              >
                                &laquo;
                              </a>
                            </li>
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <li
                                key={page}
                                className={`page-number ${
                                  currentPage === page ? "active" : ""
                                }`}
                              >
                                <a
                                  href="javascript:;"
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </a>
                              </li>
                            ))}
                            <li
                              className={`page-next ${
                                currentPage === totalPages ? "disabled" : ""
                              }`}
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
        </div>
      </div>

      {/* Avatar Change Modal */}
      {isAvatarModalOpen && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom avatar-modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => setIsAvatarModalOpen(false)}
                >
                  &times;
                </button>
                <h4 className="modal-title">修改头像</h4>
              </div>
              <div className="modal-body text-center">
                <p>选择一个预置头像或输入图片链接：</p>
                <div className="avatar-options">
                  {[
                    getR2Url("/uploads/20251210/c3daf0015559501fb836681ca784c977.jpg"),
                    getR2Url("/uploads/20251203/d55dd75446d505958e5210985b246bed.png"),
                    getR2Url("/uploads/20250929/4a595f3800ca1cd81d2a8b46ebb47ec0.png"),
                  ].map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`avatar-choice ${
                        profile.avatar === imgUrl ? "selected" : ""
                      }`}
                      onClick={() => {
                        setProfile({ ...profile, avatar: imgUrl });
                        setIsAvatarModalOpen(false);
                        showToast("头像已更新");
                      }}
                    >
                      <img src={imgUrl} alt={`Avatar ${idx}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => setIsAvatarModalOpen(false)}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-profile-wrapper {
          padding: 0;
          background-color: #f1f4f6;
          min-height: calc(100vh - 50px);
        }

        /* FastAdmin Toast */
        .fastadmin-toast {
          position: fixed;
          top: 60px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 10px 18px;
          border-radius: 4px;
          font-size: 13px;
          z-index: 99999;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeInDown 0.25s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Ribbon */
        .profile-ribbon {
          background: #ffffff;
          border-bottom: 1px solid #e7eaec;
          padding: 11px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .profile-ribbon .breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 12px;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .profile-ribbon .breadcrumb > li + li:before {
          content: "/";
          padding: 0 5px;
          color: #ccc;
        }

        .profile-ribbon .breadcrumb a {
          color: #777;
          text-decoration: none;
        }

        .profile-ribbon .breadcrumb a:hover {
          color: #333;
        }

        /* Content */
        .content {
          padding: 15px;
        }

        /* Profile Left Card Box */
        .box {
          position: relative;
          border-radius: 3px;
          background: #ffffff;
          border-top: 3px solid #d2d6de;
          margin-bottom: 20px;
          width: 100%;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        }

        .box.box-success {
          border-top-color: #18bc9c;
        }

        .panel-heading {
          padding: 12px 15px;
          border-bottom: 1px solid #f4f4f4;
          font-weight: 600;
          font-size: 14px;
          color: #444;
          background-color: #fbfbfb;
        }

        .panel-body {
          padding: 15px;
        }

        .box-profile {
          padding: 15px 0;
        }

        /* Profile Avatar Container */
        .profile-avatar-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 12px auto;
          cursor: pointer;
        }

        .profile-user-img {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          padding: 3px;
          border: 3px solid #d2d6de;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .profile-avatar-text {
          display: none;
        }

        .profile-avatar-container:hover .profile-avatar-text {
          display: block;
          position: absolute;
          height: 100px;
          width: 100px;
          background: rgba(68, 68, 68, 0.65);
          color: #fff;
          top: 0;
          left: 0;
          line-height: 100px;
          text-align: center;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
        }

        .profile-username {
          font-size: 21px;
          margin-top: 5px;
          margin-bottom: 5px;
          color: #333;
          font-weight: 600;
        }

        .text-muted {
          color: #777;
          margin-bottom: 20px;
          font-size: 13px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .control-label {
          margin-bottom: 5px;
          font-weight: bold;
          font-size: 13px;
          color: #333;
          display: block;
        }

        .form-control {
          display: block;
          width: 100%;
          height: 34px;
          padding: 6px 12px;
          font-size: 13px;
          line-height: 1.42857143;
          color: #555;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          transition: border-color ease-in-out 0.15s;
        }

        .form-control:focus {
          border-color: #18bc9c;
          outline: 0;
        }

        .form-control:disabled {
          background-color: #eee;
          opacity: 1;
          cursor: not-allowed;
        }

        .profile-button-group {
          display: flex;
          gap: 8px;
          margin-top: 20px;
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          padding: 6px 16px;
          font-size: 13px;
          border-radius: 3px;
          transition: all 0.15s ease-in-out;
        }

        .btn-success {
          color: #fff;
          background-color: #2c3e50;
          border-color: #2c3e50;
        }

        .btn-success:hover {
          background-color: #233140;
          border-color: #233140;
        }

        .btn-default {
          color: #333;
          background-color: #fff;
          border-color: #ccc;
        }

        .btn-default:hover {
          background-color: #e6e6e6;
        }

        .btn-primary {
          color: #fff;
          background-color: #18bc9c;
          border-color: #18bc9c;
        }

        .btn-primary:hover {
          background-color: #15a589;
        }

        /* Right Panel: Admin log */
        .panel-nav {
          border-radius: 3px;
          border: 1px solid #e7eaec;
          background: #fff;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .panel-nav .panel-heading {
          padding: 10px 15px 0 15px;
          border-bottom: 1px solid #e7eaec;
          background: #fbfbfb;
        }

        .nav-tabs {
          border-bottom: 1px solid #ddd;
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 2px;
        }

        .nav-tabs > li > a {
          margin-right: 2px;
          border: 1px solid transparent;
          border-radius: 4px 4px 0 0;
          padding: 10px 15px;
          display: block;
          color: #555;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .nav-tabs > li.active > a {
          color: #555;
          background-color: #fff;
          border: 1px solid #ddd;
          border-bottom-color: transparent;
        }

        /* Toolbar */
        .toolbar {
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .search-box input {
          width: 170px;
          height: 30px;
          padding: 5px 10px;
          font-size: 12px;
          border: 1px solid #ccc;
          border-radius: 3px;
        }

        /* Table */
        .table-responsive {
          min-height: 0.01%;
          overflow-x: auto;
        }

        .table {
          width: 100%;
          max-width: 100%;
          margin-bottom: 15px;
          border-collapse: collapse;
          font-size: 13px;
        }

        .table-bordered {
          border: 1px solid #e7eaec;
        }

        .table-bordered > thead > tr > th,
        .table-bordered > tbody > tr > td {
          border: 1px solid #e7eaec;
          padding: 8px 10px;
          vertical-align: middle;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: #f9f9f9;
        }

        .table-hover > tbody > tr:hover {
          background-color: #f5f5f5;
        }

        .table > thead > tr > th {
          background-color: #f9fafb;
          color: #333;
          font-weight: 600;
          border-bottom: 2px solid #e7eaec;
        }

        .th-inner {
          padding: 2px 4px;
        }

        .log-url-label {
          display: inline-block;
          max-width: 320px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-decoration: none;
          font-family: monospace;
          font-size: 11px;
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

        .bg-green {
          background-color: #00a65a !important;
        }

        .label-info {
          background-color: #3498db;
        }

        .font-mono {
          font-family: monospace;
          font-size: 11px;
        }

        /* Pagination */
        .fixed-table-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pagination-info {
          margin-right: 15px;
          font-size: 13px;
          color: #555;
        }

        .page-list select {
          padding: 2px 6px;
          font-size: 12px;
          border: 1px solid #ccc;
          border-radius: 3px;
        }

        .pagination-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 2px;
        }

        .pagination-list li a {
          display: block;
          padding: 6px 12px;
          font-size: 12px;
          color: #337ab7;
          background-color: #fff;
          border: 1px solid #ddd;
          text-decoration: none;
          border-radius: 3px;
        }

        .pagination-list li.active a {
          color: #fff;
          background-color: #18bc9c;
          border-color: #18bc9c;
        }

        .pagination-list li.disabled a {
          color: #777;
          cursor: not-allowed;
          background-color: #fff;
          border-color: #ddd;
        }

        /* Avatar Modal */
        .modal-backdrop-custom {
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
          padding: 15px;
        }

        .avatar-modal-dialog {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
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
        }

        .close {
          border: none;
          background: transparent;
          font-size: 21px;
          font-weight: 700;
          opacity: 0.2;
          cursor: pointer;
        }

        .close:hover {
          opacity: 0.5;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          padding: 15px;
          text-align: right;
          border-top: 1px solid #e5e5e5;
        }

        .avatar-options {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 15px;
        }

        .avatar-choice {
          cursor: pointer;
          border: 3px solid transparent;
          border-radius: 50%;
          padding: 2px;
          transition: border-color 0.15s ease;
        }

        .avatar-choice.selected,
        .avatar-choice:hover {
          border-color: #18bc9c;
        }

        .avatar-choice img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        /* Responsive Layout */
        @media (min-width: 992px) {
          .col-md-4 {
            width: 33.33333333%;
            float: left;
          }
          .col-md-8 {
            width: 66.66666667%;
            float: left;
          }
        }

        @media (max-width: 991px) {
          .profile-ribbon {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          .toolbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .toolbar-right {
            width: 100%;
          }
          .search-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
