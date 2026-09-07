"use client";

import React, { useState } from "react";

export interface LoanConfigItem {
  id: number;
  name: string; // 配置名称
  days: number; // 借款天数
  dailyRate: string; // 日利率
  minAmount: string; // 最低金额
  maxAmount: string; // 最高金额
  status: boolean; // true = 启用, false = 禁用
  weigh: number; // 排序
  ctime: string; // 创建时间
}

const initialConfigs: LoanConfigItem[] = [
  {
    id: 1,
    name: "5天快贷，支持用户存款到达50000元以上贷款。",
    days: 5,
    dailyRate: "0.0800%",
    minAmount: "¥2000.00",
    maxAmount: "¥50000.00",
    status: true,
    weigh: 1,
    ctime: "2025-10-28 11:10:29",
  },
  {
    id: 4,
    name: "7天快贷，支持用户存款到达100000元以上贷款。",
    days: 7,
    dailyRate: "0.1000%",
    minAmount: "¥20000.00",
    maxAmount: "¥100000.00",
    status: true,
    weigh: 1,
    ctime: "2025-10-28 17:29:59",
  },
  {
    id: 2,
    name: "15天快贷，支持用户存款到达300000元以上贷款。",
    days: 15,
    dailyRate: "0.1500%",
    minAmount: "¥200000.00",
    maxAmount: "¥500000.00",
    status: true,
    weigh: 2,
    ctime: "2025-10-28 11:10:29",
  },
  {
    id: 7,
    name: "30天快贷，支持用户存款到达500000元以上贷款。",
    days: 30,
    dailyRate: "0.2000%",
    minAmount: "¥500000.00",
    maxAmount: "¥1000000.00",
    status: true,
    weigh: 4,
    ctime: "2025-11-04 14:04:50",
  },
];

