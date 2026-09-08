"use client";

import React, { useState } from "react";
import { INITIAL_YUEBAO_CONFIGS, YuebaoConfigItem } from "./yuebaoConfigData";

export default function AdminYuebaoConfigContent() {
  const [configs, setConfigs] = useState<YuebaoConfigItem[]>(INITIAL_YUEBAO_CONFIGS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick search
  const [quickSearch, setQuickSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Sorting state
  const [sortField, setSortField] = useState<keyof YuebaoConfigItem>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal dialog (Add / Edit)
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<YuebaoConfigItem | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    radio: "",
    day: 5,
    min_money: "",
    status: 1,
  });

  // Delete modal
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter
  const filteredConfigs = configs.filter((item) => {
    if (!quickSearch.trim()) return true;
    const q = quickSearch.trim().toLowerCase();
    return (
      String(item.id).includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.radio.toLowerCase().includes(q) ||
      String(item.day).includes(q) ||
      item.min_money.toLowerCase().includes(q) ||
      item.creat_time.includes(q)
    );
  });

  // Sort
  const sortedConfigs = [...filteredConfigs].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    const strA = String(valA || "");
    const strB = String(valB || "");
    return sortOrder === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  // Paginate
  const totalRows = sortedConfigs.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const currentConfigs = sortedConfigs.slice(startIndex, endIndex);

  // Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentConfigs.map((c) => c.id));
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
    currentConfigs.length > 0 &&
    currentConfigs.every((c) => selectedIds.includes(c.id));

  // Sort toggle
  const handleSort = (field: keyof YuebaoConfigItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("刷新成功 (Refresh successful)");
    }, 400);
  };

  // Open Add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormState({
      title: "",
      radio: "",
      day: 5,
      min_money: "",
      status: 1,
    });
    setModalMode("add");
  };

  // Open Edit
  const handleOpenEdit = (item?: YuebaoConfigItem) => {
    const target = item || configs.find((c) => c.id === selectedIds[0]);
    if (!target) return;
    setEditingItem(target);
    setFormState({
      title: target.title,
      radio: target.radio.replace("%", ""),
      day: target.day,
      min_money: target.min_money,
      status: target.status,
    });
    setModalMode("edit");
  };

  // Toggle status directly on badge click
  const handleToggleStatus = (id: number) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 1 ? 0 : 1 } : c
      )
    );
    showToast("状态已更新 (Status updated)");
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.radio.trim()) {
      alert("请填写完整配置信息");
      return;
    }

    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    const radioFormatted = formState.radio.includes("%")
      ? formState.radio
      : `${formState.radio}%`;

    if (modalMode === "add") {
      const newId = Math.max(...configs.map((c) => c.id), 0) + 1;
      const newItem: YuebaoConfigItem = {
        id: newId,
        title: formState.title,
        radio: radioFormatted,
        day: Number(formState.day) || 1,
        min_money: formState.min_money,
        status: Number(formState.status),
        creat_time: nowStr,
        status_text: Number(formState.status) === 1 ? "启用" : "禁用",
      };
      setConfigs([newItem, ...configs]);
      showToast("添加成功 (Config added successfully)");
    } else if (modalMode === "edit" && editingItem) {
      setConfigs((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                title: formState.title,
                radio: radioFormatted,
                day: Number(formState.day) || 1,
                min_money: formState.min_money,
                status: Number(formState.status),
                status_text: Number(formState.status) === 1 ? "启用" : "禁用",
              }
            : c
        )
      );
      showToast("修改成功 (Config updated successfully)");
    }

    setModalMode(null);
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    setConfigs((prev) => prev.filter((c) => !deleteConfirmIds.includes(c.id)));
    setSelectedIds((prev) =>
      prev.filter((id) => !deleteConfirmIds.includes(id))
    );
    setDeleteConfirmIds(null);
    showToast("删除成功 (Deleted successfully)");
  };

  return (
    <div className="admin-yuebao-config-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fastadmin-toast">
          <i className="fa fa-check-circle"></i> {toastMessage}
        </div>
      )}

      {/* Ribbon Breadcrumb */}
      <div id="ribbon" className="config-ribbon">
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
              余额宝管理
            </a>
          </li>
          <li>
            <a href="javascript:;" onClick={(e) => e.preventDefault()}>
              余额宝配置
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
                        onClick={() => selectedIds.length === 1 && handleOpenEdit()}
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
                          setDeleteConfirmIds(selectedIds)
                        }
                      >
                        <i className="fa fa-trash"></i> Delete
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
                            style={{ width: "80px" }}
                            onClick={() => handleSort("id")}
                          >
                            ID{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "id"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th
                            className="sortable"
                            style={{ width: "200px" }}
                            onClick={() => handleSort("title")}
                          >
                            配置标题{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "title"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th
                            className="sortable"
                            style={{ width: "100px" }}
                            onClick={() => handleSort("radio")}
                          >
                            收益率{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "radio"
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
                            onClick={() => handleSort("day")}
                          >
                            计算周期(天){" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "day"
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
                            onClick={() => handleSort("min_money")}
                          >
                            最低金额{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "min_money"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th
                            className="sortable"
                            style={{ width: "100px" }}
                            onClick={() => handleSort("status")}
                          >
                            状态{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "status"
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
                            onClick={() => handleSort("creat_time")}
                          >
                            创建时间{" "}
                            <i
                              className={`fa fa-sort${
                                sortField === "creat_time"
                                  ? sortOrder === "asc"
                                    ? "-asc text-primary"
                                    : "-desc text-primary"
                                  : ""
                              }`}
                            ></i>
                          </th>
                          <th className="text-center" style={{ width: "200px" }}>
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentConfigs.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="text-center no-records">
                              没有找到匹配的记录 (No records found)
                            </td>
                          </tr>
                        ) : (
                          currentConfigs.map((item) => (
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
                              <td>{item.title}</td>
                              <td style={{ color: "#00a65a", fontWeight: "bold" }}>
                                {item.radio}
                              </td>
                              <td>{item.day}</td>
                              <td>{item.min_money}</td>
                              <td>
                                <span
                                  className={`label ${
                                    item.status === 1
                                      ? "label-success"
                                      : "label-danger"
                                  }`}
                                  style={{ cursor: "pointer" }}
                                  title="点击切换状态"
                                  onClick={() => handleToggleStatus(item.id)}
                                >
                                  {item.status === 1 ? "启用" : "禁用"}
                                </span>
                              </td>
                              <td>{item.creat_time}</td>
                              <td className="text-center">
                                <button
                                  className="btn btn-xs btn-success btn-editone"
                                  title="Edit"
                                  style={{ marginRight: "5px" }}
                                  onClick={() => handleOpenEdit(item)}
                                >
                                  <i className="fa fa-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-xs btn-danger btn-delone"
                                  title="Delete"
                                  onClick={() => setDeleteConfirmIds([item.id])}
                                >
                                  <i className="fa fa-trash"></i>
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

      {/* Add / Edit Modal Dialog */}
      {modalMode && (
        <div className="fastadmin-modal-overlay">
          <div className="fastadmin-modal-dialog">
            <div className="fastadmin-modal-header">
              <span className="modal-title">
                {modalMode === "add" ? "Add" : "Edit"} - 余额宝配置
              </span>
              <button
                type="button"
                className="close"
                onClick={() => setModalMode(null)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveForm}>
              <div className="fastadmin-modal-body">
                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    配置标题:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={formState.title}
                      placeholder="如：5"
                      required
                      onChange={(e) =>
                        setFormState({ ...formState, title: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    收益率(%):
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={formState.radio}
                      placeholder="如：1.00 或 1.00-1.22"
                      required
                      onChange={(e) =>
                        setFormState({ ...formState, radio: e.target.value })
                      }
                    />
                    <span className="help-block">
                      输入单个数字(如：1.00)或范围(如：1.00-1.22)
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    计算周期(天):
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="number"
                      className="form-control"
                      value={formState.day}
                      required
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          day: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    最低金额:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={formState.min_money}
                      placeholder="如：10000 或 10000-500000"
                      required
                      onChange={(e) =>
                        setFormState({ ...formState, min_money: e.target.value })
                      }
                    />
                    <span className="help-block">
                      输入单个数字(如：10000)或范围(如：10000-500000)
                    </span>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    状态:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <div className="radio-group">
                      <label style={{ marginRight: "15px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="status"
                          value={1}
                          checked={formState.status === 1}
                          onChange={() =>
                            setFormState({ ...formState, status: 1 })
                          }
                        />{" "}
                        启用
                      </label>
                      <label style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="status"
                          value={0}
                          checked={formState.status === 0}
                          onChange={() =>
                            setFormState({ ...formState, status: 0 })
                          }
                        />{" "}
                        禁用
                      </label>
                    </div>
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
                  onClick={() => setModalMode(null)}
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
                  确定删除选中的 {deleteConfirmIds.length} 条记录?
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
        .admin-yuebao-config-wrapper {
          padding: 0;
        }

        .config-ribbon {
          background: #fff;
          border-bottom: 1px solid #e7e7e7;
          padding: 8px 15px;
          min-height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .config-ribbon ol.breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 12px;
        }

        .config-ribbon ol.breadcrumb li {
          display: inline-block;
        }

        .config-ribbon ol.breadcrumb li + li:before {
          content: "/ ";
          padding: 0 5px;
          color: #ccc;
        }

        .config-ribbon a {
          color: #777;
          text-decoration: none;
        }

        .config-ribbon a:hover {
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

        .label-danger {
          background-color: #d9534f;
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

        .help-block {
          display: block;
          margin-top: 5px;
          margin-bottom: 5px;
          color: #737373;
          font-size: 11px;
        }

        .radio-group {
          padding-top: 6px;
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
