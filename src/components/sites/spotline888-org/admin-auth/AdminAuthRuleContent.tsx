"use client";

import React, { useState, useEffect } from "react";
import { RuleItem } from "./rulesData";
import { adminApi } from "@/lib/api";

export default function AdminAuthRuleContent() {
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedPids, setExpandedPids] = useState<number[]>([0]); // By default root menus are shown, can expand children
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Modal dialog state (Add / Edit)
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingRule, setEditingRule] = useState<RuleItem | null>(null);
  const [formState, setFormState] = useState({
    ismenu: 1,
    pid: 0,
    name: "",
    title: "",
    icon: "fa fa-circle-o",
    weigh: 0,
    condition: "",
    remark: "",
    status: "normal" as "normal" | "hidden",
  });

  // Delete confirmation modal
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const loadRules = async () => {
    try {
      const res = await adminApi.getAuthRules();
      if (res.code === 1 && Array.isArray(res.data)) {
        setRules(res.data);
      }
    } catch (err) {
      console.error("Failed to load rules:", err);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === rules.length && rules.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rules.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Toggle single parent subnode
  const toggleSubnode = (id: number) => {
    if (expandedPids.includes(id)) {
      setExpandedPids(expandedPids.filter((p) => p !== id));
    } else {
      setExpandedPids([...expandedPids, id]);
    }
  };

  // Toggle all expand/collapse
  const handleToggleAll = () => {
    if (isAllExpanded) {
      setExpandedPids([0]);
      setIsAllExpanded(false);
    } else {
      const allParentIds = Array.from(new Set(rules.map((r) => r.id)));
      setExpandedPids([0, ...allParentIds]);
      setIsAllExpanded(true);
    }
  };

  // Toggle status for selected items
  const handleSetStatus = async (status: "normal" | "hidden") => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        const r = rules.find((item) => item.id === id);
        if (r) {
          await adminApi.saveAuthRule({ ...r, status });
        }
      }
      showToast(`批量修改状态为 ${status === "normal" ? "正常" : "隐藏"} 成功！`);
      await loadRules();
    } catch (err) {
      console.error(err);
      alert("更新状态失败");
    }
    setIsMoreMenuOpen(false);
  };

  // Toggle ismenu switch
  const handleToggleIsmenu = async (id: number) => {
    const r = rules.find((item) => item.id === id);
    if (!r) return;
    const newIsmenu = r.ismenu === 1 ? 0 : 1;
    try {
      await adminApi.saveAuthRule({ ...r, ismenu: newIsmenu });
      showToast("切换菜单状态成功！");
      await loadRules();
    } catch (err) {
      console.error(err);
      alert("切换菜单状态失败");
    }
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingRule(null);
    setFormState({
      ismenu: 1,
      pid: 0,
      name: "",
      title: "",
      icon: "fa fa-circle-o",
      weigh: 0,
      condition: "",
      remark: "",
      status: "normal",
    });
    setModalMode("add");
  };

  // Open Edit modal
  const handleOpenEdit = (rule: RuleItem) => {
    setEditingRule(rule);
    const cleanTitle = rule.title.replace(/^[├└│\s&nbsp;]+/, "").trim();
    setFormState({
      ismenu: rule.ismenu,
      pid: rule.pid,
      name: rule.name,
      title: cleanTitle,
      icon: rule.icon || "fa fa-circle-o",
      weigh: rule.weigh,
      condition: rule.condition || "",
      remark: rule.remark || "",
      status: rule.status,
    });
    setModalMode("edit");
  };

  // Save Modal Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.title.trim()) {
      alert("请填写规则和标题");
      return;
    }

    const prefix = formState.pid === 0 ? " " : "├ ";
    const payload = {
      ...(modalMode === "edit" && editingRule ? { id: editingRule.id } : {}),
      pid: Number(formState.pid),
      name: formState.name.trim(),
      title: (modalMode === "add" ? prefix : "") + formState.title.trim(),
      icon: formState.icon.trim(),
      weigh: Number(formState.weigh) || 0,
      condition: formState.condition.trim(),
      remark: formState.remark.trim(),
      ismenu: Number(formState.ismenu),
      status: formState.status,
    };

    try {
      const res = await adminApi.saveAuthRule(payload);
      if (res.code === 1) {
        showToast(modalMode === "add" ? "添加菜单规则成功！" : "更新菜单规则成功！");
        await loadRules();
      } else {
        alert(res.msg || "保存规则失败");
      }
    } catch (err) {
      console.error(err);
      alert("网络连接失败");
    }

    setModalMode(null);
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
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    try {
      for (const id of deleteConfirmIds) {
        await adminApi.deleteAuthRule(id);
      }
      showToast("删除成功！");
      await loadRules();
      setSelectedIds((prev) => prev.filter((id) => !deleteConfirmIds.includes(id)));
    } catch (err) {
      console.error(err);
      alert("删除规则失败");
    }
    setDeleteConfirmIds(null);
  };


  // Determine visibility based on parent expansion
  const isRuleVisible = (rule: RuleItem): boolean => {
    if (isAllExpanded) return true;
    if (rule.pid === 0) return true;
    // Walk up ancestor chain
    let currentPid = rule.pid;
    while (currentPid !== 0) {
      if (!expandedPids.includes(currentPid)) return false;
      const parentRule = rules.find((r) => r.id === currentPid);
      if (!parentRule) break;
      currentPid = parentRule.pid;
    }
    return true;
  };

  const visibleRules = rules.filter(isRuleVisible);

  return (
    <div className="auth-rule-wrapper">
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
          <span>菜单规则</span>
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
              <em>菜单规则</em>规则通常对应一个控制器的方法,同时左侧的菜单栏也是从规则中重复构建,说明:必须在系统配置开启调试模式才可添加规则
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
                  title="刷新"
                  onClick={() => showToast("刷新成功")}
                >
                  <i className="fa fa-refresh"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-add"
                  title="添加"
                  onClick={handleOpenAdd}
                >
                  <i className="fa fa-plus"></i> 添加
                </button>
                <button
                  type="button"
                  className={`btn btn-success btn-edit ${
                    selectedIds.length !== 1 ? "btn-disabled disabled" : ""
                  }`}
                  title="编辑"
                  disabled={selectedIds.length !== 1}
                  onClick={() => {
                    const ruleToEdit = rules.find((r) => r.id === selectedIds[0]);
                    if (ruleToEdit) handleOpenEdit(ruleToEdit);
                  }}
                >
                  <i className="fa fa-pencil"></i> 编辑
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

                {/* More Dropdown */}
                <div className="dropdown btn-group">
                  <button
                    type="button"
                    className={`btn btn-primary btn-more dropdown-toggle ${
                      selectedIds.length === 0 ? "btn-disabled disabled" : ""
                    }`}
                    disabled={selectedIds.length === 0}
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  >
                    <i className="fa fa-cog"></i> 更多 <span className="caret"></span>
                  </button>
                  {isMoreMenuOpen && selectedIds.length > 0 && (
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          href="javascript:;"
                          onClick={() => handleSetStatus("normal")}
                        >
                          <i className="fa fa-eye"></i> 设为正常
                        </a>
                      </li>
                      <li>
                        <a
                          href="javascript:;"
                          onClick={() => handleSetStatus("hidden")}
                        >
                          <i className="fa fa-eye-slash"></i> 设为隐藏
                        </a>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Toggle All Button */}
                <button
                  type="button"
                  className="btn btn-danger btn-toggle-all"
                  onClick={handleToggleAll}
                >
                  <i className={`fa ${isAllExpanded ? "fa-minus" : "fa-plus"}`}></i>{" "}
                  全部展开/折叠
                </button>
              </div>
            </div>

            {/* Rule Table */}
            <div className="table-responsive-container">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "38px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={
                          rules.length > 0 && selectedIds.length === rules.length
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th style={{ width: "60px" }}>ID</th>
                    <th style={{ minWidth: "220px" }}>标题</th>
                    <th style={{ width: "60px", textAlign: "center" }}>图标</th>
                    <th>规则</th>
                    <th style={{ width: "80px", textAlign: "center" }}>权重</th>
                    <th style={{ width: "90px", textAlign: "center" }}>状态</th>
                    <th style={{ width: "80px", textAlign: "center" }}>菜单</th>
                    <th style={{ width: "40px", textAlign: "center" }}>
                      <a
                        href="javascript:;"
                        className="btn btn-success btn-xs btn-toggle"
                        onClick={handleToggleAll}
                        title="全部展开/折叠"
                      >
                        <i
                          className={`fa ${
                            isAllExpanded ? "fa-chevron-down" : "fa-chevron-up"
                          }`}
                        ></i>
                      </a>
                    </th>
                    <th style={{ width: "90px", textAlign: "center" }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRules.map((rule) => {
                    const hasChildNodes = rules.some((r) => r.pid === rule.id);
                    const isExpanded = expandedPids.includes(rule.id);

                    return (
                      <tr key={rule.id}>
                        {/* Checkbox */}
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(rule.id)}
                            onChange={() => toggleSelectOne(rule.id)}
                          />
                        </td>
                        {/* ID */}
                        <td>{rule.id}</td>
                        {/* Title with tree hierarchy */}
                        <td style={{ textAlign: "left" }}>
                          <span
                            className={
                              rule.pid === 0
                                ? "rule-title-root"
                                : "rule-title-child"
                            }
                          >
                            {rule.title}
                          </span>
                        </td>
                        {/* Icon */}
                        <td style={{ textAlign: "center" }}>
                          <i className={`${rule.icon} rule-icon`}></i>
                        </td>
                        {/* Route Name */}
                        <td>
                          <code>{rule.name}</code>
                        </td>
                        {/* Weigh */}
                        <td style={{ textAlign: "center" }}>{rule.weigh}</td>
                        {/* Status */}
                        <td style={{ textAlign: "center" }}>
                          {rule.status === "normal" ? (
                            <span className="text-success status-indicator">
                              <i className="fa fa-circle"></i> 正常
                            </span>
                          ) : (
                            <span className="text-muted status-indicator">
                              <i className="fa fa-circle"></i> 隐藏
                            </span>
                          )}
                        </td>
                        {/* Ismenu */}
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className={`btn btn-xs ${
                              rule.ismenu === 1 ? "btn-success" : "btn-default"
                            }`}
                            onClick={() => handleToggleIsmenu(rule.id)}
                            title="点击切换"
                          >
                            {rule.ismenu === 1 ? "是" : "否"}
                          </button>
                        </td>
                        {/* Subnode Chevron */}
                        <td style={{ textAlign: "center" }}>
                          {hasChildNodes ? (
                            <button
                              type="button"
                              className="btn btn-xs btn-default btn-node-sub"
                              onClick={() => toggleSubnode(rule.id)}
                            >
                              <i
                                className={`fa ${
                                  isExpanded
                                    ? "fa-chevron-down"
                                    : "fa-chevron-right"
                                }`}
                              ></i>
                            </button>
                          ) : (
                            ""
                          )}
                        </td>
                        {/* Operate */}
                        <td style={{ textAlign: "center" }}>
                          <div className="operate-buttons">
                            <button
                              type="button"
                              className="btn btn-xs btn-success btn-editone"
                              title="编辑"
                              onClick={() => handleOpenEdit(rule)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger btn-delone"
                              title="删除"
                              onClick={() => handleDeleteOne(rule.id)}
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

            {/* Record Count */}
            <div className="pagination-wrapper">
              <div className="pagination-info">
                总共 {rules.length} 条记录 (当前展开显示 {visibleRules.length} 条)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Rule Modal */}
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
                  {modalMode === "add" ? "添加菜单规则" : "编辑菜单规则"}
                </h4>
              </div>

              <form onSubmit={handleSaveForm} className="form-horizontal">
                <div className="modal-body modal-scroll">
                  {/* Ismenu */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">菜单:</label>
                    <div className="col-sm-8 radio-group">
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="ruleIsmenu"
                          value="1"
                          checked={formState.ismenu === 1}
                          onChange={() =>
                            setFormState({ ...formState, ismenu: 1 })
                          }
                        />{" "}
                        是
                      </label>
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="ruleIsmenu"
                          value="0"
                          checked={formState.ismenu === 0}
                          onChange={() =>
                            setFormState({ ...formState, ismenu: 0 })
                          }
                        />{" "}
                        否
                      </label>
                    </div>
                  </div>

                  {/* Parent */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">父级:</label>
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
                        <option value={0}>无</option>
                        {rules
                          .filter((r) => r.pid === 0 || r.ismenu === 1)
                          .map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">规则(URL):</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        required
                        placeholder="例如: auth/rule"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">标题:</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.title}
                        onChange={(e) =>
                          setFormState({ ...formState, title: e.target.value })
                        }
                        required
                        placeholder="例如: 菜单规则"
                      />
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">图标:</label>
                    <div className="col-sm-8">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={formState.icon}
                          onChange={(e) =>
                            setFormState({ ...formState, icon: e.target.value })
                          }
                        />
                        <span className="input-group-addon">
                          <i className={formState.icon}></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Weigh */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">权重:</label>
                    <div className="col-sm-8">
                      <input
                        type="number"
                        className="form-control"
                        value={formState.weigh}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            weigh: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">规则条件:</label>
                    <div className="col-sm-8">
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formState.condition}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            condition: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>

                  {/* Remark */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">备注:</label>
                    <div className="col-sm-8">
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formState.remark}
                        onChange={(e) =>
                          setFormState({ ...formState, remark: e.target.value })
                        }
                      ></textarea>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label className="control-label col-sm-3">状态:</label>
                    <div className="col-sm-8 radio-group">
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="ruleStatus"
                          value="normal"
                          checked={formState.status === "normal"}
                          onChange={() =>
                            setFormState({ ...formState, status: "normal" })
                          }
                        />{" "}
                        正常
                      </label>
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="ruleStatus"
                          value="hidden"
                          checked={formState.status === "hidden"}
                          onChange={() =>
                            setFormState({ ...formState, status: "hidden" })
                          }
                        />{" "}
                        隐藏
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-success btn-embossed">确定</button>
                  <button
                    type="button"
                    className="btn btn-default btn-embossed"
                    onClick={() => setModalMode(null)}
                  >重置</button>
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
                  条菜单规则吗？此操作无法撤销。
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
        .auth-rule-wrapper {
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
          flex-wrap: wrap;
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

        .dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          display: block;
          float: left;
          min-width: 140px;
          padding: 5px 0;
          margin: 2px 0 0;
          font-size: 12px;
          text-align: left;
          list-style: none;
          background-color: #ffffff;
          border: 1px solid #cccccc;
          border-radius: 3px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        }

        .dropdown-menu > li > a {
          display: block;
          padding: 6px 15px;
          clear: both;
          font-weight: 400;
          line-height: 1.42857143;
          color: #333333;
          white-space: nowrap;
          text-decoration: none;
        }

        .dropdown-menu > li > a:hover {
          color: #262626;
          background-color: #f5f5f5;
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

        .table-hover > tbody > tr:hover {
          background-color: #f1f8ff;
        }

        .rule-title-root {
          font-weight: bold;
          color: #333333;
        }

        .rule-title-child {
          font-family: monospace, sans-serif;
          color: #555555;
        }

        .rule-icon {
          color: #18bc9c;
          font-size: 14px;
        }

        .table code {
          padding: 2px 4px;
          font-size: 90%;
          color: #c7254e;
          background-color: #f9f2f4;
          border-radius: 4px;
          font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
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
          box-sizing: border-box;
        }

        textarea.form-control {
          height: auto;
        }

        .form-control:focus {
          border-color: #18bc9c;
          outline: 0;
        }

        .input-group {
          display: flex;
          width: 100%;
        }

        .input-group .form-control {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .input-group-addon {
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 400;
          line-height: 1;
          color: #555;
          text-align: center;
          background-color: #eee;
          border: 1px solid #ccc;
          border-left: 0;
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
          display: flex;
          align-items: center;
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
