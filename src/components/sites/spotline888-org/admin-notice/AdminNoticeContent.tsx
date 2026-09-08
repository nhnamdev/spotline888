"use client";

import React, { useState } from "react";
import { INITIAL_NOTICES, NoticeItem } from "./noticeData";

export default function AdminNoticeContent() {
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search form fields
  const [searchForm, setSearchForm] = useState({
    title: "",
    type: "",
    status: "",
  });

  // Modal dialog state (Add / Edit)
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<NoticeItem | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    type: 1,
    short_content: "",
    content: "",
    rank: 1000,
    status: 1,
  });

  // Delete confirmation modal
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered notices
  const filteredNotices = notices.filter((item) => {
    if (
      searchForm.title &&
      !item.title.toLowerCase().includes(searchForm.title.trim().toLowerCase())
    ) {
      return false;
    }
    if (searchForm.type && String(item.type) !== searchForm.type) {
      return false;
    }
    if (searchForm.status && String(item.status) !== searchForm.status) {
      return false;
    }
    return true;
  });

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredNotices.map((n) => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("数据刷新成功 (Refresh successful)");
    }, 400);
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormState({
      title: "",
      type: 1,
      short_content: "",
      content: "",
      rank: 1000,
      status: 1,
    });
    setModalMode("add");
  };

  // Open Edit modal
  const handleOpenEdit = (item?: NoticeItem) => {
    const target =
      item || notices.find((n) => n.id === selectedIds[0]);
    if (!target) return;
    setEditingItem(target);
    setFormState({
      title: target.title,
      type: target.type,
      short_content: target.short_content || "",
      content: target.content,
      rank: target.rank,
      status: target.status,
    });
    setModalMode("edit");
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    if (modalMode === "add") {
      const newId = Math.max(...notices.map((n) => n.id), 0) + 1;
      const newItem: NoticeItem = {
        id: newId,
        type: Number(formState.type),
        title: formState.title,
        url: null,
        short_content: formState.short_content,
        content: formState.content,
        rank: Number(formState.rank) || 1000,
        status: Number(formState.status),
        ctime: nowStr,
        rtime: nowStr,
      };
      setNotices([newItem, ...notices]);
      showToast("添加成功 (Notice added successfully)");
    } else if (modalMode === "edit" && editingItem) {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editingItem.id
            ? {
                ...n,
                type: Number(formState.type),
                title: formState.title,
                short_content: formState.short_content,
                content: formState.content,
                rank: Number(formState.rank) || 1000,
                status: Number(formState.status),
                rtime: nowStr,
              }
            : n
        )
      );
      showToast("修改成功 (Notice updated successfully)");
    }

    setModalMode(null);
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    setNotices((prev) => prev.filter((n) => !deleteConfirmIds.includes(n.id)));
    setSelectedIds((prev) =>
      prev.filter((id) => !deleteConfirmIds.includes(id))
    );
    setDeleteConfirmIds(null);
    showToast("删除成功 (Notice deleted successfully)");
  };

  // Toggle status
  const handleToggleStatus = (id: number) => {
    setNotices((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: n.status === 1 ? 0 : 1 } : n
      )
    );
    showToast("状态已更新 (Status updated)");
  };

  const renderTypeBadge = (type: number) => {
    switch (type) {
      case 1:
        return <small className="label bg-green">公告</small>;
      case 2:
        return <small className="label bg-blue">帮助中心</small>;
      case 3:
        return <small className="label bg-orange">隐私政策</small>;
      case 4:
        return <small className="label bg-purple">合同简介</small>;
      default:
        return <small className="label bg-gray">未知</small>;
    }
  };

  const isAllSelected =
    filteredNotices.length > 0 &&
    filteredNotices.every((n) => selectedIds.includes(n.id));

  return (
    <div className="admin-notice-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fastadmin-toast">
          <i className="fa fa-check-circle"></i> {toastMessage}
        </div>
      )}

      {/* Ribbon Breadcrumb */}
      <div id="ribbon" className="notice-ribbon">
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
              新闻公告
            </a>
          </li>
        </ol>
      </div>

      {/* Main Content Area */}
      <div className="content">
        <div className="panel panel-default panel-intro">
          <div className="panel-body">
            <div className="tab-content">
              <div className="tab-pane active in">
                <div className="widget-body no-padding">
                  {/* Search Form (Default Visible in FastAdmin notice) */}
                  <div className="commonsearch-table">
                    <form
                      className="form-horizontal"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="row">
                        {/* Title */}
                        <div className="col-xs-12 col-sm-6 col-md-3">
                          <div className="form-group">
                            <label className="control-label col-xs-4">
                              Title
                            </label>
                            <div className="col-xs-8">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="LIKE %...%"
                                value={searchForm.title}
                                onChange={(e) =>
                                  setSearchForm({
                                    ...searchForm,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* 类型 */}
                        <div className="col-xs-12 col-sm-6 col-md-3">
                          <div className="form-group">
                            <label className="control-label col-xs-4">
                              类型
                            </label>
                            <div className="col-xs-8">
                              <select
                                className="form-control"
                                value={searchForm.type}
                                onChange={(e) =>
                                  setSearchForm({
                                    ...searchForm,
                                    type: e.target.value,
                                  })
                                }
                              >
                                <option value="">全部</option>
                                <option value="1">公告</option>
                                <option value="2">帮助中心</option>
                                <option value="3">隐私政策</option>
                                <option value="4">合同简介</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-xs-12 col-sm-6 col-md-3">
                          <div className="form-group">
                            <label className="control-label col-xs-4">
                              Status
                            </label>
                            <div className="col-xs-8">
                              <select
                                className="form-control"
                                value={searchForm.status}
                                onChange={(e) =>
                                  setSearchForm({
                                    ...searchForm,
                                    status: e.target.value,
                                  })
                                }
                              >
                                <option value="">全部</option>
                                <option value="1">启用</option>
                                <option value="0">禁用</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-xs-12 col-sm-6 col-md-3">
                          <div className="form-group search-actions-group">
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                showToast("筛选成功 (Filtered)");
                              }}
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn btn-default btn-sm"
                              onClick={() => {
                                setSearchForm({
                                  title: "",
                                  type: "",
                                  status: "",
                                });
                                showToast("已重置筛选 (Filters reset)");
                              }}
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Toolbar */}
                  <div id="toolbar" className="toolbar">
                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-refresh"
                      title="Refresh"
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
                      title="Add"
                      onClick={handleOpenAdd}
                    >
                      <i className="fa fa-plus"></i> Add
                    </a>

                    <a
                      href="javascript:;"
                      className={`btn btn-success btn-edit ${
                        selectedIds.length !== 1 ? "btn-disabled disabled" : ""
                      }`}
                      title="Edit"
                      onClick={() =>
                        selectedIds.length === 1 && handleOpenEdit()
                      }
                    >
                      <i className="fa fa-pencil"></i> Edit
                    </a>

                    <a
                      href="javascript:;"
                      className={`btn btn-danger btn-del ${
                        selectedIds.length === 0 ? "btn-disabled disabled" : ""
                      }`}
                      title="Delete"
                      onClick={() =>
                        selectedIds.length > 0 &&
                        setDeleteConfirmIds([...selectedIds])
                      }
                    >
                      <i className="fa fa-trash"></i> Delete
                    </a>
                  </div>

                  {/* Table */}
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover table-nowrap">
                      <thead>
                        <tr>
                          <th
                            className="bs-checkbox text-center"
                            style={{ width: 36 }}
                          >
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th style={{ width: 60 }} className="text-center">
                            <div className="th-inner">Id</div>
                          </th>
                          <th className="text-left">
                            <div className="th-inner">Title</div>
                          </th>
                          <th style={{ width: 120 }} className="text-center">
                            <div className="th-inner">类型</div>
                          </th>
                          <th style={{ width: 80 }} className="text-center">
                            <div className="th-inner">Rank</div>
                          </th>
                          <th style={{ width: 90 }} className="text-center">
                            <div className="th-inner">Status</div>
                          </th>
                          <th style={{ width: 160 }} className="text-center">
                            <div className="th-inner">Ctime</div>
                          </th>
                          <th style={{ width: 100 }} className="text-center">
                            <div className="th-inner">Operate</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNotices.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center no-records">
                              没有找到匹配的记录 (No matching records found)
                            </td>
                          </tr>
                        ) : (
                          filteredNotices.map((row) => (
                            <tr
                              key={row.id}
                              className={
                                selectedIds.includes(row.id) ? "selected" : ""
                              }
                            >
                              <td className="bs-checkbox text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(row.id)}
                                  onChange={() => handleSelectRow(row.id)}
                                />
                              </td>
                              <td className="text-center">{row.id}</td>
                              <td className="text-left font-medium notice-title-cell">
                                <span title={row.title}>{row.title}</span>
                              </td>
                              <td className="text-center">
                                {renderTypeBadge(row.type)}
                              </td>
                              <td className="text-center">{row.rank}</td>
                              <td className="text-center">
                                <span
                                  onClick={() => handleToggleStatus(row.id)}
                                  style={{ cursor: "pointer" }}
                                  title="Click to toggle status"
                                >
                                  {row.status === 1 ? (
                                    <small className="label bg-green">
                                      启用
                                    </small>
                                  ) : (
                                    <small className="label bg-red">
                                      禁用
                                    </small>
                                  )}
                                </span>
                              </td>
                              <td className="text-center text-muted font-mono">
                                {row.ctime}
                              </td>
                              <td className="text-center">
                                <div className="operate-buttons">
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-success btn-editone"
                                    title="Edit"
                                    onClick={() => handleOpenEdit(row)}
                                  >
                                    <i className="fa fa-pencil"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-danger btn-delone"
                                    title="Delete"
                                    onClick={() => setDeleteConfirmIds([row.id])}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Count */}
                  <div className="table-count-summary text-right">
                    总共 <b>{filteredNotices.length}</b> 条记录
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal Dialog */}
      {modalMode && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom modal-notice-dialog">
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
                  {modalMode === "add" ? "Add" : "Edit"}
                </h4>
              </div>
              <form
                className="form-horizontal"
                onSubmit={handleSaveForm}
                autoComplete="off"
              >
                <div className="modal-body">
                  {/* Title */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Title:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="请输入标题"
                        value={formState.title}
                        onChange={(e) =>
                          setFormState({ ...formState, title: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* 类型 */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      类型:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <select
                        className="form-control"
                        value={formState.type}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            type: Number(e.target.value),
                          })
                        }
                      >
                        <option value="1">公告（首页广播）</option>
                        <option value="2">帮助中心</option>
                        <option value="3">隐私政策</option>
                        <option value="4">合同简介</option>
                      </select>
                    </div>
                  </div>

                  {/* Short Content */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Short_content:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="可选，用于列表简介"
                        value={formState.short_content}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            short_content: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Content:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <textarea
                        rows={8}
                        className="form-control editor"
                        placeholder="请输入正文内容"
                        value={formState.content}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            content: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>

                  {/* Rank */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Rank:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="number"
                        className="form-control"
                        value={formState.rank}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            rank: parseInt(e.target.value, 10) || 0,
                          })
                        }
                      />
                      <span className="help-block">
                        数值越大，排序越靠前（首页公告建议设置更大）
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Status:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <select
                        className="form-control"
                        value={formState.status}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            status: Number(e.target.value),
                          })
                        }
                      >
                        <option value="1">启用</option>
                        <option value="0">禁用</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer layer-footer">
                  <div className="form-group">
                    <div className="col-xs-12 col-sm-offset-2 col-sm-8">
                      <button
                        type="submit"
                        className="btn btn-success btn-embossed"
                      >
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
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmIds && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom delete-modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => setDeleteConfirmIds(null)}
                >
                  &times;
                </button>
                <h4 className="modal-title">提示 (Notice)</h4>
              </div>
              <div className="modal-body">
                <p>
                  确定要删除这 {deleteConfirmIds.length} 项吗？ (Are you sure you
                  want to delete the selected item(s)?)
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  确定 (Confirm)
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => setDeleteConfirmIds(null)}
                >
                  取消 (Cancel)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-notice-wrapper {
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
        .notice-ribbon {
          background: #ffffff;
          border-bottom: 1px solid #e7eaec;
          padding: 11px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notice-ribbon .breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 12px;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .notice-ribbon .breadcrumb a {
          color: #777;
          text-decoration: none;
        }

        .notice-ribbon .breadcrumb a:hover {
          color: #333;
        }

        /* Content Container */
        .content {
          padding: 15px;
        }

        .panel-intro {
          border-radius: 3px;
          border: 1px solid #e7eaec;
          background: #fff;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .panel-body {
          padding: 15px;
        }

        /* Common Search Box */
        .commonsearch-table {
          background-color: #f9f9f9;
          border: 1px solid #e7eaec;
          border-radius: 4px;
          padding: 12px 15px 5px 15px;
          margin-bottom: 12px;
        }

        .commonsearch-table .form-group {
          margin-bottom: 10px;
        }

        .search-actions-group {
          display: flex;
          gap: 8px;
          align-items: center;
          padding-top: 2px;
        }

        /* Toolbar */
        .toolbar {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          white-space: nowrap;
          padding: 6px 12px;
          font-size: 12px;
          line-height: 1.42857143;
          border-radius: 3px;
          transition: all 0.15s ease-in-out;
        }

        .btn-sm {
          padding: 5px 12px;
          font-size: 12px;
        }

        .btn-primary {
          color: #fff;
          background-color: #18bc9c;
          border-color: #18bc9c;
        }

        .btn-primary:hover {
          background-color: #15a589;
        }

        .btn-success {
          color: #fff;
          background-color: #2c3e50;
          border-color: #2c3e50;
        }

        .btn-success:hover {
          background-color: #233140;
        }

        .btn-danger {
          color: #fff;
          background-color: #e74c3c;
          border-color: #e74c3c;
        }

        .btn-danger:hover {
          background-color: #d62c1a;
        }

        .btn-default {
          color: #333;
          background-color: #fff;
          border-color: #ccc;
        }

        .btn-default:hover {
          background-color: #e6e6e6;
        }

        .btn-disabled,
        .btn.disabled {
          cursor: not-allowed;
          opacity: 0.65;
          pointer-events: none;
        }

        /* Table */
        .table-responsive {
          min-height: 0.01%;
          overflow-x: auto;
        }

        .table {
          width: 100%;
          max-width: 100%;
          margin-bottom: 12px;
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

        tr.selected {
          background-color: #eaf8f5 !important;
        }

        .th-inner {
          padding: 2px 4px;
        }

        .notice-title-cell {
          max-width: 350px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .label {
          display: inline;
          padding: 0.2em 0.6em 0.3em;
          font-size: 75%;
          font-weight: 700;
          color: #fff;
          border-radius: 0.25em;
        }

        .bg-green {
          background-color: #00a65a !important;
        }

        .bg-blue {
          background-color: #0073b7 !important;
        }

        .bg-orange {
          background-color: #ff851b !important;
        }

        .bg-purple {
          background-color: #605ca8 !important;
        }

        .bg-red {
          background-color: #dd4b39 !important;
        }

        .bg-gray {
          background-color: #d2d6de !important;
          color: #444 !important;
        }

        .font-mono {
          font-family: monospace;
          font-size: 12px;
        }

        .operate-buttons {
          display: flex;
          justify-content: center;
          gap: 4px;
        }

        .btn-xs {
          padding: 1px 5px;
          font-size: 12px;
          line-height: 1.5;
          border-radius: 3px;
        }

        .table-count-summary {
          font-size: 13px;
          color: #666;
          padding: 5px 0;
        }

        /* Modal */
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

        .modal-dialog-custom {
          position: relative;
          width: 100%;
          max-width: 720px;
          max-height: 90vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
          animation: modalFadeIn 0.2s ease-out;
        }

        .delete-modal-dialog {
          max-width: 450px;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          color: #333;
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
          padding: 20px 25px;
        }

        .modal-footer {
          padding: 15px;
          text-align: right;
          border-top: 1px solid #e5e5e5;
        }

        .form-group {
          margin-bottom: 15px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }

        .control-label {
          text-align: right;
          margin-bottom: 0;
          padding-top: 7px;
          font-weight: bold;
          font-size: 13px;
          color: #333;
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

        textarea.form-control {
          height: auto;
        }

        .help-block {
          display: block;
          margin-top: 5px;
          margin-bottom: 10px;
          color: #737373;
          font-size: 12px;
        }

        .btn-embossed {
          box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.15);
          padding: 7px 20px;
          font-size: 13px;
          font-weight: 600;
          margin-right: 8px;
        }

        /* Responsive */
        @media (min-width: 768px) {
          .col-sm-2 {
            width: 16.66666667%;
            float: left;
          }
          .col-sm-8 {
            width: 66.66666667%;
            float: left;
          }
          .col-sm-offset-2 {
            margin-left: 16.66666667%;
          }
        }

        @media (max-width: 767px) {
          .control-label {
            text-align: left;
            margin-bottom: 5px;
          }
          .notice-ribbon {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
}
