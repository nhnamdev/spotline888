"use client";

import React, { useState } from "react";

export interface ProductItem {
  id: number;
  weigh: number; // 排序
  code: string;
  title: string;
  image: string;
  typeName: string; // 虚拟币 | 商品
  price: string;
  updateTime: string;
  isOpen: boolean; // true = 开启, false = 关闭
  status: boolean; // true = 启用, false = 禁用
  ctime: string;
}

const initialProducts: ProductItem[] = [
  {
    id: 340,
    weigh: 220,
    code: "BTC",
    title: "BTC/USDT",
    image: "/uploads/20251103/e4063309d0783b20b4a4f229b9aeccb2.png",
    typeName: "虚拟币",
    price: "66343.07000000",
    updateTime: "2025-11-06 07:18:45",
    isOpen: true,
    status: true,
    ctime: "2024-06-14 10:56:46",
  },
  {
    id: 349,
    weigh: 208,
    code: "TRX",
    title: "TRX/USDT",
    image: "/uploads/20251103/eb48feb407a9617a4723f44265c14f96.png",
    typeName: "虚拟币",
    price: "0.28153100",
    updateTime: "2025-11-06 07:18:45",
    isOpen: true,
    status: true,
    ctime: "2024-06-14 11:19:00",
  },
  {
    id: 347,
    weigh: 207,
    code: "DOT",
    title: "DOT/USDT",
    image: "/uploads/20251103/6c57613336dc4a7cb082d8267aacf0a1.png",
    typeName: "虚拟币",
    price: "1.51630000",
    updateTime: "2025-11-06 07:18:45",
    isOpen: true,
    status: true,
    ctime: "2024-06-14 11:14:25",
  },
  {
    id: 341,
    weigh: 206,
    code: "LINK",
    title: "LINK/USDT",
    image: "/uploads/20251103/e7b47802446b12cea02cff2b5aee1ee3.png",
    typeName: "虚拟币",
    price: "8.70000000",
    updateTime: "2025-11-06 07:18:45",
    isOpen: true,
    status: true,
    ctime: "2024-06-14 10:58:50",
  },
  {
    id: 351,
    weigh: 205,
    code: "BCH",
    title: "BCH/USDT",
    image: "/uploads/20251103/0a71c2d5dcfcf70fd748ac23561deda9.png",
    typeName: "虚拟币",
    price: "438.43000000",
    updateTime: "2025-11-06 07:18:45",
    isOpen: true,
    status: true,
    ctime: "2024-06-14 11:22:11",
  },
  {
    id: 343,
    weigh: 204,
    code: "ETC",
    title: "ETC/USDT",
    image: "/uploads/20251103/5fb3aee9e34e569992f98e6c4ea05ea0.png",
    typeName: "虚拟币",
    price: "8.54790000",
    updateTime: "2025-11-06 07:18:45",
    isOpen: true,
    status: true,
    ctime: "2024-06-14 11:02:35",
  },
  {
    id: 378,
    weigh: 200,
    code: "GOLD",
    title: "黄金/伦敦金",
    image: "/uploads/20250811/72eb62a1a0dfc0df8e874945d8b74614.png",
    typeName: "商品",
    price: "3971.20000000",
    updateTime: "2025-11-06 07:18:45",
    isOpen: false,
    status: true,
    ctime: "2025-11-03 04:30:43",
  },
  {
    id: 379,
    weigh: 199,
    code: "Silver",
    title: "白银/伦敦银",
    image: "/uploads/20250811/d1e1f78eaec7ca09ec6149f1ca92ee14.png",
    typeName: "商品",
    price: "47.94300000",
    updateTime: "2025-11-06 07:18:46",
    isOpen: false,
    status: true,
    ctime: "2025-11-03 04:30:51",
  },
  {
    id: 380,
    weigh: 198,
    code: "Aluminum",
    title: "铝",
    image: "/uploads/20250811/d854eb0c968f51dfa1f868c62b535d48.png",
    typeName: "商品",
    price: "2824.55000000",
    updateTime: "2025-11-06 07:18:46",
    isOpen: false,
    status: true,
    ctime: "2025-11-03 04:30:59",
  },
  {
    id: 377,
    weigh: 197,
    code: "Zinc",
    title: "锌",
    image: "/uploads/20250811/e93910c5da8cb4c062c3e100f7e4367c.png",
    typeName: "商品",
    price: "3033.69000000",
    updateTime: "2025-11-06 07:18:46",
    isOpen: false,
    status: true,
    ctime: "2025-11-03 04:30:34",
  },
];

