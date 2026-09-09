"use client";

import React, { useState, useEffect } from "react";
import { getR2Url } from "@/lib/r2";
import { contentApi } from "@/lib/api";

export interface CategoryItem {
  id: number;
  pid: number;
  type: string; // 'banner'
  name: string;
  nickname: string;
  flag: string; // '', 'hot', 'index', 'recommend'
  image: string;
  keywords: string;
  description: string;
  diyname: string;
  createtime: number;
  updatetime: number;
  weigh: number;
  status: "normal" | "hidden";
  type_text: string;
  flag_text: string;
  spacer?: string;
  haschild?: number;
}

const RAW_CATEGORIES: CategoryItem[] = [
  {
    id: 11,
    pid: 0,
    type: "banner",
    name: " 6",
    nickname: "",
    flag: "",
    image: "/uploads/20250817/da2366df80bfc80ff3cb5d923373aa1f.jpg",
    keywords: "",
    description: "",
    diyname: "",
    createtime: 1755414051,
    updatetime: 1759129692,
    weigh: 11,
    status: "normal",
    type_text: "轮播图",
    flag_text: "",
    spacer: "",
    haschild: 0,
  },
  {
    id: 10,
    pid: 0,
    type: "banner",
    name: " 5",
    nickname: "",
    flag: "",
    image: "/uploads/20251210/7d1a6e22287f5cfe705e5eaad36a0e06.jpg",
    keywords: "",
    description: "",
    diyname: "",
    createtime: 1755193038,
    updatetime: 1765305359,
    weigh: 10,
    status: "normal",
    type_text: "轮播图",
    flag_text: "",
    spacer: "",
    haschild: 0,
  },
  {
    id: 6,
    pid: 0,
    type: "banner",
    name: " 4",
    nickname: "",
    flag: "",
    image: "/uploads/20251210/4c39d1b800b5752e0a605f6d3afc570e.jpg",
    keywords: "",
    description: "",
    diyname: "",
    createtime: 1752461830,
    updatetime: 1765305351,
    weigh: 6,
    status: "normal",
    type_text: "轮播图",
    flag_text: "",
    spacer: "",
    haschild: 0,
  },
  {
    id: 5,
    pid: 0,
    type: "banner",
    name: " 3",
    nickname: "",
    flag: "",
    image: "/uploads/20251210/08eb6192fb91135fd27da0022175af7a.jpg",
    keywords: "",
    description: "",
    diyname: "",
    createtime: 1752461817,
    updatetime: 1765305336,
    weigh: 5,
    status: "normal",
    type_text: "轮播图",
    flag_text: "",
    spacer: "",
    haschild: 0,
  },
  {
    id: 4,
    pid: 0,
    type: "banner",
    name: " 2",
    nickname: "",
    flag: "",
    image: "/uploads/20251210/777d251a0c52a4e2f4fe5f35d7e69434.jpg",
    keywords: "",
    description: "",
    diyname: "",
    createtime: 1745644802,
    updatetime: 1765305331,
    weigh: 4,
    status: "normal",
    type_text: "轮播图",
    flag_text: "",
    spacer: "",
    haschild: 0,
  },
  {
    id: 3,
    pid: 0,
    type: "banner",
    name: " 1",
    nickname: "",
    flag: "",
    image: "/uploads/20251210/8a7d4cc4edbf1cdb3930b5ff016135f0.jpg",
    keywords: "",
    description: "",
    diyname: "",
    createtime: 1745644787,
    updatetime: 1765305323,
    weigh: 3,
    status: "normal",
    type_text: "轮播图",
    flag_text: "",
    spacer: "",
    haschild: 0,
  },
];

const INITIAL_CATEGORIES: CategoryItem[] = RAW_CATEGORIES.map((item) => ({
  ...item,
  image: getR2Url(item.image),
}));

