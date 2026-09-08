"use client";

import React, { useState } from "react";

interface AuthGroup {
  id: number;
  pid: number;
  name: string;
  rules: string;
  status: "normal" | "hidden";
  createtime: number;
  updatetime: number;
}

const INITIAL_GROUPS: AuthGroup[] = [
  {
    id: 1,
    pid: 0,
    name: "Admin group",
    rules: "*",
    status: "normal",
    createtime: 1490883540,
    updatetime: 1490883540,
  },
  {
    id: 10,
    pid: 1,
    name: "├ 代理",
    rules: "13,14,16,15,17,146,147,148,218,219,125,126,127,128,129,130,131,132,175,228,149,150,151,152,173,153,154,155,156,174,208,209,210,211,212,213,214,215,216,217,225,226,227,235,236,237,238,240,242,243,244,245,246,231,232,1,96,66,97,98,204,205,203,224,234,239,233,229,230",
    status: "normal",
    createtime: 1568640421,
    updatetime: 1772184854,
  },
  {
    id: 11,
    pid: 10,
    name: "│ └ 超级会员",
    rules: "13,14,16,15,17,146,147,148,125,126,127,128,129,130,131,132,175,149,150,151,152,173,1,96,66,97",
    status: "normal",
    createtime: 1594732910,
    updatetime: 1768714116,
  },
  {
    id: 12,
    pid: 1,
    name: "└ 分组",
    rules: "66,96,125,126,127,128,129,130,131,132,146,147,148,149,150,153,156,174,175,218,219,228,229,97,98",
    status: "normal",
    createtime: 1768714337,
    updatetime: 1768714429,
  },
];

const PERMISSION_NODES = [
  {
    id: "all",
    label: "全部权限 (All)",
    children: [
      {
        id: "dashboard",
        label: "控制台 (Dashboard)",
        children: [{ id: "dashboard_view", label: "查看控制台" }],
      },
      {
        id: "general",
        label: "系统设置 (General)",
        children: [
          { id: "general_config", label: "网站配置" },
          {
            id: "auth",
            label: "权限管理 (Auth)",
            children: [
              { id: "auth_admin", label: "管理员管理 (Admin)" },
              { id: "auth_adminlog", label: "管理员日志 (Admin log)" },
              { id: "auth_group", label: "角色组 (Group)" },
              { id: "auth_rule", label: "规则管理 (Rule)" },
            ],
          },
        ],
      },
      {
        id: "order",
        label: "订单管理 (Order)",
        children: [{ id: "order_view", label: "查看/处理订单" }],
      },
      {
        id: "user",
        label: "会员管理 (User)",
        children: [{ id: "user_view", label: "会员列表/资金管理" }],
      },
      {
        id: "upmark",
        label: "充值管理 (Recharge)",
        children: [{ id: "upmark_view", label: "充值订单与审核" }],
      },
      {
        id: "downmark",
        label: "提现管理 (Withdrawal)",
        children: [{ id: "downmark_view", label: "提现审核与记录" }],
      },
      {
        id: "product",
        label: "产品管理 (Product)",
        children: [
          { id: "product_list", label: "产品列表" },
          { id: "product_type", label: "产品分类" },
        ],
      },
      {
        id: "loan",
        label: "贷款管理 (Loan)",
        children: [
          { id: "loan_config", label: "贷款配置管理" },
          { id: "loan_record", label: "贷款记录管理" },
        ],
      },
    ],
  },
];