export default function AdminLoanConfigContent() {
  const [configs, setConfigs] = useState<LoanConfigItem[]>(initialConfigs);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [quickSearch, setQuickSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Commonsearch form fields
  const [searchForm, setSearchForm] = useState({
    id: "",
    name: "",
    status: "Choose",
    ctime: "",
  });

  // Column visibility state
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [columns, setColumns] = useState({
    id: true,
    name: true,
    days: true,
    dailyRate: true,
    minAmount: true,
    maxAmount: true,
    status: true,
    weigh: true,
    ctime: true,
    operate: true,
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LoanConfigItem | null>(null);

  // Form states for Add/Edit
  const [modalForm, setModalForm] = useState({
    name: "",
    days: 5,
    dailyRate: "0.0800%",
    minAmount: "2000.00",
    maxAmount: "50000.00",
    status: true,
    weigh: 1,
  });

  // Select all / deselect all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredConfigs.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter configs based on searchForm & quickSearch
  const filteredConfigs = configs.filter((item) => {
    if (searchForm.id && !String(item.id).includes(searchForm.id.trim())) {
      return false;
    }
    if (
      searchForm.name &&
      !item.name.toLowerCase().includes(searchForm.name.trim().toLowerCase())
    ) {
      return false;
    }
    if (searchForm.status === "0" && item.status !== false) return false;
    if (searchForm.status === "1" && item.status !== true) return false;
    if (searchForm.ctime && !item.ctime.includes(searchForm.ctime.trim())) {
      return false;
    }
    if (quickSearch) {
      const q = quickSearch.toLowerCase();
      const match =
        String(item.id).includes(q) ||
        item.name.toLowerCase().includes(q) ||
        String(item.days).includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterReset = () => {
    setSearchForm({
      id: "",
      name: "",
      status: "Choose",
      ctime: "",
    });
    setQuickSearch("");
    setConfigs([...initialConfigs]);
  };

  // Status toggle
  const handleToggleStatus = (id: number) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: !c.status } : c))
    );
  };

  // Delete item
  const handleDelete = (id: number) => {
    if (window.confirm("确定要删除这条记录吗？")) {
      setConfigs((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 条记录吗？`)) {
      setConfigs((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item: LoanConfigItem) => {
    setEditingItem(item);
    setModalForm({
      name: item.name,
      days: item.days,
      dailyRate: item.dailyRate,
      minAmount: item.minAmount.replace("¥", ""),
      maxAmount: item.maxAmount.replace("¥", ""),
      status: item.status,
      weigh: item.weigh,
    });
  };

  // Save Add/Edit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setConfigs((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                name: modalForm.name,
                days: Number(modalForm.days),
                dailyRate: modalForm.dailyRate.includes("%")
                  ? modalForm.dailyRate
                  : `${modalForm.dailyRate}%`,
                minAmount: `¥${modalForm.minAmount}`,
                maxAmount: `¥${modalForm.maxAmount}`,
                status: modalForm.status,
                weigh: Number(modalForm.weigh),
              }
            : c
        )
      );
      setEditingItem(null);
    } else {
      const newId = Math.max(...configs.map((c) => c.id), 0) + 1;
      const newItem: LoanConfigItem = {
        id: newId,
        name: modalForm.name,
        days: Number(modalForm.days),
        dailyRate: modalForm.dailyRate.includes("%")
          ? modalForm.dailyRate
          : `${modalForm.dailyRate}%`,
        minAmount: `¥${modalForm.minAmount}`,
        maxAmount: `¥${modalForm.maxAmount}`,
        status: modalForm.status,
        weigh: Number(modalForm.weigh),
        ctime: "2026-09-07 17:30:00",
      };
      setConfigs([newItem, ...configs]);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="loan-config-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">
          <span>Dashboard</span>
          <span className="breadcrumb-sep">/</span>
          <span>贷款管理</span>
          <span className="breadcrumb-sep">/</span>
          <span>贷款配置管理</span>
        </div>
      </div>

      <div className="content-body">
        <div className="panel panel-default panel-intro">
          <div className="panel-body">
            {/* Common Search Form */}
            {showSearchForm && (
              <form
                className="form-horizontal form-commonsearch"
                onSubmit={handleFilterSubmit}
              >
                <div className="search-grid">
                  {/* ID */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-id">
                      ID
                    </label>
                    <div className="control-input">
                      <input
                        id="search-id"
                        type="text"
                        className="form-control"
                        placeholder="ID"
                        value={searchForm.id}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            id: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* 配置名称 */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-name">
                      配置名称
                    </label>
                    <div className="control-input">
                      <input
                        id="search-name"
                        type="text"
                        className="form-control"
                        placeholder="配置名称"
                        value={searchForm.name}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* 状态 */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-status">
                      状态
                    </label>
                    <div className="control-input">
                      <select
                        id="search-status"
                        className="form-control"
                        value={searchForm.status}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Choose">Choose</option>
                        <option value="0">禁用</option>
                        <option value="1">启用</option>
                      </select>
                    </div>
                  </div>

                  {/* 创建时间 */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-ctime">
                      创建时间
                    </label>
                    <div className="control-input">
                      <input
                        id="search-ctime"
                        type="text"
                        className="form-control"
                        placeholder="创建时间"
                        value={searchForm.ctime}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            ctime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="form-group form-actions">
                    <button type="submit" className="btn btn-success">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={handleFilterReset}
                    >
                      刷新
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Action Toolbar */}
            <div className="toolbar-container">
              <div className="toolbar-left">
                {/* Refresh */}
                <button
                  type="button"
                  className="btn btn-primary btn-refresh"
                  title="Refresh"
                  onClick={() => {
                    setConfigs([...initialConfigs]);
                    setSelectedIds([]);
                  }}
                >
                  <i className="fa fa-refresh"></i>
                </button>

                {/* Add */}
                <button
                  type="button"
                  className="btn btn-success btn-add"
                  title="Add"
                  onClick={() => {
                    setEditingItem(null);
                    setModalForm({
                      name: "",
                      days: 5,
                      dailyRate: "0.0800%",
                      minAmount: "2000.00",
                      maxAmount: "50000.00",
                      status: true,
                      weigh: 1,
                    });
                    setIsAddModalOpen(true);
                  }}
                >
                  <i className="fa fa-plus"></i> Add
                </button>

                {/* Delete */}
                <button
                  type="button"
                  className={`btn btn-danger btn-del ${
                    selectedIds.length === 0 ? "disabled" : ""
                  }`}
                  title="Delete"
                  disabled={selectedIds.length === 0}
                  onClick={handleDeleteSelected}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>

              {/* Right Utility Toolbar */}
              <div className="toolbar-right">
                {/* Quick Search */}
                <div className="quick-search-box">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="搜索"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                  />
                </div>

                {/* View toggle */}
                <button
                  type="button"
                  className="btn btn-default"
                  title="切换"
                >
                  <i className="fa fa-list-alt"></i>
                </button>

                {/* Columns */}
                <div className="dropdown" style={{ position: "relative", display: "inline-block" }}>
                  <button
                    type="button"
                    className="btn btn-default"
                    title="列"
                    onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                  >
                    <i className="fa fa-th"></i> <span className="caret"></span>
                  </button>
                  {showColumnsMenu && (
                    <ul className="dropdown-menu dropdown-menu-right show-dropdown">
                      {Object.keys(columns).map((key) => (
                        <li key={key}>
                          <label className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={columns[key as keyof typeof columns]}
                              onChange={() =>
                                setColumns((prev) => ({
                                  ...prev,
                                  [key]: !prev[key as keyof typeof columns],
                                }))
                              }
                            />{" "}
                            {key}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Export */}
                <div className="dropdown" style={{ position: "relative", display: "inline-block" }}>
                  <button
                    type="button"
                    className="btn btn-default"
                    title="导出数据"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                  >
                    <i className="fa fa-sign-out"></i> <span className="caret"></span>
                  </button>
                  {showExportMenu && (
                    <ul className="dropdown-menu dropdown-menu-right show-dropdown">
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          JSON
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          XML
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          CSV
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          TXT
                        </a>
                      </li>
                      <li>
                        <a href="javascript:;" onClick={() => setShowExportMenu(false)}>
                          MS-Excel
                        </a>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Search toggle */}
                <button
                  type="button"
                  className="btn btn-default"
                  title="Common search"
                  onClick={() => setShowSearchForm(!showSearchForm)}
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>

            {/* Table Responsive */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === filteredConfigs.length &&
                          filteredConfigs.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    {columns.id && <th>ID</th>}
                    {columns.name && <th>配置名称</th>}
                    {columns.days && <th>借款天数</th>}
                    {columns.dailyRate && <th>日利率</th>}
                    {columns.minAmount && <th>最低金额</th>}
                    {columns.maxAmount && <th>最高金额</th>}
                    {columns.status && <th>状态</th>}
                    {columns.weigh && <th>排序</th>}
                    {columns.ctime && <th>创建时间</th>}
                    {columns.operate && <th className="col-operate">Operate</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredConfigs.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={isSelected ? "selected-row" : ""}
                      >
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(item.id)}
                          />
                        </td>
                        {columns.id && <td>{item.id}</td>}
                        {columns.name && (
                          <td className="font-name">{item.name}</td>
                        )}
                        {columns.days && (
                          <td className="text-center">{item.days}</td>
                        )}
                        {columns.dailyRate && (
                          <td className="text-center">{item.dailyRate}</td>
                        )}
                        {columns.minAmount && (
                          <td className="font-amount">{item.minAmount}</td>
                        )}
                        {columns.maxAmount && (
                          <td className="font-amount">{item.maxAmount}</td>
                        )}
                        {columns.status && (
                          <td className="text-center">
                            <span
                              className={`label ${
                                item.status ? "bg-green" : "bg-red"
                              }`}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleToggleStatus(item.id)}
                              title="点击切换"
                            >
                              {item.status ? "启用" : "禁用"}
                            </span>
                          </td>
                        )}
                        {columns.weigh && (
                          <td className="text-center">{item.weigh}</td>
                        )}
                        {columns.ctime && (
                          <td className="text-nowrap">{item.ctime}</td>
                        )}
                        {columns.operate && (
                          <td className="col-operate text-center">
                            <div className="btn-group-operate">
                              <button
                                type="button"
                                className="btn btn-xs btn-success btn-editone"
                                title="Edit"
                                onClick={() => handleOpenEdit(item)}
                              >
                                <i className="fa fa-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-xs btn-danger btn-delone"
                                title="Delete"
                                onClick={() => handleDelete(item.id)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Container */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  显示第 1 到第 {Math.min(filteredConfigs.length, pageSize)} 条记录，总共 4 条记录
                </span>
                <span className="page-size-select">
                  每页显示{" "}
                  <select
                    className="form-control page-size-control"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>{" "}
                  条记录
                </span>
              </div>
              <ul className="pagination">
                <li className="disabled">
                  <span>Previous</span>
                </li>
                <li className={currentPage === 1 ? "active" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </a>
                </li>
                <li className="disabled">
                  <span>Next</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingItem) && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                >
                  &times;
                </button>
                <h4 className="modal-title">
                  {editingItem ? "编辑贷款配置" : "添加贷款配置"}
                </h4>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="modal-form-group">
                    <label>配置名称</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalForm.name}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>借款天数</label>
                    <input
                      type="number"
                      className="form-control"
                      value={modalForm.days}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          days: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>日利率 (如 0.0800%)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalForm.dailyRate}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          dailyRate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>最低金额</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalForm.minAmount}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          minAmount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>最高金额</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalForm.maxAmount}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          maxAmount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>排序</label>
                    <input
                      type="number"
                      className="form-control"
                      value={modalForm.weigh}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          weigh: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>状态</label>
                    <select
                      className="form-control"
                      value={modalForm.status ? "1" : "0"}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          status: e.target.value === "1",
                        })
                      }
                    >
                      <option value="1">启用</option>
                      <option value="0">禁用</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingItem(null);
                    }}
                  >
                    取消
                  </button>
                  <button type="submit" className="btn btn-success">
                    确定
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .loan-config-page-wrapper {
          min-height: calc(100vh - 50px);
          background-color: #f1f4f6;
          font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
            "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
          color: #333333;
        }

        /* Ribbon Header */
        .content-header-ribbon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
          padding: 8px 15px;
          border-bottom: 1px solid #e7eaec;
          font-size: 12px;
        }

        .breadcrumb-left {
          color: #777777;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .breadcrumb-left :global(.fa-dashboard) {
          font-size: 13px;
        }

        .breadcrumb-right {
          color: #777777;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .breadcrumb-sep {
          color: #cccccc;
        }

        .content-body {
          padding: 15px;
        }

        .panel-default {
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-radius: 4px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .panel-body {
          padding: 15px;
        }

        /* Common Search Form */
        .form-commonsearch {
          padding: 10px 10px 15px 10px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 15px;
        }

        .search-grid {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          gap: 15px;
        }

        .form-group {
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 700;
          color: #555555;
        }

        .control-input {
          width: 170px;
        }

        .form-control {
          height: 31px;
          padding: 4px 8px;
          font-size: 12px;
          border: 1px solid #d2d6de;
          border-radius: 3px;
          color: #555555;
          outline: none;
          background-color: #ffffff;
          width: 100%;
          box-sizing: border-box;
        }

        .form-control:focus {
          border-color: #18bc9c;
        }

        .form-actions {
          display: flex;
          flex-direction: row;
          gap: 6px;
        }

        /* Action Toolbar */
        .toolbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .quick-search-box {
          width: 160px;
          margin-right: 4px;
        }

        .search-input {
          height: 31px;
          padding: 4px 8px;
          font-size: 12px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.42857143;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          border: 1px solid transparent;
          border-radius: 3px;
          height: 31px;
          box-sizing: border-box;
          transition: all 0.15s ease-in-out;
        }

        .btn.disabled,
        .btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-primary {
          background-color: #2c3e50;
          border-color: #2c3e50;
          color: #ffffff;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #1a242f;
          border-color: #161f29;
        }

        .btn-refresh {
          background-color: #18bc9c;
          border-color: #18bc9c;
          color: #ffffff;
          width: 31px;
          padding: 0;
        }

        .btn-refresh:hover {
          background-color: #15a589;
          border-color: #15a589;
        }

        .btn-success {
          background-color: #18bc9c;
          border-color: #18bc9c;
          color: #ffffff;
        }

        .btn-success:hover:not(:disabled) {
          background-color: #15a589;
          border-color: #15a589;
        }

        .btn-danger {
          background-color: #e74c3c;
          border-color: #e74c3c;
          color: #ffffff;
        }

        .btn-danger:hover:not(:disabled) {
          background-color: #d62c1a;
          border-color: #cd2a19;
        }

        .btn-default {
          background-color: #ffffff;
          border-color: #cccccc;
          color: #333333;
        }

        .btn-default:hover {
          background-color: #e6e6e6;
          border-color: #adadad;
        }

        .caret {
          display: inline-block;
          width: 0;
          height: 0;
          margin-left: 2px;
          vertical-align: middle;
          border-top: 4px dashed;
          border-top: 4px solid\\9;
          border-right: 4px solid transparent;
          border-left: 4px solid transparent;
        }

        /* Dropdown Menus */
        .show-dropdown {
          display: block;
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          float: left;
          min-width: 140px;
          padding: 5px 0;
          margin: 2px 0 0;
          font-size: 12px;
          text-align: left;
          list-style: none;
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        }

        .show-dropdown li {
          padding: 4px 12px;
        }

        .show-dropdown li:hover {
          background-color: #f5f5f5;
        }

        .show-dropdown li a {
          color: #333333;
          text-decoration: none;
          display: block;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 12px;
          color: #333;
        }

        /* Table */
        .table-responsive {
          min-height: 0.01%;
          overflow-x: auto;
          border: 1px solid #e7eaec;
        }

        .table {
          width: 100%;
          max-width: 100%;
          margin-bottom: 0;
          border-collapse: collapse;
          font-size: 12px;
        }

        .table > thead > tr > th {
          vertical-align: middle;
          border-bottom: 1px solid #e7eaec;
          border-top: 0;
          border-left: 1px solid #e7eaec;
          border-right: 1px solid #e7eaec;
          background-color: #f9fafb;
          color: #333333;
          font-weight: 600;
          padding: 8px 10px;
          white-space: nowrap;
          text-align: left;
        }

        .table > tbody > tr > td {
          padding: 8px 10px;
          line-height: 1.42857143;
          vertical-align: middle;
          border-top: 1px solid #e7eaec;
          border-left: 1px solid #e7eaec;
          border-right: 1px solid #e7eaec;
          color: #555555;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: #fcfcfc;
        }

        .table-hover > tbody > tr:hover {
          background-color: #f5f7fa;
        }

        .selected-row {
          background-color: #f0f7fd !important;
        }

        .col-checkbox {
          width: 36px;
          text-align: center !important;
        }

        .col-operate {
          width: 80px;
          text-align: center;
        }

        .font-name {
          font-weight: 500;
          color: #333333;
        }

        .font-amount {
          color: #2c3e50;
          font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        }

        .label {
          display: inline-block;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          color: #ffffff;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 3px;
        }

        .bg-green {
          background-color: #00a65a !important;
        }

        .bg-red {
          background-color: #dd4b39 !important;
        }

        .btn-group-operate {
          display: inline-flex;
          gap: 4px;
        }

        .btn-xs {
          padding: 2px 6px;
          font-size: 11px;
          line-height: 1.5;
          border-radius: 3px;
          height: 22px;
          width: 24px;
        }

        .btn-editone {
          background-color: #18bc9c;
          border-color: #18bc9c;
          color: #ffffff;
        }

        .btn-editone:hover {
          background-color: #15a589;
          border-color: #15a589;
        }

        .btn-delone {
          background-color: #e74c3c;
          border-color: #e74c3c;
          color: #ffffff;
        }

        .btn-delone:hover {
          background-color: #d62c1a;
          border-color: #cd2a19;
        }

        /* Pagination */
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pagination-info {
          font-size: 12px;
          color: #777777;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-size-control {
          display: inline-block;
          width: 58px;
          height: 26px;
          padding: 2px 6px;
          font-size: 12px;
          vertical-align: middle;
        }

        .pagination {
          display: flex;
          padding-left: 0;
          margin: 0;
          border-radius: 4px;
          list-style: none;
        }

        .pagination > li > a,
        .pagination > li > span {
          position: relative;
          float: left;
          padding: 4px 10px;
          margin-left: -1px;
          line-height: 1.42857143;
          color: #337ab7;
          text-decoration: none;
          background-color: #ffffff;
          border: 1px solid #dddddd;
          font-size: 12px;
        }

        .pagination > li:first-child > a,
        .pagination > li:first-child > span {
          margin-left: 0;
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
        }

        .pagination > li:last-child > a,
        .pagination > li:last-child > span {
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }

        .pagination > li.active > a {
          z-index: 2;
          color: #ffffff;
          cursor: default;
          background-color: #18bc9c;
          border-color: #18bc9c;
        }

        .pagination > li.disabled > span {
          color: #777777;
          cursor: not-allowed;
          background-color: #ffffff;
          border-color: #dddddd;
        }

        .pagination > li > a:hover {
          background-color: #eeeeee;
        }

        /* Modal Dialog */
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
          padding: 15px;
        }

        .modal-dialog {
          position: relative;
          width: 480px;
          max-width: 100%;
          background-color: #ffffff;
          border-radius: 6px;
          box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .modal-header {
          padding: 12px 15px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f9fafb;
        }

        .modal-title {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #333333;
        }

        .close {
          border: none;
          background: transparent;
          font-size: 20px;
          font-weight: 700;
          color: #000000;
          opacity: 0.2;
          cursor: pointer;
        }

        .close:hover {
          opacity: 0.5;
        }

        .modal-body {
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .modal-form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .modal-form-group label {
          font-size: 12px;
          font-weight: 600;
          color: #333333;
        }

        .modal-footer {
          padding: 10px 15px;
          text-align: right;
          border-top: 1px solid #e5e5e5;
          background-color: #f9fafb;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .search-grid {
            flex-direction: column;
            align-items: stretch;
          }

          .control-input {
            width: 100%;
          }

          .toolbar-container {
            flex-direction: column;
            align-items: stretch;
          }

          .pagination-container {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
