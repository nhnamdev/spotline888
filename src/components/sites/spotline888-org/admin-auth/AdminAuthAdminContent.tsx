"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getR2Url } from "@/lib/r2";
import { adminApi } from "@/lib/api";

interface AdminUser {
  id: number;
  username: string;
  nickname: string;
  room_id: string;
  avatar: string;
  email: string;
  status: "normal" | "hidden";
  memo: string;
  kefu_url: string;
  groups_text: string;
  logintime: number; // Unix timestamp
  createtime: number;
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

export default function AdminAuthAdminContent() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommonSearchOpen, setIsCommonSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await adminApi.getAdminUsers();
      if (res && res.code === 1 && Array.isArray(res.data)) {
        setAdmins(res.data);
      }
    } catch (err) {
      console.error("Lỗi nạp danh sách admin:", err);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Commonsearch form fields

  const [commonSearch, setCommonSearch] = useState({
    id: "",
    username: "",
    nickname: "",
    room_id: "",
    email: "",
    status: "",
    logintime: "",
  });

  // Modal dialog state (Add / Edit)
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formState, setFormState] = useState({
    group: "1",
    username: "",
    room_id: "",
    email: "",
    nickname: "",
    password: "",
    status: "normal" as "normal" | "hidden",
    memo: "",
    kefu_url: "",
  });

  // Delete confirmation modal
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Selection handlers (Admin id: 1 is the master admin, cannot be selected for deletion)
  const toggleSelectAll = () => {
    const selectable = admins.filter((a) => a.id !== 1).map((a) => a.id);
    if (selectedIds.length === selectable.length && selectable.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectable);
    }
  };

  const toggleSelectOne = (id: number) => {
    if (id === 1) return; // Protected
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setFormState({
      group: "1",
      username: "",
      room_id: "",
      email: "",
      nickname: "",
      password: "",
      status: "normal",
      memo: "",
      kefu_url: "",
    });
    setModalMode("add");
  };

  // Open Edit modal
  const handleOpenEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormState({
      group: admin.groups_text === "代理" ? "10" : "1",
      username: admin.username,
      room_id: admin.room_id,
      email: admin.email,
      nickname: admin.nickname,
      password: "",
      status: admin.status,
      memo: admin.memo,
      kefu_url: admin.kefu_url,
    });
    setModalMode("edit");
  };

  // Save Modal Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.username.trim()) {
      alert("Please enter username");
      return;
    }

    try {
      await adminApi.saveAdminUser({
        id: modalMode === "edit" && editingAdmin ? editingAdmin.id : undefined,
        username: formState.username.trim(),
        nickname: formState.nickname.trim() || formState.username.trim(),
        password: formState.password.trim() || undefined,
        email: formState.email.trim(),
        room_id: formState.room_id.trim(),
        status: formState.status,
        memo: formState.memo.trim(),
        kefu_url: formState.kefu_url.trim(),
      });
      showToast(modalMode === "add" ? "添加管理员成功！" : "更新管理员成功！");
      setModalMode(null);
      fetchAdmins();
    } catch (err) {
      console.error("Lỗi lưu quản trị viên:", err);
    }
  };

  // Confirm delete
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirmIds(selectedIds);
  };

  const handleDeleteOne = (id: number) => {
    if (id === 1) return;
    setDeleteConfirmIds([id]);
  };

  const executeDelete = async () => {
    if (!deleteConfirmIds) return;
    try {
      for (const id of deleteConfirmIds) {
        await adminApi.deleteAdminUser(id);
      }
      setSelectedIds(selectedIds.filter((id) => !deleteConfirmIds.includes(id)));
      setDeleteConfirmIds(null);
      showToast("删除成功！");
      fetchAdmins();
    } catch (err) {
      console.error("Lỗi xóa quản trị viên:", err);
    }
  };

  // Filtered rows
  const filteredAdmins = admins.filter((admin) => {
    // Quick search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchQuick =
        admin.username.toLowerCase().includes(q) ||
        admin.nickname.toLowerCase().includes(q) ||
        admin.room_id.toLowerCase().includes(q) ||
        admin.email.toLowerCase().includes(q) ||
        admin.memo.toLowerCase().includes(q);
      if (!matchQuick) return false;
    }

    // Common search
    if (commonSearch.id && !String(admin.id).includes(commonSearch.id.trim())) return false;
    if (commonSearch.username && !admin.username.toLowerCase().includes(commonSearch.username.toLowerCase().trim())) return false;
    if (commonSearch.nickname && !admin.nickname.toLowerCase().includes(commonSearch.nickname.toLowerCase().trim())) return false;
    if (commonSearch.room_id && !admin.room_id.toLowerCase().includes(commonSearch.room_id.toLowerCase().trim())) return false;
    if (commonSearch.email && !admin.email.toLowerCase().includes(commonSearch.email.toLowerCase().trim())) return false;
    if (commonSearch.status && admin.status !== commonSearch.status) return false;

    return true;
  });

  return (
    <div className="auth-admin-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">
          <span>系统设置</span>
          <span className="breadcrumb-sep">/</span>
          <span>权限管理</span>
          <span className="breadcrumb-sep">/</span>
          <span>Admin</span>
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
              <em>Admin</em>Admin tips
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
                        <label className="control-label">Id</label>
                        <input
                          type="text"
                          className="form-control"
                          name="id"
                          value={commonSearch.id}
                          onChange={(e) =>
                            setCommonSearch({ ...commonSearch, id: e.target.value })
                          }
                          placeholder="ID"
                        />
                      </div>

                      <div className="form-group-col">
                        <label className="control-label">Username</label>
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
                          placeholder="Username"
                        />
                      </div>

                      <div className="form-group-col">
                        <label className="control-label">Nickname</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nickname"
                          value={commonSearch.nickname}
                          onChange={(e) =>
                            setCommonSearch({
                              ...commonSearch,
                              nickname: e.target.value,
                            })
                          }
                          placeholder="Nickname"
                        />
                      </div>

                      <div className="form-group-col">
                        <label className="control-label">代理编号</label>
                        <input
                          type="text"
                          className="form-control"
                          name="room_id"
                          value={commonSearch.room_id}
                          onChange={(e) =>
                            setCommonSearch({
                              ...commonSearch,
                              room_id: e.target.value,
                            })
                          }
                          placeholder="代理编号"
                        />
                      </div>

                      <div className="form-group-col">
                        <label className="control-label">Email</label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={commonSearch.email}
                          onChange={(e) =>
                            setCommonSearch({
                              ...commonSearch,
                              email: e.target.value,
                            })
                          }
                          placeholder="Email"
                        />
                      </div>

                      <div className="form-group-col">
                        <label className="control-label">Status</label>
                        <select
                          className="form-control"
                          value={commonSearch.status}
                          onChange={(e) =>
                            setCommonSearch({
                              ...commonSearch,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="">Choose</option>
                          <option value="normal">Normal</option>
                          <option value="hidden">Hidden</option>
                        </select>
                      </div>

                      <div className="form-group-col actions-col">
                        <label className="control-label">&nbsp;</label>
                        <div className="search-buttons">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => showToast("查询完成")}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={() =>
                              setCommonSearch({
                                id: "",
                                username: "",
                                nickname: "",
                                room_id: "",
                                email: "",
                                status: "",
                                logintime: "",
                              })
                            }
                          >
                            Reset
                          </button>
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
                  title="Refresh"
                  onClick={() => showToast("刷新成功")}
                >
                  <i className="fa fa-refresh"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-add"
                  title="Add"
                  onClick={handleOpenAdd}
                >
                  <i className="fa fa-plus"></i> Add
                </button>
                <button
                  type="button"
                  className={`btn btn-danger btn-del ${
                    selectedIds.length === 0 ? "btn-disabled disabled" : ""
                  }`}
                  title="Delete"
                  disabled={selectedIds.length === 0}
                  onClick={handleDeleteSelected}
                >
                  <i className="fa fa-trash"></i> Delete
                </button>
              </div>

              {/* Right Search & Controls */}
              <div className="toolbar-right">
                <div className="search-input-group">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-default"
                    title="Toggle view"
                    onClick={() => {}}
                  >
                    <i className="fa fa-list-alt"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    title="Columns"
                    onClick={() => {}}
                  >
                    <i className="fa fa-th"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    title="Export"
                    onClick={() => showToast("导出数据成功")}
                  >
                    <i className="fa fa-sign-out"></i>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-default ${
                      isCommonSearchOpen ? "active" : ""
                    }`}
                    title="Common Search"
                    onClick={() => setIsCommonSearchOpen(!isCommonSearchOpen)}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Table */}
            <div className="table-responsive-container">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "38px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={
                          admins.filter((a) => a.id !== 1).length > 0 &&
                          selectedIds.length === admins.filter((a) => a.id !== 1).length
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th style={{ width: "60px" }}>ID</th>
                    <th>用户名</th>
                    <th>昵称</th>
                    <th>代理编号</th>
                    <th>所属组别</th>
                    <th>电子邮箱</th>
                    <th style={{ width: "80px", textAlign: "center" }}>状态</th>
                    <th>备注</th>
                    <th style={{ width: "160px" }}>最后登录时间</th>
                    <th style={{ width: "90px", textAlign: "center" }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center no-records">
                        没有找到匹配的记录
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr key={admin.id}>
                        {/* Checkbox */}
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(admin.id)}
                            disabled={admin.id === 1}
                            onChange={() => toggleSelectOne(admin.id)}
                          />
                        </td>
                        {/* ID */}
                        <td>{admin.id}</td>
                        {/* Username */}
                        <td>
                          <strong>{admin.username}</strong>
                        </td>
                        {/* Nickname */}
                        <td>{admin.nickname}</td>
                        {/* Room ID */}
                        <td>{admin.room_id}</td>
                        {/* Group Text */}
                        <td>
                          <span
                            className={`label ${
                              admin.groups_text === "Admin group"
                                ? "label-info"
                                : "label-success"
                            }`}
                          >
                            {admin.groups_text}
                          </span>
                        </td>
                        {/* Email */}
                        <td>
                          <a href={`mailto:${admin.email}`}>{admin.email}</a>
                        </td>
                        {/* Status */}
                        <td style={{ textAlign: "center" }}>
                          {admin.status === "normal" ? (
                            <span className="text-success status-indicator">
                              <i className="fa fa-circle"></i> 正常
                            </span>
                          ) : (
                            <span className="text-muted status-indicator">
                              <i className="fa fa-circle"></i> 隐藏
                            </span>
                          )}
                        </td>
                        {/* Memo */}
                        <td>{admin.memo || "-"}</td>
                        {/* Login Time */}
                        <td>{formatDateTime(admin.logintime)}</td>
                        {/* Operate */}
                        <td style={{ textAlign: "center" }}>
                          {admin.id === 1 ? (
                            ""
                          ) : (
                            <div className="operate-buttons">
                              <button
                                type="button"
                                className="btn btn-xs btn-success btn-editone"
                                title="Edit"
                                onClick={() => handleOpenEdit(admin)}
                              >
                                <i className="fa fa-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-xs btn-danger btn-delone"
                                title="Delete"
                                onClick={() => handleDeleteOne(admin.id)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Record Count */}
            <div className="pagination-wrapper">
              <div className="pagination-info">
                显示第 1 到第 {filteredAdmins.length} 条记录，总共 {filteredAdmins.length} 条记录 每页显示 10 条记录
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
                  <li className="disabled">
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

      {/* Add / Edit Admin Modal */}
      {modalMode && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => setModalMode(null)}
                >
                  &times;
                </button>
                <h4 className="modal-title">
                  {modalMode === "add" ? "添加管理员" : "编辑管理员"}
                </h4>
              </div>

              <form onSubmit={handleSaveForm} className="form-horizontal">
                <div className="modal-body">
                  {/* Group */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Group:</label>
                    <div className="col-sm-8">
                      <select
                        className="form-control"
                        value={formState.group}
                        onChange={(e) =>
                          setFormState({ ...formState, group: e.target.value })
                        }
                      >
                        <option value="1">Admin group</option>
                        <option value="10">&nbsp;├ 代理</option>
                        <option value="11">&nbsp;│&nbsp;└ 超级会员</option>
                        <option value="12">&nbsp;└ 分组</option>
                      </select>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Username:</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.username}
                        onChange={(e) =>
                          setFormState({ ...formState, username: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* 代理编号 */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">代理编号:</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.room_id}
                        onChange={(e) =>
                          setFormState({ ...formState, room_id: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Email:</label>
                    <div className="col-sm-8">
                      <input
                        type="email"
                        className="form-control"
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Nickname */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Nickname:</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.nickname}
                        onChange={(e) =>
                          setFormState({ ...formState, nickname: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Password:</label>
                    <div className="col-sm-8">
                      <input
                        type="password"
                        className="form-control"
                        value={formState.password}
                        onChange={(e) =>
                          setFormState({ ...formState, password: e.target.value })
                        }
                        placeholder={
                          modalMode === "edit"
                            ? "留空则不修改密码"
                            : "输入密码"
                        }
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Status:</label>
                    <div className="col-sm-8 radio-group">
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="adminStatus"
                          value="normal"
                          checked={formState.status === "normal"}
                          onChange={() =>
                            setFormState({ ...formState, status: "normal" })
                          }
                        />{" "}
                        Normal
                      </label>
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="adminStatus"
                          value="hidden"
                          checked={formState.status === "hidden"}
                          onChange={() =>
                            setFormState({ ...formState, status: "hidden" })
                          }
                        />{" "}
                        Hidden
                      </label>
                    </div>
                  </div>

                  {/* Memo */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">备注:</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.memo}
                        onChange={(e) =>
                          setFormState({ ...formState, memo: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* 客服链接 */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">客服链接:</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.kefu_url}
                        onChange={(e) =>
                          setFormState({ ...formState, kefu_url: e.target.value })
                        }
                        placeholder="留空则使用全局客服链接"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-success btn-embossed">
                    OK
                  </button>
                  <button
                    type="button"
                    className="btn btn-default btn-embossed"
                    onClick={() => setModalMode(null)}
                  >
                    Reset
                  </button>
                </div>
              </form>
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
                  项管理员吗？此操作无法撤销。
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
        .auth-admin-wrapper {
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
          flex: 1 1 14%;
          min-width: 140px;
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
          min-width: 850px;
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

        .label-success {
          background-color: #18bc9c;
        }

        .status-indicator i {
          font-size: 9px;
          vertical-align: middle;
          margin-right: 3px;
        }

        .text-success {
          color: #18bc9c;
        }

        .text-muted {
          color: #999999;
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

        .modal-footer {
          padding: 12px 25px 15px;
          text-align: right;
          border-top: 1px solid #e5e5e5;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .form-horizontal .form-group {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }

        .form-horizontal .control-label {
          text-align: right;
          font-weight: 600;
          font-size: 12px;
          padding-right: 15px;
          margin-bottom: 0;
        }

        .col-sm-3 {
          width: 25%;
        }

        .col-sm-8 {
          width: 70%;
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
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
          box-sizing: border-box;
        }

        .form-control:focus {
          border-color: #18bc9c;
          outline: 0;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(24, 188, 156, 0.6);
        }

        .radio-group {
          display: flex;
          gap: 15px;
        }

        .radio-inline {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 400;
          cursor: pointer;
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

          .form-horizontal .form-group {
            flex-direction: column;
            align-items: flex-start;
          }

          .form-horizontal .control-label {
            text-align: left;
            padding-right: 0;
            margin-bottom: 4px;
            width: 100%;
          }

          .col-sm-3,
          .col-sm-8 {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