export default function AdminAuthGroupContent() {
  const [groups, setGroups] = useState<AuthGroup[]>(INITIAL_GROUPS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State (Add / Edit)
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingGroup, setEditingGroup] = useState<AuthGroup | null>(null);
  const [formState, setFormState] = useState({
    pid: 1,
    name: "",
    status: "normal" as "normal" | "hidden",
    checkAll: false,
    expandAll: true,
  });

  // Delete Confirmation Modal
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Selection handlers (Admin group ID 1 is protected)
  const toggleSelectAll = () => {
    const selectable = groups.filter((g) => g.id !== 1).map((g) => g.id);
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
    setEditingGroup(null);
    setFormState({
      pid: 1,
      name: "",
      status: "normal",
      checkAll: false,
      expandAll: true,
    });
    setModalMode("add");
  };

  // Open Edit modal
  const handleOpenEdit = (group: AuthGroup) => {
    setEditingGroup(group);
    // Remove tree symbols like ├, └, │
    const cleanName = group.name.replace(/^[├└│\s&nbsp;]+/, "").trim();
    setFormState({
      pid: group.pid,
      name: cleanName,
      status: group.status,
      checkAll: false,
      expandAll: true,
    });
    setModalMode("edit");
  };

  // Save Modal Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      alert("Please enter name");
      return;
    }

    if (modalMode === "add") {
      const newId = groups.length > 0 ? Math.max(...groups.map((g) => g.id)) + 1 : 1;
      const prefix = formState.pid === 1 ? "├ " : "│ └ ";
      const newGroup: AuthGroup = {
        id: newId,
        pid: Number(formState.pid),
        name: prefix + formState.name.trim(),
        rules: "1,96,66,97,98",
        status: formState.status,
        createtime: Math.floor(Date.now() / 1000),
        updatetime: Math.floor(Date.now() / 1000),
      };
      setGroups([...groups, newGroup]);
      showToast("添加角色组成功！");
    } else if (modalMode === "edit" && editingGroup) {
      setGroups(
        groups.map((item) => {
          if (item.id === editingGroup.id) {
            const prefix = Number(formState.pid) === 1 ? "├ " : "│ └ ";
            return {
              ...item,
              pid: Number(formState.pid),
              name: prefix + formState.name.trim(),
              status: formState.status,
              updatetime: Math.floor(Date.now() / 1000),
            };
          }
          return item;
        })
      );
      showToast("更新角色组成功！");
    }

    setModalMode(null);
  };

  // Delete handlers
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirmIds(selectedIds);
  };

  const handleDeleteOne = (id: number) => {
    if (id === 1) return;
    setDeleteConfirmIds([id]);
  };

  const executeDelete = () => {
    if (!deleteConfirmIds) return;
    setGroups(groups.filter((g) => !deleteConfirmIds.includes(g.id)));
    setSelectedIds(selectedIds.filter((id) => !deleteConfirmIds.includes(id)));
    setDeleteConfirmIds(null);
    showToast("删除成功！");
  };

  return (
    <div className="auth-group-wrapper">
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
          <span>Group</span>
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
              <em>Group</em>Group tips
            </div>
          </div>

          <div className="panel-body">
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
            </div>

            {/* Group Table */}
            <div className="table-responsive-container">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "38px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={
                          groups.filter((g) => g.id !== 1).length > 0 &&
                          selectedIds.length === groups.filter((g) => g.id !== 1).length
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th style={{ width: "80px" }}>ID</th>
                    <th style={{ width: "80px" }}>父级</th>
                    <th>名称</th>
                    <th style={{ width: "100px", textAlign: "center" }}>状态</th>
                    <th style={{ width: "100px", textAlign: "center" }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <tr key={group.id}>
                      {/* Checkbox */}
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(group.id)}
                          disabled={group.id === 1}
                          onChange={() => toggleSelectOne(group.id)}
                        />
                      </td>
                      {/* ID */}
                      <td>{group.id}</td>
                      {/* Parent PID */}
                      <td>{group.pid}</td>
                      {/* Name */}
                      <td style={{ textAlign: "left" }}>
                        <span
                          className={
                            group.id === 1
                              ? "group-name-root"
                              : "group-name-child"
                          }
                        >
                          {group.name}
                        </span>
                      </td>
                      {/* Status */}
                      <td style={{ textAlign: "center" }}>
                        {group.status === "normal" ? (
                          <span className="text-success status-indicator">
                            <i className="fa fa-circle"></i> 正常
                          </span>
                        ) : (
                          <span className="text-muted status-indicator">
                            <i className="fa fa-circle"></i> 隐藏
                          </span>
                        )}
                      </td>
                      {/* Operate */}
                      <td style={{ textAlign: "center" }}>
                        {group.id === 1 ? (
                          ""
                        ) : (
                          <div className="operate-buttons">
                            <button
                              type="button"
                              className="btn btn-xs btn-success btn-editone"
                              title="Edit"
                              onClick={() => handleOpenEdit(group)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger btn-delone"
                              title="Delete"
                              onClick={() => handleDeleteOne(group.id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Record Count */}
            <div className="pagination-wrapper">
              <div className="pagination-info">
                总共 {groups.length} 条记录
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Group Modal */}
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
                  {modalMode === "add" ? "添加角色组" : "编辑角色组"}
                </h4>
              </div>

              <form onSubmit={handleSaveForm} className="form-horizontal">
                <div className="modal-body modal-scroll">
                  {/* Parent */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Parent:</label>
                    <div className="col-sm-8">
                      <select
                        className="form-control"
                        value={formState.pid}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            pid: Number(e.target.value),
                          })
                        }
                      >
                        <option value={1}>Admin group</option>
                        <option value={10}>&nbsp;├ 代理</option>
                        <option value={11}>&nbsp;│&nbsp;└ 超级会员</option>
                        <option value={12}>&nbsp;└ 分组</option>
                      </select>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Name:</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        required
                        placeholder="输入角色组名称"
                      />
                    </div>
                  </div>

                  {/* Permission Tree */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Permission:</label>
                    <div className="col-sm-8">
                      <div className="treeview-toolbar">
                        <label className="checkbox-inline">
                          <input
                            type="checkbox"
                            checked={formState.checkAll}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                checkAll: e.target.checked,
                              })
                            }
                          />{" "}
                          <small>Check all</small>
                        </label>
                        <label className="checkbox-inline">
                          <input
                            type="checkbox"
                            checked={formState.expandAll}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                expandAll: e.target.checked,
                              })
                            }
                          />{" "}
                          <small>Expand all</small>
                        </label>
                      </div>

                      <div className="treeview-box">
                        <ul className="permission-tree-list">
                          {PERMISSION_NODES.map((root) => (
                            <li key={root.id}>
                              <div className="tree-node">
                                <i className="fa fa-folder-open text-warning"></i>
                                <input
                                  type="checkbox"
                                  defaultChecked={true}
                                  checked={formState.checkAll ? true : undefined}
                                />
                                <span>{root.label}</span>
                              </div>
                              {formState.expandAll && root.children && (
                                <ul className="tree-sub-list">
                                  {root.children.map((child) => (
                                    <li key={child.id}>
                                      <div className="tree-node">
                                        <i className="fa fa-folder text-warning"></i>
                                        <input
                                          type="checkbox"
                                          defaultChecked={true}
                                          checked={formState.checkAll ? true : undefined}
                                        />
                                        <span>{child.label}</span>
                                      </div>
                                      {child.children && (
                                        <ul className="tree-sub-sub-list">
                                          {child.children.map((sub) => (
                                            <li key={sub.id}>
                                              <div className="tree-node">
                                                <i className="fa fa-file-text-o text-muted"></i>
                                                <input
                                                  type="checkbox"
                                                  defaultChecked={true}
                                                  checked={
                                                    formState.checkAll
                                                      ? true
                                                      : undefined
                                                  }
                                                />
                                                <span>{sub.label}</span>
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">Status:</label>
                    <div className="col-sm-8 radio-group">
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="groupStatus"
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
                          name="groupStatus"
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
                  项角色组吗？此操作无法撤销。
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
        .auth-group-wrapper {
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

        /* Toolbar */
        .toolbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 6px;
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

        .btn-default:hover {
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
          min-width: 600px;
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

        .group-name-root {
          font-weight: bold;
          color: #333333;
        }

        .group-name-child {
          font-family: monospace, sans-serif;
          color: #555555;
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

        .text-warning {
          color: #f39c12;
        }

        .operate-buttons {
          display: inline-flex;
          gap: 4px;
        }

        .pagination-wrapper {
          display: flex;
          justify-content: flex-start;
          margin-top: 15px;
          font-size: 12px;
          color: #777;
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

        .modal-scroll {
          max-height: 70vh;
          overflow-y: auto;
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
          margin-bottom: 15px;
          display: flex;
          align-items: flex-start;
        }

        .form-horizontal .control-label {
          text-align: right;
          font-weight: 600;
          font-size: 12px;
          padding-right: 15px;
          padding-top: 6px;
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
          box-sizing: border-box;
        }

        .form-control:focus {
          border-color: #18bc9c;
          outline: 0;
        }

        .radio-group {
          display: flex;
          gap: 15px;
          padding-top: 6px;
        }

        .radio-inline {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 400;
          cursor: pointer;
        }

        .checkbox-inline {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-right: 12px;
          cursor: pointer;
        }

        .treeview-toolbar {
          margin-bottom: 8px;
        }

        .treeview-box {
          border: 1px solid #e5e5e5;
          border-radius: 3px;
          padding: 10px;
          background-color: #fbfbfb;
          max-height: 220px;
          overflow-y: auto;
        }

        .permission-tree-list,
        .tree-sub-list,
        .tree-sub-sub-list {
          list-style: none;
          padding-left: 20px;
          margin: 0;
        }

        .permission-tree-list {
          padding-left: 0;
        }

        .tree-node {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 0;
          font-size: 12px;
        }

        @media (max-width: 768px) {
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