export default function AdminProductListContent() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  // Commonsearch form fields
  const [searchForm, setSearchForm] = useState({
    code: "",
    title: "",
    status: "Choose",
  });

  // Column visibility state
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [columns, setColumns] = useState({
    id: true,
    weigh: true,
    code: true,
    title: true,
    image: true,
    typeName: true,
    price: true,
    updateTime: true,
    isOpen: true,
    status: true,
    ctime: true,
    operate: true,
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form states for Add/Edit
  const [modalForm, setModalForm] = useState({
    code: "",
    title: "",
    typeName: "虚拟币",
    price: "",
    weigh: 200,
    isOpen: true,
    status: true,
  });

  // Select all / deselect all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter products based on searchForm
  const filteredProducts = products.filter((item) => {
    if (
      searchForm.code &&
      !item.code.toLowerCase().includes(searchForm.code.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      searchForm.title &&
      !item.title.toLowerCase().includes(searchForm.title.trim().toLowerCase())
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
      code: "",
      title: "",
      status: "Choose",
    });
    setProducts([...initialProducts]);
  };

  // Status toggle
  const handleToggleIsOpen = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isOpen: !p.isOpen } : p))
    );
  };

  const handleToggleStatus = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: !p.status } : p))
    );
  };

  // Delete product
  const handleDelete = (id: number) => {
    if (window.confirm("确定要删除这条记录吗？")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 条记录吗？`)) {
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  const handleSetStatusMulti = (val: boolean) => {
    if (selectedIds.length === 0) return;
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: val } : p))
    );
  };

  // Open Edit Modal
  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setModalForm({
      code: product.code,
      title: product.title,
      typeName: product.typeName,
      price: product.price,
      weigh: product.weigh,
      isOpen: product.isOpen,
      status: product.status,
    });
  };

  // Save Add/Edit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                code: modalForm.code,
                title: modalForm.title,
                typeName: modalForm.typeName,
                price: modalForm.price,
                weigh: Number(modalForm.weigh),
                isOpen: modalForm.isOpen,
                status: modalForm.status,
                updateTime: "2026-09-07 17:20:00",
              }
            : p
        )
      );
      setEditingProduct(null);
    } else {
      const newId = Math.max(...products.map((p) => p.id), 380) + 1;
      const newProduct: ProductItem = {
        id: newId,
        weigh: Number(modalForm.weigh),
        code: modalForm.code.toUpperCase(),
        title: modalForm.title,
        image: "/uploads/20251103/e4063309d0783b20b4a4f229b9aeccb2.png",
        typeName: modalForm.typeName,
        price: modalForm.price || "0.00000000",
        updateTime: "2026-09-07 17:20:00",
        isOpen: modalForm.isOpen,
        status: modalForm.status,
        ctime: "2026-09-07 17:20:00",
      };
      setProducts([newProduct, ...products]);
      setIsAddModalOpen(false);
    }
  };

  // Render fallback SVG / icon for broken image
  const renderProductImage = (item: ProductItem) => {
    if (imgErrors[item.id]) {
      // Return custom stylized coin / commodity icon
      const colors: Record<string, { bg: string; text: string }> = {
        BTC: { bg: "#f7931a", text: "₿" },
        TRX: { bg: "#eb0029", text: "TRX" },
        DOT: { bg: "#e6007a", text: "●" },
        LINK: { bg: "#375bd2", text: "⬡" },
        BCH: { bg: "#0ac18e", text: "₿" },
        ETC: { bg: "#3ab83a", text: "♦" },
        GOLD: { bg: "#d4af37", text: "Au" },
        Silver: { bg: "#a8a9ad", text: "Ag" },
        Aluminum: { bg: "#8a9ea7", text: "Al" },
        Zinc: { bg: "#75828a", text: "Zn" },
      };
      const c = colors[item.code] || { bg: "#555", text: item.code.slice(0, 2) };

      return (
        <a
          href="javascript:;"
          style={{ textDecoration: "none", display: "inline-block" }}
        >
          <div
            className="img-sm img-center fallback-badge"
            style={{
              width: 30,
              height: 30,
              borderRadius: 4,
              backgroundColor: c.bg,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              margin: "0 auto",
            }}
          >
            {c.text}
          </div>
        </a>
      );
    }

    return (
      <a
        href={item.image}
        target="_blank"
        rel="noreferrer"
        style={{ display: "inline-block" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="img-sm img-center"
          src={item.image}
          alt={item.code}
          style={{
            width: 30,
            height: 30,
            objectFit: "contain",
            borderRadius: 3,
            display: "block",
            margin: "0 auto",
          }}
          onError={() =>
            setImgErrors((prev) => ({ ...prev, [item.id]: true }))
          }
        />
      </a>
    );
  };

  return (
    <div className="product-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">
          <span>产品管理</span>
          <span className="breadcrumb-sep">/</span>
          <span>产品列表</span>
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
                  {/* Code */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-code">
                      Code
                    </label>
                    <div className="control-input">
                      <input
                        id="search-code"
                        type="text"
                        className="form-control"
                        placeholder="Code"
                        value={searchForm.code}
                        onChange={(e) =>
                          setSearchForm({
                            ...searchForm,
                            code: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="form-group">
                    <label className="control-label" htmlFor="search-title">
                      Title
                    </label>
                    <div className="control-input">
                      <input
                        id="search-title"
                        type="text"
                        className="form-control"
                        placeholder="Title"
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
                    setProducts([...initialProducts]);
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
                    setEditingProduct(null);
                    setModalForm({
                      code: "",
                      title: "",
                      typeName: "虚拟币",
                      price: "",
                      weigh: 200,
                      isOpen: true,
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
                    const item = products.find((p) => p.id === selectedIds[0]);
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
                          selectedIds.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    {columns.id && <th>Id</th>}
                    {columns.weigh && <th>排序</th>}
                    {columns.code && <th>Code</th>}
                    {columns.title && <th>Title</th>}
                    {columns.image && <th>Image</th>}
                    {columns.typeName && <th>Producttype.name</th>}
                    {columns.price && <th>当前价格</th>}
                    {columns.updateTime && <th>更新时间</th>}
                    {columns.isOpen && <th>Is_open</th>}
                    {columns.status && <th>Status</th>}
                    {columns.ctime && <th>Ctime</th>}
                    {columns.operate && <th className="col-operate">Operate</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item) => {
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
                        {columns.weigh && (
                          <td>
                            <a
                              href="javascript:;"
                              className="editable editable-click"
                              title="点击编辑排序"
                            >
                              {item.weigh}
                            </a>
                          </td>
                        )}
                        {columns.code && (
                          <td className="font-code">{item.code}</td>
                        )}
                        {columns.title && <td>{item.title}</td>}
                        {columns.image && (
                          <td className="col-image text-center">
                            {renderProductImage(item)}
                          </td>
                        )}
                        {columns.typeName && (
                          <td>
                            <span className="type-tag">{item.typeName}</span>
                          </td>
                        )}
                        {columns.price && (
                          <td className="font-price text-right">
                            {item.price}
                          </td>
                        )}
                        {columns.updateTime && (
                          <td className="text-nowrap">{item.updateTime}</td>
                        )}
                        {columns.isOpen && (
                          <td className="text-center">
                            <span
                              className={`label ${
                                item.isOpen ? "bg-green" : "bg-red"
                              }`}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleToggleIsOpen(item.id)}
                              title="点击切换"
                            >
                              {item.isOpen ? "开启" : "关闭"}
                            </span>
                          </td>
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
                  显示第 1 到第 {Math.min(filteredProducts.length, pageSize)} 条记录，总共 32 条记录
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
                <li className={currentPage === 2 ? "active" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(2);
                    }}
                  >
                    2
                  </a>
                </li>
                <li className={currentPage === 3 ? "active" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(3);
                    }}
                  >
                    3
                  </a>
                </li>
                <li className={currentPage === 4 ? "active" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(4);
                    }}
                  >
                    4
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(2);
                    }}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                >
                  &times;
                </button>
                <h4 className="modal-title">
                  {editingProduct ? "编辑产品" : "添加产品"}
                </h4>
              </div>
              <form onSubmit={handleSaveProduct}>
                <div className="modal-body">
                  <div className="modal-form-group">
                    <label>Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalForm.code}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, code: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalForm.title}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>类型 (Producttype)</label>
                    <select
                      className="form-control"
                      value={modalForm.typeName}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, typeName: e.target.value })
                      }
                    >
                      <option value="虚拟币">虚拟币</option>
                      <option value="商品">商品</option>
                    </select>
                  </div>
                  <div className="modal-form-group">
                    <label>当前价格</label>
                    <input
                      type="text"
                      className="form-control"
                      value={modalForm.price}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>排序 (Weigh)</label>
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
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Is_open</label>
                    <select
                      className="form-control"
                      value={modalForm.isOpen ? "1" : "0"}
                      onChange={(e) =>
                        setModalForm({
                          ...modalForm,
                          isOpen: e.target.value === "1",
                        })
                      }
                    >
                      <option value="1">开启</option>
                      <option value="0">关闭</option>
                    </select>
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
                      setEditingProduct(null);
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
        .product-page-wrapper {
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

        .editable-click {
          color: #337ab7;
          border-bottom: 1px dashed #337ab7;
          text-decoration: none;
          cursor: pointer;
          font-weight: 500;
        }

        .editable-click:hover {
          color: #23527c;
          border-bottom-color: #23527c;
        }

        .font-code {
          font-weight: 600;
          color: #333333;
        }

        .font-price {
          font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
          color: #2c3e50;
        }

        .type-tag {
          display: inline-block;
          color: #666666;
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
          width: 500px;
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
          max-height: 70vh;
          overflow-y: auto;
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
