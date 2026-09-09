"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";

export interface ProductTypeItem {
  id: number;
  name: string;
  rank: number;
  status: boolean; // true = 启用, false = 禁用
  ctime: string;
}

export default function AdminProductTypeContent() {
  const [types, setTypes] = useState<ProductTypeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchProductTypes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getProductTypes();
      if (res.code === 1 && Array.isArray(res.data)) {
        const mapped: ProductTypeItem[] = res.data.map((t: any) => ({
          id: t.id,
          name: t.name,
          rank: t.rank || 1000,
          status: Boolean(t.status),
          ctime: t.created_at ? new Date(t.created_at).toISOString().slice(0, 19).replace("T", " ") : "-",
        }));
        setTypes(mapped);
      }
    } catch (err) {
      console.error("Lỗi nạp phân loại sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Commonsearch form fields
  const [searchForm, setSearchForm] = useState({
    name: "",
    status: "Choose",
  });

  // Column visibility state
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [columns, setColumns] = useState({
    id: true,
    name: true,
    rank: true,
    status: true,
    ctime: true,
    operate: true,
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProductTypeItem | null>(null);

  // Form states for Add/Edit
  const [modalForm, setModalForm] = useState({
    name: "",
    rank: 1000,
    status: true,
  });

  // Select all / deselect all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredTypes.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter types based on searchForm
  const filteredTypes = types.filter((item) => {
    if (
      searchForm.name &&
      !item.name.toLowerCase().includes(searchForm.name.trim().toLowerCase())
    ) {
      return false;
    }
    if (searchForm.status === "0" && item.status !== false) return false;
    if (searchForm.status === "1" && item.status !== true) return false;
    return true;
  });

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterReset = () => {
    setSearchForm({
      name: "",
      status: "Choose",
    });
    fetchProductTypes();
  };

  // Status toggle
  const handleToggleStatus = async (id: number) => {
    const t = types.find((item) => item.id === id);
    if (!t) return;
    try {
      await adminApi.saveProductType({
        id: t.id,
        name: t.name,
        rank: t.rank,
        status: !t.status ? 1 : 0,
      });
      fetchProductTypes();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái phân loại:", err);
    }
  };

  // Delete type
  const handleDelete = async (id: number) => {
    if (window.confirm("确定要删除这条记录吗？")) {
      try {
        await adminApi.deleteProductType(id);
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        fetchProductTypes();
      } catch (err) {
        console.error("Lỗi xóa phân loại sản phẩm:", err);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 条记录吗？`)) {
      try {
        for (const id of selectedIds) {
          await adminApi.deleteProductType(id);
        }
        setSelectedIds([]);
        fetchProductTypes();
      } catch (err) {
        console.error("Lỗi xóa nhiều phân loại sản phẩm:", err);
      }
    }
  };

  const handleSetStatusMulti = async (val: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        const t = types.find((item) => item.id === id);
        if (t) {
          await adminApi.saveProductType({
            id: t.id,
            name: t.name,
            rank: t.rank,
            status: val ? 1 : 0,
          });
        }
      }
      fetchProductTypes();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái hàng loạt:", err);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item: ProductTypeItem) => {
    setEditingType(item);
    setModalForm({
      name: item.name,
      rank: item.rank,
      status: item.status,
    });
  };

  // Save Add/Edit
  const handleSaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.saveProductType({
        id: editingType ? editingType.id : undefined,
        name: modalForm.name.trim(),
        rank: Number(modalForm.rank),
        status: modalForm.status ? 1 : 0,
      });
      setEditingType(null);
      setIsAddModalOpen(false);
      fetchProductTypes();
    } catch (err) {
      console.error("Lỗi lưu phân loại:", err);
    }
  };

  return (
    <div className="product-type-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">
          <span>产品管理</span>
          <span className="breadcrumb-sep">/</span>
          <span>产品分类</span>
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
                  {/* Name */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-name">
                      Name
                    </label>
                    <div className="control-input">
                      <input
                        id="search-name"
                        type="text"
                        className="form-control"
                        placeholder="Name"
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

                  {/* Status */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-status">
                      Status
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
                    fetchProductTypes();
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
                    setEditingType(null);
                    setModalForm({
                      name: "",
                      rank: 1000,
                      status: true,
                    });
                    setIsAddModalOpen(true);
                  }}
                >
                  <i className="fa fa-plus"></i> Add
                </button>

                {/* Edit */}
                <button
                  type="button"
                  className={`btn btn-success btn-edit ${
                    selectedIds.length !== 1 ? "disabled" : ""
                  }`}
                  title="Edit"
                  disabled={selectedIds.length !== 1}
                  onClick={() => {
                    const item = types.find((t) => t.id === selectedIds[0]);
                    if (item) handleOpenEdit(item);
                  }}
                >
                  <i className="fa fa-pencil"></i> Edit
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
                  <i className="fa fa-trash"></i> Delete
                </button>

                {/* More Dropdown */}
                <div className="btn-group dropdown">
                  <button
                    type="button"
                    className={`btn btn-primary btn-more dropdown-toggle ${
                      selectedIds.length === 0 ? "disabled" : ""
                    }`}
                    disabled={selectedIds.length === 0}
                  >
                    <i className="fa fa-cog"></i> More
                  </button>
                </div>

                {/* Set to normal */}
                <button
                  type="button"
                  className={`btn btn-link btn-multi ${
                    selectedIds.length === 0 ? "disabled" : ""
                  }`}
                  disabled={selectedIds.length === 0}
                  onClick={() => handleSetStatusMulti(true)}
                >
                  <i className="fa fa-eye"></i> Set to normal
                </button>

                {/* Set to hidden */}
                <button
                  type="button"
                  className={`btn btn-link btn-multi ${
                    selectedIds.length === 0 ? "disabled" : ""
                  }`}
                  disabled={selectedIds.length === 0}
                  onClick={() => handleSetStatusMulti(false)}
                >
                  <i className="fa fa-eye-slash"></i> Set to hidden
                </button>
              </div>

              {/* Right Utility Toolbar */}
              <div className="toolbar-right">
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
                          selectedIds.length === filteredTypes.length &&
                          filteredTypes.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    {columns.id && <th>Id</th>}
                    {columns.name && <th>Name</th>}
                    {columns.rank && <th>Rank</th>}
                    {columns.status && <th>Status</th>}
                    {columns.ctime && <th>Ctime</th>}
                    {columns.operate && <th className="col-operate">Operate</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredTypes.map((item) => {
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
                        {columns.rank && (
                          <td className="font-rank">{item.rank}</td>
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
                  显示第 1 到第 {Math.min(filteredTypes.length, pageSize)} 条记录，总共 3 条记录
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
      {(isAddModalOpen || editingType) && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingType(null);
                  }}
                >
                  &times;
                </button>
                <h4 className="modal-title">
                  {editingType ? "编辑产品分类" : "添加产品分类"}
                </h4>
              </div>
              <form onSubmit={handleSaveType}>
                <div className="modal-body">
                  <div className="modal-form-group">
                    <label>Name</label>
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
                    <label>Rank</label>
                    <input
                      type="number"
                      className="form-control"
                      value={modalForm.rank}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          rank: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Status</label>
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
                      setEditingType(null);
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
        .product-type-page-wrapper {
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

        .btn-link {
          color: #337ab7;
          background-color: transparent;
          border: none;
          text-decoration: none;
          font-weight: 400;
        }

        .btn-link:hover:not(:disabled) {
          text-decoration: underline;
          color: #23527c;
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

        .font-rank {
          color: #555555;
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
