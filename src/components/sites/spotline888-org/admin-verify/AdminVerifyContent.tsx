"use client";

import React, { useState } from "react";
import Image from "next/image";
import { INITIAL_VERIFY_ITEMS, VerifyItem } from "./verifyData";

export default function AdminVerifyContent() {
  const [items, setItems] = useState<VerifyItem[]>(INITIAL_VERIFY_ITEMS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search form toggle & state
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const [searchForm, setSearchForm] = useState({
    id: "",
    username: "",
    real_name: "",
    id_card: "",
    profession: "",
    gj: "",
    is_auth: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<"id">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal dialog states
  const [editingItem, setEditingItem] = useState<VerifyItem | null>(null);
  const [editForm, setEditForm] = useState({
    real_name: "",
    id_card: "",
    profession: "",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
  });

  // Batch action modals
  const [showBatchPassConfirm, setShowBatchPassConfirm] = useState(false);
  const [showBatchRejectModal, setShowBatchRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Delete modal
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  // Image lightbox preview
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    if (quickSearch.trim()) {
      const q = quickSearch.trim().toLowerCase();
      const matchQuick =
        String(item.id).includes(q) ||
        item.username.toLowerCase().includes(q) ||
        item.real_name.toLowerCase().includes(q) ||
        item.id_card.toLowerCase().includes(q) ||
        item.profession.toLowerCase().includes(q);
      if (!matchQuick) return false;
    }

    if (searchForm.id && !String(item.id).includes(searchForm.id.trim())) {
      return false;
    }
    if (
      searchForm.username &&
      !item.username.toLowerCase().includes(searchForm.username.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      searchForm.real_name &&
      !item.real_name.toLowerCase().includes(searchForm.real_name.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      searchForm.id_card &&
      !item.id_card.toLowerCase().includes(searchForm.id_card.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      searchForm.profession &&
      !item.profession.toLowerCase().includes(searchForm.profession.trim().toLowerCase())
    ) {
      return false;
    }
    if (searchForm.gj && item.gj !== searchForm.gj) {
      return false;
    }
    if (searchForm.is_auth && String(item.is_auth) !== searchForm.is_auth) {
      return false;
    }

    return true;
  });

  // Sorted items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortField === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }
    return 0;
  });

  // Paginated items
  const totalRows = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const currentItems = sortedItems.slice(startIndex, endIndex);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentItems.map((n) => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    currentItems.length > 0 &&
    currentItems.every((n) => selectedIds.includes(n.id));

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("数据刷新成功 (Refresh successful)");
    }, 400);
  };

  // Open Edit
  const handleOpenEdit = (item: VerifyItem) => {
    setEditingItem(item);
    setEditForm({
      real_name: item.real_name,
      id_card: item.id_card,
      profession: item.profession,
      gj: item.gj || "id_card",
      is_auth: item.is_auth,
      id_auth_error: item.id_auth_error || "",
    });
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setItems((prev) =>
      prev.map((n) =>
        n.id === editingItem.id
          ? {
              ...n,
              real_name: editForm.real_name,
              id_card: editForm.id_card,
              profession: editForm.profession,
              gj: editForm.gj,
              is_auth: Number(editForm.is_auth),
              id_auth_error: editForm.id_auth_error,
              verify_time:
                Number(editForm.is_auth) === 2 || Number(editForm.is_auth) === -1
                  ? new Date().toISOString().replace("T", " ").substring(0, 19)
                  : n.verify_time,
            }
          : n
      )
    );

    setEditingItem(null);
    showToast("修改成功 (Saved successfully)");
  };

  // Batch Pass
  const handleBatchPassClick = () => {
    if (selectedIds.length === 0) {
      alert("请先选择要操作的记录");
      return;
    }
    setShowBatchPassConfirm(true);
  };

  const handleConfirmBatchPass = () => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    setItems((prev) =>
      prev.map((n) =>
        selectedIds.includes(n.id)
          ? {
              ...n,
              is_auth: 2,
              id_auth_error: "",
              verify_time: nowStr,
            }
          : n
      )
    );
    setShowBatchPassConfirm(false);
    setSelectedIds([]);
    showToast("操作成功 (Batch approved successfully)");
  };

  // Batch Reject
  const handleBatchRejectClick = () => {
    if (selectedIds.length === 0) {
      alert("请先选择要操作的记录");
      return;
    }
    setRejectReason("");
    setShowBatchRejectModal(true);
  };

  const handleConfirmBatchReject = () => {
    if (!rejectReason.trim()) {
      alert("请输入拒绝原因");
      return;
    }
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    setItems((prev) =>
      prev.map((n) =>
        selectedIds.includes(n.id)
          ? {
              ...n,
              is_auth: -1,
              id_auth_error: rejectReason.trim(),
              verify_time: nowStr,
            }
          : n
      )
    );
    setShowBatchRejectModal(false);
    setSelectedIds([]);
    showToast("操作成功 (Batch rejected successfully)");
  };

  // Delete
  const handleDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setDeleteConfirmIds(selectedIds);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    setItems((prev) => prev.filter((n) => !deleteConfirmIds.includes(n.id)));
    setSelectedIds((prev) =>
      prev.filter((id) => !deleteConfirmIds.includes(id))
    );
    setDeleteConfirmIds(null);
    showToast("删除成功 (Deleted successfully)");
  };

  // Status formatter
  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="text-muted">
            <i className="fa fa-circle text-gray"></i> 未认证
          </span>
        );
      case 1:
        return (
          <span className="text-warning">
            <i className="fa fa-circle text-yellow"></i> 已提交
          </span>
        );
      case 2:
        return (
          <span className="text-success">
            <i className="fa fa-circle text-success"></i> 已认证
          </span>
        );
      case -1:
        return (
          <span className="text-danger">
            <i className="fa fa-circle text-danger"></i> 认证失败
          </span>
        );
      default:
        return <span>-</span>;
    }
  };

  // Id Type formatter
  const renderIdType = (gj: string | null) => {
    if (gj === "id_card") return "身份证";
    if (gj === "passport") return "护照";
    if (gj) return gj;
    return "-";
  };

  return (
    <div className="admin-verify-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fastadmin-toast">
          <i className="fa fa-check-circle"></i> {toastMessage}
        </div>
      )}

      {/* Ribbon Breadcrumb */}
      <div id="ribbon" className="verify-ribbon">
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
              实名认证
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
                        className={`btn btn-danger btn-del ${
                          selectedIds.length === 0 ? "btn-disabled disabled" : ""
                        }`}
                        title="Delete"
                        onClick={handleDeleteClick}
                      >
                        <i className="fa fa-trash"></i> Delete
                      </a>
                      <a
                        className="btn btn-success multi"
                        href="javascript:;"
                        onClick={handleBatchPassClick}
                      >
                        <i className="fa fa-check"></i> 批量通过
                      </a>
                      <a
                        className="btn btn-danger multi"
                        href="javascript:;"
                        onClick={handleBatchRejectClick}
                      >
                        <i className="fa fa-times"></i> 批量拒绝
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
                      <button
                        className="btn btn-default btn-sm"
                        title="Toggle search form"
                        onClick={() => setShowSearchForm(!showSearchForm)}
                      >
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </div>

                  {/* Common Search Form */}
                  {showSearchForm && (
                    <div className="commonsearch-table">
                      <form
                        className="form-horizontal"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <div className="row">
                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                Id
                              </label>
                              <div className="col-xs-8">
                                <input
                                  type="text"
                                  className="form-control input-sm"
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
                          </div>

                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                Username
                              </label>
                              <div className="col-xs-8">
                                <input
                                  type="text"
                                  className="form-control input-sm"
                                  value={searchForm.username}
                                  onChange={(e) =>
                                    setSearchForm({
                                      ...searchForm,
                                      username: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                RealName
                              </label>
                              <div className="col-xs-8">
                                <input
                                  type="text"
                                  className="form-control input-sm"
                                  value={searchForm.real_name}
                                  onChange={(e) =>
                                    setSearchForm({
                                      ...searchForm,
                                      real_name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                IdCard
                              </label>
                              <div className="col-xs-8">
                                <input
                                  type="text"
                                  className="form-control input-sm"
                                  value={searchForm.id_card}
                                  onChange={(e) =>
                                    setSearchForm({
                                      ...searchForm,
                                      id_card: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                证件类型
                              </label>
                              <div className="col-xs-8">
                                <select
                                  className="form-control input-sm"
                                  value={searchForm.gj}
                                  onChange={(e) =>
                                    setSearchForm({
                                      ...searchForm,
                                      gj: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">全部</option>
                                  <option value="id_card">身份证</option>
                                  <option value="passport">护照</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                Status
                              </label>
                              <div className="col-xs-8">
                                <select
                                  className="form-control input-sm"
                                  value={searchForm.is_auth}
                                  onChange={(e) =>
                                    setSearchForm({
                                      ...searchForm,
                                      is_auth: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">全部</option>
                                  <option value="0">未认证</option>
                                  <option value="1">已提交</option>
                                  <option value="2">已认证</option>
                                  <option value="-1">认证失败</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-6 col-md-6">
                            <div className="form-group">
                              <div className="col-xs-12">
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={() => setCurrentPage(1)}
                                  style={{ marginRight: "8px" }}
                                >
                                  Submit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-default btn-sm"
                                  onClick={() => {
                                    setSearchForm({
                                      id: "",
                                      username: "",
                                      real_name: "",
                                      id_card: "",
                                      profession: "",
                                      gj: "",
                                      is_auth: "",
                                    });
                                    setQuickSearch("");
                                    setCurrentPage(1);
                                  }}
                                >
                                  Reset
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Table */}
                  <div className="table-responsive">
                    <table
                      id="table"
                      className="table table-striped table-bordered table-hover table-nowrap"
                      width="100%"
                    >
                      <thead>
                        <tr>
                          <th className="bs-checkbox">
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th
                            className="sortable"
                            onClick={() => {
                              setSortField("id");
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            }}
                          >
                            Id{" "}
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
                          <th>Username</th>
                          <th>RealName</th>
                          <th>IdCard</th>
                          <th>Profession</th>
                          <th>IdImg1</th>
                          <th>IdImg2</th>
                          <th>证件类型</th>
                          <th>Status</th>
                          <th>FailReason</th>
                          <th>VerifyTime</th>
                          <th className="text-center">Operate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length === 0 ? (
                          <tr>
                            <td colSpan={13} className="text-center no-records">
                              没有找到匹配的记录 (No records found)
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((item) => (
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
                              <td>
                                <strong>{item.username}</strong>
                              </td>
                              <td>{item.real_name}</td>
                              <td>{item.id_card}</td>
                              <td>{item.profession || "-"}</td>
                              {/* IdImg1 */}
                              <td>
                                {item.id_img_1 ? (
                                  <div
                                    className="img-thumb-container"
                                    onClick={() =>
                                      setPreviewImage({
                                        url: item.id_img_1,
                                        title: `${item.real_name} - 身份证正面`,
                                      })
                                    }
                                    title="点击查看大图"
                                  >
                                    <Image
                                      src={item.id_img_1}
                                      alt="身份证正面"
                                      width={60}
                                      height={40}
                                      className="img-thumb"
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <span className="text-muted">暂无图片</span>
                                )}
                              </td>
                              {/* IdImg2 */}
                              <td>
                                {item.id_img_2 ? (
                                  <div
                                    className="img-thumb-container"
                                    onClick={() =>
                                      setPreviewImage({
                                        url: item.id_img_2,
                                        title: `${item.real_name} - 身份证反面`,
                                      })
                                    }
                                    title="点击查看大图"
                                  >
                                    <Image
                                      src={item.id_img_2}
                                      alt="身份证反面"
                                      width={60}
                                      height={40}
                                      className="img-thumb"
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <span className="text-muted">暂无图片</span>
                                )}
                              </td>
                              <td>{renderIdType(item.gj)}</td>
                              <td>{renderStatus(item.is_auth)}</td>
                              <td>
                                {item.id_auth_error ? (
                                  <span className="text-danger">
                                    {item.id_auth_error}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>{item.verify_time || "-"}</td>
                              <td className="text-center">
                                <button
                                  className="btn btn-xs btn-success btn-editone"
                                  title="Edit"
                                  onClick={() => handleOpenEdit(item)}
                                  style={{ marginRight: "5px" }}
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
                      总共 {totalRows} 条记录 (Showing {totalRows > 0 ? startIndex + 1 : 0} to {endIndex} of {totalRows} rows)
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
                          <option value={25}>25</option>
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
                              className={currentPage === pageNum ? "active" : ""}
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

      {/* Edit Modal Dialog */}
      {editingItem && (
        <div className="fastadmin-modal-overlay">
          <div className="fastadmin-modal-dialog">
            <div className="fastadmin-modal-header">
              <span className="modal-title">Edit - 实名认证 #{editingItem.id}</span>
              <button
                type="button"
                className="close"
                onClick={() => setEditingItem(null)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="fastadmin-modal-body">
                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    用户名:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={editingItem.username}
                      readOnly
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    真实姓名:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.real_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, real_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    证件号码:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.id_card}
                      onChange={(e) =>
                        setEditForm({ ...editForm, id_card: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    职业:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.profession}
                      onChange={(e) =>
                        setEditForm({ ...editForm, profession: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    证件类型:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <select
                      className="form-control"
                      value={editForm.gj}
                      onChange={(e) =>
                        setEditForm({ ...editForm, gj: e.target.value })
                      }
                    >
                      <option value="id_card">身份证</option>
                      <option value="passport">护照</option>
                    </select>
                  </div>
                </div>

                {/* ID Images Preview in Edit Modal */}
                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    身份证正面:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    {editingItem.id_img_1 ? (
                      <div
                        className="modal-img-preview"
                        onClick={() =>
                          setPreviewImage({
                            url: editingItem.id_img_1,
                            title: `${editingItem.real_name} - 身份证正面`,
                          })
                        }
                      >
                        <Image
                          src={editingItem.id_img_1}
                          alt="身份证正面"
                          width={260}
                          height={160}
                          style={{
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            cursor: "pointer",
                          }}
                          unoptimized
                        />
                      </div>
                    ) : (
                      <span className="text-muted">暂无图片</span>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    身份证反面:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    {editingItem.id_img_2 ? (
                      <div
                        className="modal-img-preview"
                        onClick={() =>
                          setPreviewImage({
                            url: editingItem.id_img_2,
                            title: `${editingItem.real_name} - 身份证反面`,
                          })
                        }
                      >
                        <Image
                          src={editingItem.id_img_2}
                          alt="身份证反面"
                          width={260}
                          height={160}
                          style={{
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            cursor: "pointer",
                          }}
                          unoptimized
                        />
                      </div>
                    ) : (
                      <span className="text-muted">暂无图片</span>
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    审核状态:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <select
                      className="form-control"
                      value={editForm.is_auth}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          is_auth: Number(e.target.value),
                        })
                      }
                    >
                      <option value={0}>未认证</option>
                      <option value={1}>已提交</option>
                      <option value={2}>已认证</option>
                      <option value={-1}>认证失败</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-xs-12 col-sm-3 control-label">
                    拒绝原因:
                  </label>
                  <div className="col-xs-12 col-sm-8">
                    <textarea
                      className="form-control"
                      rows={3}
                      value={editForm.id_auth_error}
                      placeholder="如果审核不通过，请在此输入拒绝原因"
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          id_auth_error: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="fastadmin-modal-footer">
                <button type="submit" className="btn btn-success btn-embossed">
                  OK
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-embossed"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Pass Confirmation Modal */}
      {showBatchPassConfirm && (
        <div className="fastadmin-modal-overlay">
          <div
            className="fastadmin-modal-dialog"
            style={{ maxWidth: "450px" }}
          >
            <div className="fastadmin-modal-header">
              <span className="modal-title">信息 (Confirm)</span>
              <button
                type="button"
                className="close"
                onClick={() => setShowBatchPassConfirm(false)}
              >
                &times;
              </button>
            </div>
            <div className="fastadmin-modal-body" style={{ padding: "25px 20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fa fa-question-circle"
                  style={{
                    fontSize: "32px",
                    color: "#f39c12",
                    marginRight: "15px",
                  }}
                ></i>
                <span style={{ fontSize: "14px" }}>
                  确认批量通过选中的 {selectedIds.length} 条实名记录?
                </span>
              </div>
            </div>
            <div className="fastadmin-modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleConfirmBatchPass}
              >
                确定
              </button>
              <button
                type="button"
                className="btn btn-default btn-sm"
                onClick={() => setShowBatchPassConfirm(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Reject Prompt Modal */}
      {showBatchRejectModal && (
        <div className="fastadmin-modal-overlay">
          <div
            className="fastadmin-modal-dialog"
            style={{ maxWidth: "450px" }}
          >
            <div className="fastadmin-modal-header">
              <span className="modal-title">请输入拒绝原因</span>
              <button
                type="button"
                className="close"
                onClick={() => setShowBatchRejectModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="fastadmin-modal-body" style={{ padding: "20px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "13px", marginBottom: "8px" }}>
                  针对选中的 {selectedIds.length} 条记录填写的拒绝原因:
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="例如：身份证照片模糊不清晰，请重新上传"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  autoFocus
                ></textarea>
              </div>
            </div>
            <div className="fastadmin-modal-footer">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleConfirmBatchReject}
              >
                确定拒绝
              </button>
              <button
                type="button"
                className="btn btn-default btn-sm"
                onClick={() => setShowBatchRejectModal(false)}
              >
                取消
              </button>
            </div>
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
            <div className="fastadmin-modal-body" style={{ padding: "25px 20px" }}>
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

      {/* Full Size Image Preview Modal */}
      {previewImage && (
        <div
          className="fastadmin-modal-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="fastadmin-modal-dialog lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px" }}
          >
            <div className="fastadmin-modal-header">
              <span className="modal-title">{previewImage.title}</span>
              <button
                type="button"
                className="close"
                onClick={() => setPreviewImage(null)}
              >
                &times;
              </button>
            </div>
            <div
              className="fastadmin-modal-body text-center"
              style={{ padding: "15px", backgroundColor: "#1e1e1e" }}
            >
              <Image
                src={previewImage.url}
                alt={previewImage.title}
                width={650}
                height={450}
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
                unoptimized
              />
            </div>
            <div className="fastadmin-modal-footer" style={{ textAlign: "center" }}>
              <a
                href={previewImage.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-info btn-sm"
                style={{ marginRight: "10px" }}
              >
                <i className="fa fa-external-link"></i> 在新窗口打开原图
              </a>
              <button
                type="button"
                className="btn btn-default btn-sm"
                onClick={() => setPreviewImage(null)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-verify-wrapper {
          padding: 0;
        }

        .verify-ribbon {
          background: #fff;
          border-bottom: 1px solid #e7e7e7;
          padding: 8px 15px;
          min-height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .verify-ribbon ol.breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 12px;
        }

        .verify-ribbon ol.breadcrumb li {
          display: inline-block;
        }

        .verify-ribbon ol.breadcrumb li + li:before {
          content: "/ ";
          padding: 0 5px;
          color: #ccc;
        }

        .verify-ribbon a {
          color: #777;
          text-decoration: none;
        }

        .verify-ribbon a:hover {
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
          flex-wrap: wrap;
        }

        .toolbar-tools {
          display: flex;
          align-items: center;
          gap: 5px;
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

        .btn-info {
          color: #fff;
          background-color: #00c0ef;
          border-color: #00acd6;
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

        .commonsearch-table {
          background: #fbfbfb;
          border: 1px solid #e7e7e7;
          border-radius: 3px;
          padding: 15px 15px 5px 15px;
          margin-bottom: 15px;
        }

        .commonsearch-table .form-group {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }

        .commonsearch-table .control-label {
          font-size: 12px;
          color: #555;
          text-align: right;
          padding-right: 8px;
          margin-bottom: 0;
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

        .img-thumb-container {
          cursor: pointer;
          display: inline-block;
          transition: transform 0.15s;
        }

        .img-thumb-container:hover {
          transform: scale(1.05);
        }

        .img-thumb {
          width: 60px;
          height: 40px;
          object-fit: cover;
          border: 1px solid #ddd;
          border-radius: 4px;
          display: block;
        }

        .text-muted {
          color: #777;
        }

        .text-success {
          color: #00a65a;
        }

        .text-warning {
          color: #f39c12;
        }

        .text-danger {
          color: #dd4b39;
        }

        .text-gray {
          color: #bbb;
        }

        .text-yellow {
          color: #f39c12;
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

        /* Modal styling */
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
          max-width: 650px;
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

        .fastadmin-modal-header button.close:hover {
          color: #000;
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

        textarea.form-control {
          height: auto;
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
          .commonsearch-table .form-group {
            flex-direction: column;
            align-items: flex-start;
          }
          .commonsearch-table .control-label {
            text-align: left;
            margin-bottom: 4px;
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
