"use client";

import React, { useState } from "react";
import { INITIAL_ATTACHMENTS, AttachmentItem } from "./attachmentData";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

export default function AdminAttachmentContent() {
  const [attachments, setAttachments] = useState<AttachmentItem[]>(INITIAL_ATTACHMENTS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Commonsearch (Advanced Filter)
  const [isCommonSearchOpen, setIsCommonSearchOpen] = useState(false);
  const [commonSearch, setCommonSearch] = useState({
    id: "",
    url: "",
    mimetype: "",
    storage: "",
    imagetype: "",
  });

  // Column visibility
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    preview: true,
    url: true,
    imagewidth: true,
    imageheight: true,
    imagetype: true,
    storage: true,
    filesize: true,
    mimetype: true,
    createtime: true,
    operate: true,
  });

  // Modal dialog state (Add / Edit)
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<AttachmentItem | null>(null);
  const [formState, setFormState] = useState({
    url: "",
    imagewidth: "",
    imageheight: "",
    imagetype: "png",
    imageframes: 0,
    filesize: 0,
    mimetype: "image/png",
    extparam: '{"name": "new_file.png"}',
    uploadtime: "",
    storage: "local",
    editor: "",
    local: "",
  });

  // Delete confirmation modal
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<number[] | null>(null);

  // Lightbox preview image
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered rows
  const filteredAttachments = attachments.filter((item) => {
    // Quick search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        String(item.id).includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.mimetype.toLowerCase().includes(q) ||
        item.imagetype.toLowerCase().includes(q) ||
        item.storage.toLowerCase().includes(q);
      if (!matchQ) return false;
    }

    // Commonsearch filters
    if (commonSearch.id && !String(item.id).includes(commonSearch.id.trim())) {
      return false;
    }
    if (
      commonSearch.url &&
      !item.url.toLowerCase().includes(commonSearch.url.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      commonSearch.mimetype &&
      !item.mimetype.toLowerCase().includes(commonSearch.mimetype.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      commonSearch.storage &&
      !item.storage.toLowerCase().includes(commonSearch.storage.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      commonSearch.imagetype &&
      !item.imagetype.toLowerCase().includes(commonSearch.imagetype.trim().toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Pagination calculation
  const totalItems = filteredAttachments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentRows = filteredAttachments.slice(startIndex, startIndex + pageSize);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(currentRows.map((c) => c.id));
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
      url: "",
      imagewidth: "500",
      imageheight: "500",
      imagetype: "png",
      imageframes: 0,
      filesize: 10240,
      mimetype: "image/png",
      extparam: '{"name":"upload_file.png"}',
      uploadtime: formatDateTime(Math.floor(Date.now() / 1000)),
      storage: "local",
      editor: "",
      local: "",
    });
    setModalMode("add");
  };

  // Open Edit modal
  const handleOpenEdit = (item?: AttachmentItem) => {
    const target =
      item || attachments.find((c) => c.id === selectedIds[0]);
    if (!target) return;
    setEditingItem(target);
    setFormState({
      url: target.url,
      imagewidth: target.imagewidth,
      imageheight: target.imageheight,
      imagetype: target.imagetype,
      imageframes: target.imageframes,
      filesize: target.filesize,
      mimetype: target.mimetype,
      extparam: target.extparam || "",
      uploadtime: formatDateTime(target.uploadtime || target.createtime),
      storage: target.storage,
      editor: "",
      local: "",
    });
    setModalMode("edit");
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "add") {
      const newId = Math.max(...attachments.map((c) => c.id), 0) + 1;
      const uploadedUrl =
        formState.local || formState.url || `/uploads/20260227/sample_${newId}.png`;
      const newItem: AttachmentItem = {
        id: newId,
        admin_id: 1,
        user_id: "0",
        url: uploadedUrl,
        imagewidth: formState.imagewidth || "500",
        imageheight: formState.imageheight || "500",
        imagetype: formState.imagetype || "png",
        imageframes: 0,
        filesize: Number(formState.filesize) || 12400,
        mimetype: formState.mimetype || "image/png",
        extparam: formState.extparam || '{"name":"uploaded.png"}',
        createtime: Math.floor(Date.now() / 1000),
        updatetime: Math.floor(Date.now() / 1000),
        uploadtime: Math.floor(Date.now() / 1000),
        storage: formState.storage || "local",
        sha1: "abc" + Math.random().toString(16).substring(2, 10),
        fullurl: uploadedUrl,
      };
      setAttachments([newItem, ...attachments]);
      showToast("上传成功 (Uploaded successfully)");
    } else if (modalMode === "edit" && editingItem) {
      setAttachments((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                url: formState.url,
                imagewidth: formState.imagewidth,
                imageheight: formState.imageheight,
                imagetype: formState.imagetype,
                imageframes: Number(formState.imageframes) || 0,
                filesize: Number(formState.filesize) || 0,
                mimetype: formState.mimetype,
                extparam: formState.extparam,
                storage: formState.storage,
                updatetime: Math.floor(Date.now() / 1000),
                fullurl: formState.url,
              }
            : c
        )
      );
      showToast("修改成功 (Updated successfully)");
    }

    setModalMode(null);
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    setAttachments((prev) => prev.filter((c) => !deleteConfirmIds.includes(c.id)));
    setSelectedIds((prev) => prev.filter((id) => !deleteConfirmIds.includes(id)));
    setDeleteConfirmIds(null);
    showToast("删除成功 (Deleted successfully)");
  };

  const isAllCurrentSelected =
    currentRows.length > 0 &&
    currentRows.every((c) => selectedIds.includes(c.id));

  return (
    <div className="admin-attachment-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fastadmin-toast">
          <i className="fa fa-check-circle"></i> {toastMessage}
        </div>
      )}

      {/* Ribbon Breadcrumb Header */}
      <div id="ribbon" className="attachment-ribbon">
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
              系统设置
            </a>
          </li>
          <li>
            <a href="javascript:;" onClick={(e) => e.preventDefault()}>
              Attachment
            </a>
          </li>
        </ol>
      </div>

      {/* Main Content Area */}
      <div className="content">
        <div className="panel panel-default panel-intro">
          {/* Panel Heading with Lead */}
          <div className="panel-heading">
            <div className="panel-lead">
              <em>Attachment</em>Attachment tips
            </div>
          </div>

          {/* Panel Body */}
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
                          selectedIds.length !== 1
                            ? "btn-disabled disabled"
                            : ""
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
                          selectedIds.length === 0
                            ? "btn-disabled disabled"
                            : ""
                        }`}
                        title="Delete"
                        onClick={() =>
                          selectedIds.length > 0 &&
                          setDeleteConfirmIds([...selectedIds])
                        }
                      >
                        <i className="fa fa-trash"></i> Delete
                      </a>

                      <a
                        href="javascript:;"
                        className="btn btn-info btn-import"
                        title="Import"
                        onClick={() => {
                          showToast("Import 功能已就绪 (Import ready)");
                        }}
                      >
                        <i className="fa fa-upload"></i> Import
                      </a>
                    </div>

                    {/* Right Tools: Search, Advanced Filter, Column Toggle */}
                    <div className="toolbar-right">
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control input-sm search-input"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        className={`btn btn-default btn-sm ${
                          isCommonSearchOpen ? "active" : ""
                        }`}
                        title="Common search"
                        onClick={() => setIsCommonSearchOpen(!isCommonSearchOpen)}
                      >
                        <i className="fa fa-search"></i>
                      </button>

                      {/* Columns Visibility Dropdown */}
                      <div className="dropdown columns-dropdown">
                        <button
                          type="button"
                          className="btn btn-default btn-sm dropdown-toggle"
                          title="Columns"
                          onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                        >
                          <i className="fa fa-th"></i>{" "}
                          <span className="caret"></span>
                        </button>

                        {showColumnsMenu && (
                          <ul className="dropdown-menu dropdown-menu-right show-dropdown">
                            {Object.keys(visibleColumns).map((colKey) => (
                              <li key={colKey}>
                                <label className="column-label">
                                  <input
                                    type="checkbox"
                                    checked={
                                      visibleColumns[
                                        colKey as keyof typeof visibleColumns
                                      ]
                                    }
                                    onChange={(e) =>
                                      setVisibleColumns({
                                        ...visibleColumns,
                                        [colKey]: e.target.checked,
                                      })
                                    }
                                  />{" "}
                                  {colKey.toUpperCase()}
                                </label>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Common Search Bar (Advanced Filter) */}
                  {isCommonSearchOpen && (
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
                                  className="form-control"
                                  placeholder="Id"
                                  value={commonSearch.id}
                                  onChange={(e) => {
                                    setCommonSearch({
                                      ...commonSearch,
                                      id: e.target.value,
                                    });
                                    setCurrentPage(1);
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                Url
                              </label>
                              <div className="col-xs-8">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Url"
                                  value={commonSearch.url}
                                  onChange={(e) => {
                                    setCommonSearch({
                                      ...commonSearch,
                                      url: e.target.value,
                                    });
                                    setCurrentPage(1);
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                Type
                              </label>
                              <div className="col-xs-8">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="png, jpg..."
                                  value={commonSearch.imagetype}
                                  onChange={(e) => {
                                    setCommonSearch({
                                      ...commonSearch,
                                      imagetype: e.target.value,
                                    });
                                    setCurrentPage(1);
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-6 col-md-3">
                            <div className="form-group">
                              <label className="control-label col-xs-4">
                                Storage
                              </label>
                              <div className="col-xs-8">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="local..."
                                  value={commonSearch.storage}
                                  onChange={(e) => {
                                    setCommonSearch({
                                      ...commonSearch,
                                      storage: e.target.value,
                                    });
                                    setCurrentPage(1);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row text-right common-search-actions">
                          <button
                            type="button"
                            className="btn btn-default btn-sm"
                            onClick={() => {
                              setCommonSearch({
                                id: "",
                                url: "",
                                mimetype: "",
                                storage: "",
                                imagetype: "",
                              });
                              setSearchQuery("");
                              setCurrentPage(1);
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Bootstrap Table */}
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                      <thead>
                        <tr>
                          <th
                            className="bs-checkbox text-center"
                            style={{ width: 36 }}
                          >
                            <input
                              type="checkbox"
                              checked={isAllCurrentSelected}
                              onChange={handleSelectAll}
                            />
                          </th>
                          {visibleColumns.id && (
                            <th style={{ width: 60 }} className="text-center">
                              <div className="th-inner">Id</div>
                            </th>
                          )}
                          {visibleColumns.preview && (
                            <th style={{ width: 110 }} className="text-center">
                              <div className="th-inner">Preview</div>
                            </th>
                          )}
                          {visibleColumns.url && (
                            <th className="text-left">
                              <div className="th-inner">Url</div>
                            </th>
                          )}
                          {visibleColumns.imagewidth && (
                            <th style={{ width: 85 }} className="text-center">
                              <div className="th-inner">Imagewidth</div>
                            </th>
                          )}
                          {visibleColumns.imageheight && (
                            <th style={{ width: 85 }} className="text-center">
                              <div className="th-inner">Imageheight</div>
                            </th>
                          )}
                          {visibleColumns.imagetype && (
                            <th style={{ width: 80 }} className="text-center">
                              <div className="th-inner">Imagetype</div>
                            </th>
                          )}
                          {visibleColumns.storage && (
                            <th style={{ width: 75 }} className="text-center">
                              <div className="th-inner">Storage</div>
                            </th>
                          )}
                          {visibleColumns.filesize && (
                            <th style={{ width: 95 }} className="text-center">
                              <div className="th-inner">Filesize</div>
                            </th>
                          )}
                          {visibleColumns.mimetype && (
                            <th style={{ width: 110 }} className="text-center">
                              <div className="th-inner">Mimetype</div>
                            </th>
                          )}
                          {visibleColumns.createtime && (
                            <th style={{ width: 150 }} className="text-center">
                              <div className="th-inner">Createtime</div>
                            </th>
                          )}
                          {visibleColumns.operate && (
                            <th style={{ width: 90 }} className="text-center">
                              <div className="th-inner">Operate</div>
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="text-center no-records">
                              没有找到匹配的记录 (No matching records found)
                            </td>
                          </tr>
                        ) : (
                          currentRows.map((row) => (
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
                              {visibleColumns.id && (
                                <td className="text-center">{row.id}</td>
                              )}
                              {visibleColumns.preview && (
                                <td className="text-center">
                                  {row.mimetype.includes("image") ? (
                                    <div
                                      className="attachment-thumb-box"
                                      onClick={() =>
                                        setPreviewImage(row.fullurl || row.url)
                                      }
                                      title="Click to preview"
                                    >
                                      <img
                                        src={row.fullurl || row.url}
                                        alt=""
                                        className="attachment-thumb"
                                      />
                                    </div>
                                  ) : (
                                    <span className="label label-default">
                                      {row.imagetype || "file"}
                                    </span>
                                  )}
                                </td>
                              )}
                              {visibleColumns.url && (
                                <td className="text-left">
                                  <a
                                    href={row.fullurl || row.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="label bg-green url-label"
                                    title={row.url}
                                  >
                                    {row.url}
                                  </a>
                                </td>
                              )}
                              {visibleColumns.imagewidth && (
                                <td className="text-center">
                                  {row.imagewidth || "-"}
                                </td>
                              )}
                              {visibleColumns.imageheight && (
                                <td className="text-center">
                                  {row.imageheight || "-"}
                                </td>
                              )}
                              {visibleColumns.imagetype && (
                                <td className="text-center">
                                  <span className="label label-info">
                                    {row.imagetype}
                                  </span>
                                </td>
                              )}
                              {visibleColumns.storage && (
                                <td className="text-center">
                                  <span className="label label-primary">
                                    {row.storage}
                                  </span>
                                </td>
                              )}
                              {visibleColumns.filesize && (
                                <td className="text-center">
                                  {formatFileSize(row.filesize)}
                                </td>
                              )}
                              {visibleColumns.mimetype && (
                                <td className="text-center text-muted font-mono">
                                  {row.mimetype}
                                </td>
                              )}
                              {visibleColumns.createtime && (
                                <td className="text-center">
                                  {formatDateTime(row.createtime)}
                                </td>
                              )}
                              {visibleColumns.operate && (
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
                                      onClick={() =>
                                        setDeleteConfirmIds([row.id])
                                      }
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              )}
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
                        总共 <b>{totalItems}</b> 条记录 (Showing{" "}
                        {totalItems > 0 ? startIndex + 1 : 0} to{" "}
                        {Math.min(startIndex + pageSize, totalItems)} of{" "}
                        {totalItems} rows)
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
                              currentPage > 1 && setCurrentPage(currentPage - 1)
                            }
                          >
                            &laquo;
                          </a>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
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
                          )
                        )}
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

      {/* Add Modal Dialog */}
      {modalMode === "add" && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom modal-attachment-add">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => setModalMode(null)}
                >
                  &times;
                </button>
                <h4 className="modal-title">Add</h4>
              </div>
              <form
                className="form-horizontal"
                onSubmit={handleSaveForm}
                autoComplete="off"
              >
                <div className="modal-body">
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Upload:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Path or file name"
                        value={formState.local}
                        onChange={(e) =>
                          setFormState({ ...formState, local: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2"></label>
                    <div className="col-xs-12 col-sm-8">
                      <button
                        type="button"
                        className="btn btn-primary plupload"
                        onClick={() => {
                          const sample =
                            "/uploads/20251103/6ac533157fb3f3367859793cf2bbabf0.png";
                          setFormState({
                            ...formState,
                            local: sample,
                            url: sample,
                          });
                          showToast("已选择本地文件 (File selected)");
                        }}
                      >
                        <i className="fa fa-upload"></i> Upload to local
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Upload from editor:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <textarea
                        cols={60}
                        rows={4}
                        className="form-control editor"
                        value={formState.editor}
                        onChange={(e) =>
                          setFormState({ ...formState, editor: e.target.value })
                        }
                        placeholder="Paste image or HTML here"
                      ></textarea>
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

      {/* Edit Modal Dialog */}
      {modalMode === "edit" && editingItem && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom modal-attachment-edit">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => setModalMode(null)}
                >
                  &times;
                </button>
                <h4 className="modal-title">Edit</h4>
              </div>
              <form
                className="form-horizontal"
                onSubmit={handleSaveForm}
                autoComplete="off"
              >
                <div className="modal-body">
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Url:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formState.url}
                        onChange={(e) =>
                          setFormState({ ...formState, url: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Imagewidth:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formState.imagewidth}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            imagewidth: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Imageheight:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formState.imageheight}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            imageheight: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Imagetype:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formState.imagetype}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            imagetype: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Imageframes:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="number"
                        className="form-control"
                        value={formState.imageframes}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            imageframes: parseInt(e.target.value, 10) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Filesize:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="number"
                        className="form-control"
                        value={formState.filesize}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            filesize: parseInt(e.target.value, 10) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Mimetype:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.mimetype}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            mimetype: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Extparam:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.extparam}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            extparam: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Uploadtime:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.uploadtime}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            uploadtime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Storage:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.storage}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            storage: e.target.value,
                          })
                        }
                      />
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

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div
          className="modal-backdrop-custom lightbox-backdrop"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setPreviewImage(null)}
            >
              &times;
            </button>
            <img
              src={previewImage}
              alt="Attachment Preview"
              className="lightbox-img"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-attachment-wrapper {
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
        .attachment-ribbon {
          background: #ffffff;
          border-bottom: 1px solid #e7eaec;
          padding: 11px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .attachment-ribbon .breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 12px;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .attachment-ribbon .breadcrumb > li + li:before {
          content: "/";
          padding: 0 5px;
          color: #ccc;
        }

        .attachment-ribbon .breadcrumb a {
          color: #777;
          text-decoration: none;
        }

        .attachment-ribbon .breadcrumb a:hover {
          color: #333;
        }

        /* Content Container */
        .content {
          padding: 15px;
        }

        /* Panel Intro */
        .panel-intro {
          border-radius: 3px;
          border: 1px solid #e7eaec;
          background: #fff;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .panel-heading {
          padding: 15px;
          border-bottom: 1px solid #e7eaec;
          background: #fbfbfb;
        }

        .panel-lead {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        .panel-lead em {
          font-style: normal;
          font-weight: bold;
          margin-right: 8px;
        }

        /* Panel Body */
        .panel-body {
          padding: 15px;
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

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .search-box {
          position: relative;
        }

        .search-input {
          width: 170px;
          height: 30px;
          padding: 5px 10px;
          font-size: 12px;
          border: 1px solid #ccc;
          border-radius: 3px;
        }

        .btn {
          display: inline-block;
          margin-bottom: 0;
          font-weight: 400;
          text-align: center;
          vertical-align: middle;
          touch-action: manipulation;
          cursor: pointer;
          background-image: none;
          border: 1px solid transparent;
          white-space: nowrap;
          padding: 6px 12px;
          font-size: 12px;
          line-height: 1.42857143;
          border-radius: 3px;
          user-select: none;
          text-decoration: none;
          transition: all 0.15s ease-in-out;
        }

        .btn-sm {
          padding: 5px 10px;
          font-size: 12px;
          line-height: 1.5;
          border-radius: 3px;
        }

        .btn-primary {
          color: #fff;
          background-color: #18bc9c;
          border-color: #18bc9c;
        }

        .btn-primary:hover {
          background-color: #15a589;
          border-color: #15a589;
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

        .btn-danger {
          color: #fff;
          background-color: #e74c3c;
          border-color: #e74c3c;
        }

        .btn-danger:hover {
          background-color: #d62c1a;
          border-color: #d62c1a;
        }

        .btn-info {
          color: #fff;
          background-color: #3498db;
          border-color: #3498db;
        }

        .btn-info:hover {
          background-color: #258cd1;
          border-color: #258cd1;
        }

        .btn-default {
          color: #333;
          background-color: #fff;
          border-color: #ccc;
        }

        .btn-default:hover,
        .btn-default.active {
          background-color: #e6e6e6;
          border-color: #adadad;
        }

        .btn-disabled,
        .btn.disabled {
          cursor: not-allowed;
          filter: alpha(opacity=65);
          opacity: 0.65;
          box-shadow: none;
          pointer-events: none;
        }

        /* Dropdown */
        .dropdown {
          position: relative;
          display: inline-block;
        }

        .caret {
          display: inline-block;
          width: 0;
          height: 0;
          margin-left: 2px;
          vertical-align: middle;
          border-top: 4px dashed;
          border-right: 4px solid transparent;
          border-left: 4px solid transparent;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          min-width: 160px;
          padding: 5px 0;
          margin: 2px 0 0;
          list-style: none;
          font-size: 13px;
          text-align: left;
          background-color: #fff;
          border: 1px solid #ccc;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        }

        .dropdown-menu-right {
          right: 0;
          left: auto;
        }

        .column-label {
          display: block;
          padding: 4px 15px;
          margin: 0;
          font-weight: normal;
          cursor: pointer;
          white-space: nowrap;
          font-size: 12px;
        }

        .column-label:hover {
          background-color: #f5f5f5;
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

        .common-search-actions {
          padding-right: 15px;
          padding-bottom: 8px;
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
          border-spacing: 0;
          font-size: 13px;
        }

        .table-bordered {
          border: 1px solid #e7eaec;
        }

        .table-bordered > thead > tr > th,
        .table-bordered > tbody > tr > th,
        .table-bordered > tfoot > tr > th,
        .table-bordered > thead > tr > td,
        .table-bordered > tbody > tr > td,
        .table-bordered > tfoot > tr > td {
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

        /* Thumbnails */
        .attachment-thumb-box {
          display: inline-block;
          cursor: pointer;
          border: 1px solid #eee;
          padding: 2px;
          border-radius: 3px;
          background: #fff;
          transition: transform 0.15s ease;
        }

        .attachment-thumb-box:hover {
          transform: scale(1.06);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .attachment-thumb {
          max-height: 40px;
          max-width: 70px;
          object-fit: contain;
          display: block;
        }

        .url-label {
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

        .label-primary {
          background-color: #18bc9c;
        }

        .label-default {
          background-color: #777;
        }

        .font-mono {
          font-family: monospace;
          font-size: 11px;
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

        /* Custom Modal Dialogs */
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
          max-width: 680px;
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
          line-height: 1.42857143;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .close {
          border: none;
          background: transparent;
          font-size: 21px;
          font-weight: 700;
          line-height: 1;
          color: #000;
          opacity: 0.2;
          cursor: pointer;
        }

        .close:hover {
          opacity: 0.5;
        }

        .modal-body {
          position: relative;
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

        .btn-embossed {
          box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.15);
          padding: 7px 20px;
          font-size: 13px;
          font-weight: 600;
          margin-right: 8px;
        }

        /* Lightbox Image Preview */
        .lightbox-backdrop {
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 1060;
        }

        .lightbox-container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 85vh;
          border-radius: 4px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
        }

        .lightbox-close {
          position: absolute;
          top: -35px;
          right: 0;
          color: #fff;
          font-size: 32px;
          background: transparent;
          border: none;
          cursor: pointer;
          line-height: 1;
        }

        .lightbox-close:hover {
          color: #18bc9c;
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
          .attachment-ribbon {
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