export default function AdminCategoryContent() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "banner">("all");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBanners = async () => {
    try {
      setIsRefreshing(true);
      const res = await contentApi.getBanners();
      if (res && res.code === 1 && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: CategoryItem[] = res.data.map((item: any) => ({
          id: item.id,
          pid: item.pid || 0,
          type: item.type || 'banner',
          name: item.name || '',
          nickname: '',
          flag: item.flag || '',
          image: getR2Url(item.image),
          keywords: item.keywords || '',
          description: item.description || '',
          diyname: '',
          createtime: item.created_at ? Math.floor(new Date(item.created_at).getTime() / 1000) : 0,
          updatetime: item.updated_at ? Math.floor(new Date(item.updated_at).getTime() / 1000) : 0,
          weigh: item.weigh || 0,
          status: item.status || 'normal',
          type_text: '轮播图',
          flag_text: '',
          spacer: '',
          haschild: 0,
        }));
        setCategories(mapped);
      }
    } catch {
      // Giữ INITIAL_CATEGORIES nếu offline
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Modal dialog state (Add / Edit)
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [formState, setFormState] = useState({
    type: "banner",
    pid: "0",
    name: "",
    flag: [] as string[],
    image: "",
    keywords: "",
    description: "",
    weigh: 0,
    status: "normal" as "normal" | "hidden",
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
  const filteredCategories = categories.filter((cat) => {
    if (activeTab === "banner") {
      return cat.type === "banner";
    }
    return true;
  });

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCategories.map((c) => c.id));
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
      type: "banner",
      pid: "0",
      name: "",
      flag: [],
      image: "",
      keywords: "",
      description: "",
      weigh: 0,
      status: "normal",
    });
    setModalMode("add");
  };

  // Open Edit modal
  const handleOpenEdit = (item?: CategoryItem) => {
    const target =
      item || categories.find((c) => c.id === selectedIds[0]);
    if (!target) return;
    setEditingItem(target);
    setFormState({
      type: target.type,
      pid: String(target.pid),
      name: target.name.trim(),
      flag: target.flag ? target.flag.split(",") : [],
      image: target.image,
      keywords: target.keywords,
      description: target.description,
      weigh: target.weigh,
      status: target.status,
    });
    setModalMode("edit");
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    if (modalMode === "add") {
      const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
      const newItem: CategoryItem = {
        id: newId,
        pid: parseInt(formState.pid, 10) || 0,
        type: formState.type,
        name: ` ${formState.name}`,
        nickname: "",
        flag: formState.flag.join(","),
        image: formState.image || "/uploads/20251210/8a7d4cc4edbf1cdb3930b5ff016135f0.jpg",
        keywords: formState.keywords,
        description: formState.description,
        diyname: "",
        createtime: Math.floor(Date.now() / 1000),
        updatetime: Math.floor(Date.now() / 1000),
        weigh: Number(formState.weigh) || 0,
        status: formState.status,
        type_text: formState.type === "banner" ? "轮播图" : formState.type,
        flag_text: formState.flag.join(","),
      };
      setCategories([newItem, ...categories]);
      showToast("添加成功 (Added successfully)");
    } else if (modalMode === "edit" && editingItem) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                type: formState.type,
                pid: parseInt(formState.pid, 10) || 0,
                name: ` ${formState.name}`,
                flag: formState.flag.join(","),
                image: formState.image,
                keywords: formState.keywords,
                description: formState.description,
                weigh: Number(formState.weigh) || 0,
                status: formState.status,
                type_text: formState.type === "banner" ? "轮播图" : formState.type,
                updatetime: Math.floor(Date.now() / 1000),
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
    setCategories((prev) => prev.filter((c) => !deleteConfirmIds.includes(c.id)));
    setSelectedIds((prev) => prev.filter((id) => !deleteConfirmIds.includes(id)));
    setDeleteConfirmIds(null);
    showToast("删除成功 (Deleted successfully)");
  };

  // Status toggle from table
  const handleToggleStatus = (id: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "normal" ? "hidden" : "normal",
              updatetime: Math.floor(Date.now() / 1000),
            }
          : c
      )
    );
    showToast("状态已更新 (Status updated)");
  };

  // Batch status change
  const handleBatchStatus = (status: "normal" | "hidden") => {
    if (selectedIds.length === 0) return;
    setCategories((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status } : c
      )
    );
    setIsMoreOpen(false);
    showToast(`已批量更新为 ${status === "normal" ? "Normal" : "Hidden"}`);
  };

  const isAllSelected =
    filteredCategories.length > 0 &&
    filteredCategories.every((c) => selectedIds.includes(c.id));

  return (
    <div className="admin-category-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fastadmin-toast">
          <i className="fa fa-check-circle"></i> {toastMessage}
        </div>
      )}

      {/* Ribbon Breadcrumb Header */}
      <div id="ribbon" className="category-ribbon">
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
              图文管理
            </a>
          </li>
        </ol>
      </div>

      {/* Main Content Area */}
      <div className="content">
        <div className="panel panel-default panel-intro">
          {/* Panel Heading with Lead & Tabs */}
          <div className="panel-heading">
            <div className="panel-lead">
              <em>图文管理</em>Category tips
            </div>
            <ul className="nav nav-tabs">
              <li className={activeTab === "all" ? "active" : ""}>
                <a
                  href="#all"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("all");
                  }}
                >
                  All
                </a>
              </li>
              <li className={activeTab === "banner" ? "active" : ""}>
                <a
                  href="#banner"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("banner");
                  }}
                >
                  轮播图
                </a>
              </li>
            </ul>
          </div>

          {/* Panel Body */}
          <div className="panel-body">
            <div className="tab-content">
              <div className="tab-pane active in">
                <div className="widget-body no-padding">
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
                        setDeleteConfirmIds([...selectedIds])
                      }
                    >
                      <i className="fa fa-trash"></i> Delete
                    </a>

                    {/* More Dropdown */}
                    <div className="dropdown btn-group">
                      <button
                        type="button"
                        className={`btn btn-primary btn-more dropdown-toggle ${
                          selectedIds.length === 0 ? "btn-disabled disabled" : ""
                        }`}
                        onClick={() =>
                          selectedIds.length > 0 && setIsMoreOpen(!isMoreOpen)
                        }
                      >
                        <i className="fa fa-cog"></i> More{" "}
                        <span className="caret"></span>
                      </button>

                      {isMoreOpen && selectedIds.length > 0 && (
                        <ul className="dropdown-menu text-left show-dropdown">
                          <li>
                            <a
                              className="btn btn-link btn-multi"
                              href="javascript:;"
                              onClick={() => handleBatchStatus("normal")}
                            >
                              <i className="fa fa-eye"></i> Set to normal
                            </a>
                          </li>
                          <li>
                            <a
                              className="btn btn-link btn-multi"
                              href="javascript:;"
                              onClick={() => handleBatchStatus("hidden")}
                            >
                              <i className="fa fa-eye-slash"></i> Set to hidden
                            </a>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Bootstrap Table */}
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                      <thead>
                        <tr>
                          <th className="bs-checkbox text-center" style={{ width: 36 }}>
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th style={{ width: 60 }} className="text-center">
                            <div className="th-inner">Id</div>
                          </th>
                          <th style={{ width: 100 }} className="text-center">
                            <div className="th-inner">Type</div>
                          </th>
                          <th className="text-left">
                            <div className="th-inner">Name</div>
                          </th>
                          <th style={{ width: 80 }} className="text-center">
                            <div className="th-inner">Flag</div>
                          </th>
                          <th style={{ width: 140 }} className="text-center">
                            <div className="th-inner">Image</div>
                          </th>
                          <th style={{ width: 70 }} className="text-center">
                            <div className="th-inner">Weigh</div>
                          </th>
                          <th style={{ width: 100 }} className="text-center">
                            <div className="th-inner">Status</div>
                          </th>
                          <th style={{ width: 100 }} className="text-center">
                            <div className="th-inner">Operate</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="text-center no-records">
                              没有找到匹配的记录 (No matching records found)
                            </td>
                          </tr>
                        ) : (
                          filteredCategories.map((row) => (
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
                              <td className="text-center">
                                <span className="label label-info">
                                  {row.type_text || "轮播图"}
                                </span>
                              </td>
                              <td className="text-left font-semibold">
                                {row.name}
                              </td>
                              <td className="text-center">
                                {row.flag ? (
                                  <span className="label label-primary">
                                    {row.flag}
                                  </span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td className="text-center">
                                {row.image ? (
                                  <div
                                    className="image-thumb-wrapper"
                                    onClick={() => setPreviewImage(row.image)}
                                    title="Click to preview"
                                  >
                                    <img
                                      src={row.image}
                                      alt={row.name}
                                      className="img-sm img-center category-thumb"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td className="text-center">{row.weigh}</td>
                              <td className="text-center">
                                <span
                                  className={`status-btn ${
                                    row.status === "normal"
                                      ? "text-success"
                                      : "text-muted"
                                  }`}
                                  onClick={() => handleToggleStatus(row.id)}
                                  title="Click to toggle status"
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="fa fa-circle"></i>{" "}
                                  {row.status === "normal" ? "Normal" : "Hidden"}
                                </span>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Category Modal Dialog */}
      {modalMode && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom modal-category-custom">
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
                  {/* Category warmtips */}
                  <div className="alert alert-warning-light">
                    Category warmtips
                  </div>

                  {/* Type */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Type:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <select
                        className="form-control"
                        value={formState.type}
                        onChange={(e) =>
                          setFormState({ ...formState, type: e.target.value })
                        }
                      >
                        <option value="banner">轮播图</option>
                      </select>
                    </div>
                  </div>

                  {/* Pid */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Pid:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <select
                        className="form-control"
                        value={formState.pid}
                        onChange={(e) =>
                          setFormState({ ...formState, pid: e.target.value })
                        }
                      >
                        <option value="0">None</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Name:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        placeholder="Name"
                      />
                    </div>
                  </div>

                  {/* Flag */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Flag:
                    </label>
                    <div className="col-xs-12 col-sm-8 flag-checkboxes">
                      {["hot", "index", "recommend"].map((fl) => (
                        <label key={fl} className="checkbox-inline">
                          <input
                            type="checkbox"
                            checked={formState.flag.includes(fl)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormState({
                                  ...formState,
                                  flag: [...formState.flag, fl],
                                });
                              } else {
                                setFormState({
                                  ...formState,
                                  flag: formState.flag.filter((f) => f !== fl),
                                });
                              }
                            }}
                          />{" "}
                          {fl.charAt(0).toUpperCase() + fl.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Image:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={formState.image}
                          onChange={(e) =>
                            setFormState({ ...formState, image: e.target.value })
                          }
                          placeholder="/uploads/..."
                        />
                        <div className="input-group-addon no-border no-padding">
                          <span>
                            <button
                              type="button"
                              className="btn btn-danger plupload"
                              onClick={() => {
                                const sample =
                                  "/uploads/20251210/7d1a6e22287f5cfe705e5eaad36a0e06.jpg";
                                setFormState({ ...formState, image: sample });
                                showToast("已选择示例图片 (Sample uploaded)");
                              }}
                            >
                              <i className="fa fa-upload"></i> Upload
                            </button>
                          </span>
                          <span>
                            <button
                              type="button"
                              className="btn btn-primary fachoose"
                              onClick={() => {
                                const sample =
                                  "/uploads/20250817/da2366df80bfc80ff3cb5d923373aa1f.jpg";
                                setFormState({ ...formState, image: sample });
                                showToast("已选择图片 (Image chosen)");
                              }}
                            >
                              <i className="fa fa-list"></i> Choose
                            </button>
                          </span>
                        </div>
                      </div>
                      {formState.image && (
                        <div className="image-preview-box">
                          <img
                            src={formState.image}
                            alt="preview"
                            className="img-sm preview-thumb"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Keywords:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={formState.keywords}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            keywords: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Description:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <textarea
                        className="form-control editor"
                        rows={3}
                        value={formState.description}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>

                  {/* Weigh */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Weigh:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <input
                        type="number"
                        className="form-control"
                        value={formState.weigh}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            weigh: parseInt(e.target.value, 10) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label className="control-label col-xs-12 col-sm-2">
                      Status:
                    </label>
                    <div className="col-xs-12 col-sm-8">
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="status"
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
                          name="status"
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
              alt="Category Preview"
              className="lightbox-img"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-category-wrapper {
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
        .category-ribbon {
          background: #ffffff;
          border-bottom: 1px solid #e7eaec;
          padding: 11px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-ribbon .breadcrumb {
          margin: 0;
          padding: 0;
          background: transparent;
          font-size: 12px;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .category-ribbon .breadcrumb > li + li:before {
          content: "/";
          padding: 0 5px;
          color: #ccc;
        }

        .category-ribbon .breadcrumb a {
          color: #777;
          text-decoration: none;
        }

        .category-ribbon .breadcrumb a:hover {
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
          padding: 15px 15px 0 15px;
          border-bottom: 1px solid #e7eaec;
          background: #fbfbfb;
        }

        .panel-lead {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }

        .panel-lead em {
          font-style: normal;
          font-weight: bold;
          margin-right: 8px;
        }

        /* Nav Tabs */
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
          line-height: 1.42857143;
          border: 1px solid transparent;
          border-radius: 4px 4px 0 0;
          padding: 10px 15px;
          display: block;
          color: #555;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .nav-tabs > li.active > a,
        .nav-tabs > li.active > a:hover,
        .nav-tabs > li.active > a:focus {
          color: #555;
          background-color: #fff;
          border: 1px solid #ddd;
          border-bottom-color: transparent;
          cursor: default;
        }

        .nav-tabs > li > a:hover {
          background-color: #eee;
        }

        /* Panel Body */
        .panel-body {
          padding: 15px;
        }

        /* Toolbar */
        .toolbar {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
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

        .btn-default {
          color: #333;
          background-color: #fff;
          border-color: #ccc;
        }

        .btn-default:hover {
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
          float: left;
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

        .dropdown-menu > li > a {
          display: block;
          padding: 6px 20px;
          clear: both;
          font-weight: 400;
          line-height: 1.42857143;
          color: #333;
          white-space: nowrap;
          text-decoration: none;
        }

        .dropdown-menu > li > a:hover {
          background-color: #f5f5f5;
          color: #262626;
        }

        /* Table */
        .table-responsive {
          min-height: 0.01%;
          overflow-x: auto;
        }

        .table {
          width: 100%;
          max-width: 100%;
          margin-bottom: 20px;
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

        /* Image Thumbnails */
        .image-thumb-wrapper {
          display: inline-block;
          cursor: pointer;
          border: 1px solid #eee;
          padding: 2px;
          border-radius: 4px;
          background: #fff;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .image-thumb-wrapper:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .category-thumb {
          max-height: 38px;
          max-width: 110px;
          object-fit: cover;
          display: block;
          border-radius: 2px;
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

        .label-primary {
          background-color: #18bc9c;
        }

        .status-btn {
          font-weight: 600;
          font-size: 12px;
        }

        .text-success {
          color: #18bc9c;
        }

        .text-muted {
          color: #777;
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

        /* Custom Modal Backdrop */
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
          text-shadow: 0 1px 0 #fff;
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

        .alert-warning-light {
          background-color: #fcf8e3;
          border-color: #faebcc;
          color: #8a6d3b;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 13px;
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
          background-image: none;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
        }

        .form-control:focus {
          border-color: #18bc9c;
          outline: 0;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(24, 188, 156, 0.6);
        }

        textarea.form-control {
          height: auto;
        }

        .input-group {
          position: relative;
          display: flex;
          border-collapse: separate;
          width: 100%;
        }

        .input-group-addon {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
        }

        .flag-checkboxes {
          display: flex;
          gap: 15px;
          align-items: center;
          padding-top: 7px;
        }

        .image-preview-box {
          margin-top: 10px;
          padding: 4px;
          border: 1px dashed #ccc;
          display: inline-block;
          border-radius: 4px;
        }

        .preview-thumb {
          max-height: 60px;
          border-radius: 2px;
        }

        .radio-inline,
        .checkbox-inline {
          position: relative;
          display: inline-block;
          padding-left: 20px;
          margin-bottom: 0;
          font-weight: 400;
          vertical-align: middle;
          cursor: pointer;
          font-size: 13px;
          margin-right: 15px;
        }

        .radio-inline input[type="radio"],
        .checkbox-inline input[type="checkbox"] {
          position: absolute;
          margin-top: 4px;
          margin-left: -20px;
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
          .category-ribbon {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          .input-group {
            flex-direction: column;
          }
          .input-group-addon {
            margin-left: 0;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
}
