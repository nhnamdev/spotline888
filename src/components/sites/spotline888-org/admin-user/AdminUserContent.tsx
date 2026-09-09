"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

interface UserItem {
  uid: number;
  avatarBg: string;
  account: string;
  realName: string;
  accountType: string;
  phone: string;
  profession: string;
  authStatus: string;
  money: string;
  usdtBalance: string;
  creditScore?: number;
}

export default function AdminUserContent() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "blacklist">("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Search filters
  const [searchForm, setSearchForm] = useState({
    account: "",
    accountType: "Choose",
    phone: "",
    parentUser: "",
    inviteCode: "",
    loginIp: "",
    riskControl: "Choose",
    status: "Choose",
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(users.map((u) => u.uid));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (uid: number) => {
    setSelectedIds((prev) =>
      prev.includes(uid) ? prev.filter((item) => item !== uid) : [...prev, uid]
    );
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchForm.account);
  };

  const handleFilterReset = () => {
    setSearchForm({
      account: "",
      accountType: "Choose",
      phone: "",
      parentUser: "",
      inviteCode: "",
      loginIp: "",
      riskControl: "Choose",
      status: "Choose",
    });
    fetchUsers("");
  };

  // Modal State for Balance Adjustment (分数 / 上下分)
  const [balanceModal, setBalanceModal] = useState<{
    isOpen: boolean;
    user: UserItem | null;
    type: 'add' | 'sub';
    amount: string;
    memo: string;
    loading: boolean;
  }>({
    isOpen: false,
    user: null,
    type: 'add',
    amount: '',
    memo: '',
    loading: false,
  });

  // Modal State for Credit Score Adjustment (信誉分)
  const [creditModal, setCreditModal] = useState<{
    isOpen: boolean;
    user: UserItem | null;
    type: 'add' | 'sub' | 'set';
    score: string;
    memo: string;
    loading: boolean;
  }>({
    isOpen: false,
    user: null,
    type: 'add',
    score: '',
    memo: '',
    loading: false,
  });

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchUsers = async (customAccount?: string) => {
    try {
      setLoading(true);
      const q = customAccount !== undefined ? customAccount : searchForm.account;
      const res = await adminApi.getUsers(currentPage, pageSize, q);
      if (res && res.code === 1 && res.data?.rows) {
        const colors = ["#d9534f", "#f0ad4e", "#5bc0de", "#337ab7", "#5cb85c"];
        const mapped: UserItem[] = res.data.rows.map((u: any, idx: number) => ({
          uid: u.id,
          avatarBg: colors[idx % colors.length],
          account: u.account || u.username || 'User_' + u.id,
          realName: u.real_name || u.account || '-',
          accountType: u.level > 1 ? 'VIP ' + u.level : '客户',
          phone: u.phone || '-',
          profession: u.remark || '普通会员',
          authStatus: u.is_auth === 2 ? '已认证' : (u.is_auth === 1 ? '待审核' : '未认证'),
          money: parseFloat(u.money || 0).toFixed(2),
          usdtBalance: parseFloat(u.usdt || 0).toFixed(2),
          creditScore: u.credit_score ?? 100,
        }));
        setUsers(mapped);
        setTotal(res.data.total || mapped.length);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const handleConfirmBalance = async () => {
    if (!balanceModal.user) return;
    const numAmount = parseFloat(balanceModal.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ (> 0)');
      return;
    }

    setBalanceModal(prev => ({ ...prev, loading: true }));
    try {
      const res = await adminApi.adjustBalance({
        userId: balanceModal.user.uid,
        amount: numAmount,
        type: balanceModal.type,
        memo: balanceModal.memo || (balanceModal.type === 'add' ? `Admin cộng tiền: +${numAmount}` : `Admin trừ tiền: -${numAmount}`),
      });

      if (res && res.code === 1) {
        const newBalance = res.data?.after_balance !== undefined 
          ? parseFloat(res.data.after_balance).toFixed(2) 
          : (
            balanceModal.type === 'add' 
              ? (parseFloat(balanceModal.user.money) + numAmount).toFixed(2)
              : (parseFloat(balanceModal.user.money) - numAmount).toFixed(2)
          );

        setUsers(prev => prev.map(u => u.uid === balanceModal.user!.uid ? { ...u, money: newBalance } : u));
        setBalanceModal({ isOpen: false, user: null, type: 'add', amount: '', memo: '', loading: false });
        showToast('success', `Điều chỉnh số dư thành công! Số dư mới: ${newBalance} MYR`);
      } else {
        alert(res?.msg || 'Điều chỉnh số dư thất bại');
        setBalanceModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err: any) {
      alert('Lỗi kết nối: ' + err.message);
      setBalanceModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleConfirmCredit = async () => {
    if (!creditModal.user) return;
    const numScore = parseFloat(creditModal.score);
    if (isNaN(numScore)) {
      alert('Vui lòng nhập số điểm hợp lệ');
      return;
    }

    setCreditModal(prev => ({ ...prev, loading: true }));
    try {
      const res = await adminApi.adjustCreditScore({
        userId: creditModal.user.uid,
        score: numScore,
        type: creditModal.type,
        memo: creditModal.memo || `Điều chỉnh điểm tín nhiệm (${creditModal.type}): ${numScore}`,
      });

      if (res && res.code === 1) {
        const currentVal = creditModal.user.creditScore ?? 100;
        const newScore = res.data?.after_score ?? res.data?.credit_score ?? (
          creditModal.type === 'set' ? Math.min(100, Math.max(0, Math.round(numScore))) :
          creditModal.type === 'sub' ? Math.max(0, currentVal - Math.round(Math.abs(numScore))) :
          Math.min(100, currentVal + Math.round(Math.abs(numScore)))
        );

        setUsers(prev => prev.map(u => u.uid === creditModal.user!.uid ? { ...u, creditScore: newScore } : u));
        setCreditModal({ isOpen: false, user: null, type: 'add', score: '', memo: '', loading: false });
        showToast('success', `Cập nhật điểm tín nhiệm thành công! Điểm mới: ${newScore}/100`);
      } else {
        alert(res?.msg || 'Điều chỉnh điểm tín nhiệm thất bại');
        setCreditModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err: any) {
      alert('Lỗi kết nối: ' + err.message);
      setCreditModal(prev => ({ ...prev, loading: false }));
    }
  };


  return (
    <div className="user-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">会员管理</div>
      </div>

      {/* Page Title */}
      <div className="page-header-title">
        <h1>
          会员管理 <small>会员管理</small>
        </h1>
      </div>

      <div className="content-body">
        <div className="panel panel-default">
          {/* Nav Tabs */}
          <div className="panel-heading-tabs">
            <ul className="nav nav-tabs">
              <li className={activeTab === "users" ? "active" : ""}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("users");
                  }}
                >
                  用户管理
                </a>
              </li>
              <li className={activeTab === "blacklist" ? "active" : ""}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("blacklist");
                  }}
                >
                  IP黑名单
                </a>
              </li>
            </ul>
          </div>

          <div className="panel-body">
            {/* Common Search Form */}
            <form className="form-commonsearch" onSubmit={handleFilterSubmit}>
              <div className="search-grid">
                {/* Account */}
                <div className="form-group">
                  <label className="control-label">Account</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="用户ID|姓名|登录IP搜索"
                      value={searchForm.account}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, account: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 账号类型 */}
                <div className="form-group">
                  <label className="control-label">账号类型</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.accountType}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          accountType: e.target.value,
                        })
                      }
                    >
                      <option value="Choose">Choose</option>
                      <option value="1">客户</option>
                      <option value="2">代理</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="control-label">Phone</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone"
                      value={searchForm.phone}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 上级用户 */}
                <div className="form-group">
                  <label className="control-label">上级用户</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="上级用户"
                      value={searchForm.parentUser}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          parentUser: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 邀请码 */}
                <div className="form-group">
                  <label className="control-label">邀请码</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="邀请码"
                      value={searchForm.inviteCode}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          inviteCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 登录IP */}
                <div className="form-group">
                  <label className="control-label">登录IP</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="登录IP"
                      value={searchForm.loginIp}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, loginIp: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 会员风控 */}
                <div className="form-group">
                  <label className="control-label">会员风控</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.riskControl}
                      onChange={(e) =>
                        setSearchForm({
                          ...searchForm,
                          riskControl: e.target.value,
                        })
                      }
                    >
                      <option value="Choose">Choose</option>
                      <option value="0">正常</option>
                      <option value="1">风控</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="control-label">Status</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.status}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, status: e.target.value })
                      }
                    >
                      <option value="Choose">Choose</option>
                      <option value="1">正常</option>
                      <option value="0">禁用</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit & Reset Buttons */}
              <div className="form-actions">
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
            </form>

            {/* Action Toolbar */}
            <div className="toolbar-container">
              <button
                type="button"
                className="btn btn-primary btn-refresh"
                title="Refresh"
                onClick={() => fetchUsers()}
              >
                <i className="fa fa-refresh"></i>
              </button>
              <button type="button" className="btn btn-success btn-add">
                <i className="fa fa-plus"></i> Add
              </button>
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
                          selectedIds.length === users.length &&
                          users.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Uid</th>
                    <th>会员头像</th>
                    <th>Account</th>
                    <th>Real_name</th>
                    <th>账号类型</th>
                    <th>Phone</th>
                    <th>Profession</th>
                    <th>Auth_status</th>
                    <th>
                      Money <i className="fa fa-sort text-muted"></i>
                    </th>
                    <th>USDT余额</th>
                    <th>信誉分</th>
                    <th className="col-operate-header">Operate</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8 text-gray-500">
                        <i className="fa fa-refresh fa-spin mr-2"></i> 正在加载会员数据 (Đang tải dữ liệu hội viên từ CSDL)...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8 text-gray-400">
                        暂无数据 (Không có hội viên nào)
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                    const isSelected = selectedIds.includes(user.uid);
                    return (
                      <tr key={user.uid} className={isSelected ? "selected" : ""}>
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(user.uid)}
                          />
                        </td>
                        <td>{user.uid}</td>
                        <td className="col-avatar">
                          <div
                            className="avatar-circle"
                            style={{ backgroundColor: user.avatarBg }}
                          >
                            <i className="fa fa-user"></i>
                          </div>
                        </td>
                        <td className="col-account">{user.account}</td>
                        <td>{user.realName}</td>
                        <td>
                          <span className="badge badge-primary">
                            {user.accountType}
                          </span>
                        </td>
                        <td>{user.phone}</td>
                        <td>{user.profession}</td>
                        <td>
                          <span className="badge-outline-success">
                            {user.authStatus}
                          </span>
                        </td>
                        <td className="text-right" style={{ fontWeight: 600, color: '#18bc9c' }}>{user.money}</td>
                        <td>{user.usdtBalance}</td>
                        <td>
                          <span className="badge" style={{ backgroundColor: '#f39c12', color: '#fff', padding: '2px 8px', borderRadius: 4, fontWeight: 'bold' }}>
                            {user.creditScore ?? 100}
                          </span>
                        </td>
                        <td className="col-operate">
                          <div className="btn-group-operate">
                            <button
                              type="button"
                              className="btn btn-xs btn-success"
                            >
                              <i className="fa fa-list"></i> Detail
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-dark-blue"
                            >
                              <i className="fa fa-comment"></i> 发送消息
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-warning"
                              title="Can thiệp sửa số dư / Nạp - Trừ điểm (修改余额 / 上下分)"
                              onClick={() => setBalanceModal({
                                isOpen: true,
                                user,
                                type: 'add',
                                amount: '',
                                memo: '',
                                loading: false,
                              })}
                            >
                              <i className="fa fa-shopping-cart"></i> 分数 (修改余额)
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-warning"
                            >
                              <i className="fa fa-lock"></i> 冻结资金
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-warning"
                              title="Cộng / Trừ điểm tín nhiệm (增加/扣除信誉分)"
                              onClick={() => setCreditModal({
                                isOpen: true,
                                user,
                                type: 'add',
                                score: '',
                                memo: '',
                                loading: false,
                              })}
                            >
                              <i className="fa fa-star"></i> 信誉分
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-info"
                            >
                              <i className="fa fa-area-chart"></i> 报表
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger"
                            >
                              <i className="fa fa-user"></i> 设置黑名单
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger"
                            >
                              <i className="fa fa-user"></i> 冻结
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger"
                            >
                              <i className="fa fa-ban"></i> 拉黑IP
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-success btn-icon-only"
                              title="Edit"
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger btn-icon-only"
                              title="Delete"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  显示第 {total === 0 ? 0 : (currentPage - 1) * pageSize + 1} 到第{" "}
                  {Math.min(currentPage * pageSize, total)} 条记录，总共 {total} 条记录
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
                <li className={currentPage <= 1 ? "disabled" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  >
                    Previous
                  </a>
                </li>
                {Array.from(
                  { length: Math.min(10, Math.max(1, Math.ceil(total / pageSize))) },
                  (_, i) => i + 1
                ).map((p) => (
                  <li key={p} className={currentPage === p ? "active" : ""}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(p);
                      }}
                    >
                      {p}
                    </a>
                  </li>
                ))}
                <li className={currentPage >= Math.ceil(total / pageSize) ? "disabled" : ""}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < Math.ceil(total / pageSize)) setCurrentPage(currentPage + 1);
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

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 99999,
          backgroundColor: toastMessage.type === 'success' ? '#27ae60' : '#e74c3c',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 6,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 14,
          fontWeight: 500,
        }}>
          <i className={`fa ${toastMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modal Điều chỉnh số dư hội viên (上下分) */}
      {balanceModal.isOpen && balanceModal.user && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa fa-shopping-cart" style={{ color: '#f39c12' }}></i>
                Điều chỉnh số dư hội viên (上下分)
              </h3>
              <button 
                type="button" 
                className="close-btn"
                onClick={() => setBalanceModal(prev => ({ ...prev, isOpen: false, user: null }))}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="info-badge-row">
                <div className="info-item">
                  <span className="info-label">Tài khoản:</span>
                  <strong className="info-value">{balanceModal.user.account}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">UID:</span>
                  <strong className="info-value">{balanceModal.user.uid}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">Số dư hiện tại:</span>
                  <strong className="info-value" style={{ color: '#18bc9c' }}>{balanceModal.user.money} MYR</strong>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">Loại thao tác <span style={{ color: '#e74c3c' }}>*</span></label>
                <div className="radio-button-group">
                  <label className={`radio-pill ${balanceModal.type === 'add' ? 'active add' : ''}`}>
                    <input 
                      type="radio" 
                      name="balanceType" 
                      value="add" 
                      checked={balanceModal.type === 'add'} 
                      onChange={() => setBalanceModal(prev => ({ ...prev, type: 'add' }))}
                    />
                    <i className="fa fa-plus-circle"></i> Cộng tiền (+)
                  </label>
                  <label className={`radio-pill ${balanceModal.type === 'sub' ? 'active sub' : ''}`}>
                    <input 
                      type="radio" 
                      name="balanceType" 
                      value="sub" 
                      checked={balanceModal.type === 'sub'} 
                      onChange={() => setBalanceModal(prev => ({ ...prev, type: 'sub' }))}
                    />
                    <i className="fa fa-minus-circle"></i> Trừ tiền (-)
                  </label>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">Số tiền điều chỉnh (MYR) <span style={{ color: '#e74c3c' }}>*</span></label>
                <input 
                  type="number" 
                  className="modal-input" 
                  placeholder="Nhập số tiền (VD: 1000)"
                  min="0.01"
                  step="any"
                  value={balanceModal.amount}
                  onChange={(e) => setBalanceModal(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Lý do / Ghi chú</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="Lý do điều chỉnh (tùy chọn)"
                  value={balanceModal.memo}
                  onChange={(e) => setBalanceModal(prev => ({ ...prev, memo: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-default"
                disabled={balanceModal.loading}
                onClick={() => setBalanceModal(prev => ({ ...prev, isOpen: false, user: null }))}
              >
                Hủy bỏ
              </button>
              <button 
                type="button" 
                className="btn btn-success"
                disabled={balanceModal.loading}
                onClick={handleConfirmBalance}
              >
                {balanceModal.loading ? 'Đang xử lý...' : 'Xác nhận điều chỉnh'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Điều chỉnh điểm tín nhiệm (信誉分) */}
      {creditModal.isOpen && creditModal.user && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa fa-star" style={{ color: '#f39c12' }}></i>
                Điều chỉnh điểm tín nhiệm (信誉分)
              </h3>
              <button 
                type="button" 
                className="close-btn"
                onClick={() => setCreditModal(prev => ({ ...prev, isOpen: false, user: null }))}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="info-badge-row">
                <div className="info-item">
                  <span className="info-label">Tài khoản:</span>
                  <strong className="info-value">{creditModal.user.account}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">UID:</span>
                  <strong className="info-value">{creditModal.user.uid}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">Điểm hiện tại:</span>
                  <strong className="info-value" style={{ color: '#f39c12' }}>{creditModal.user.creditScore ?? 100} / 100</strong>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">Thao tác <span style={{ color: '#e74c3c' }}>*</span></label>
                <div className="radio-button-group">
                  <label className={`radio-pill ${creditModal.type === 'add' ? 'active add' : ''}`}>
                    <input 
                      type="radio" 
                      name="creditType" 
                      value="add" 
                      checked={creditModal.type === 'add'} 
                      onChange={() => setCreditModal(prev => ({ ...prev, type: 'add' }))}
                    />
                    <i className="fa fa-plus-circle"></i> Tăng điểm (+)
                  </label>
                  <label className={`radio-pill ${creditModal.type === 'sub' ? 'active sub' : ''}`}>
                    <input 
                      type="radio" 
                      name="creditType" 
                      value="sub" 
                      checked={creditModal.type === 'sub'} 
                      onChange={() => setCreditModal(prev => ({ ...prev, type: 'sub' }))}
                    />
                    <i className="fa fa-minus-circle"></i> Trừ điểm (-)
                  </label>
                  <label className={`radio-pill ${creditModal.type === 'set' ? 'active' : ''}`} style={creditModal.type === 'set' ? { borderColor: '#3498db', backgroundColor: '#ebf5fb', color: '#2980b9' } : {}}>
                    <input 
                      type="radio" 
                      name="creditType" 
                      value="set" 
                      checked={creditModal.type === 'set'} 
                      onChange={() => setCreditModal(prev => ({ ...prev, type: 'set' }))}
                    />
                    <i className="fa fa-pencil"></i> Đặt điểm (=)
                  </label>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">
                  {creditModal.type === 'set' ? 'Điểm số thiết lập (0 - 100)' : 'Số điểm cần điều chỉnh'}{' '}
                  <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input 
                  type="number" 
                  className="modal-input" 
                  placeholder="Nhập số điểm (VD: 10)"
                  min="0"
                  max="100"
                  value={creditModal.score}
                  onChange={(e) => setCreditModal(prev => ({ ...prev, score: e.target.value }))}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Lý do / Ghi chú</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="Lý do điều chỉnh điểm (tùy chọn)"
                  value={creditModal.memo}
                  onChange={(e) => setCreditModal(prev => ({ ...prev, memo: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-default"
                disabled={creditModal.loading}
                onClick={() => setCreditModal(prev => ({ ...prev, isOpen: false, user: null }))}
              >
                Hủy bỏ
              </button>
              <button 
                type="button" 
                className="btn btn-warning"
                style={{ color: '#fff', backgroundColor: '#f39c12', borderColor: '#e08e0b' }}
                disabled={creditModal.loading}
                onClick={handleConfirmCredit}
              >
                {creditModal.loading ? 'Đang xử lý...' : 'Xác nhận cập nhật điểm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Modal Popup Styles */
        .modal-backdrop {
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
        }

        .modal-box {
          background-color: #ffffff;
          width: 90%;
          max-width: 500px;
          border-radius: 6px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid #e7eaec;
          background-color: #f8f9fa;
        }

        .modal-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          line-height: 1;
          color: #999999;
          cursor: pointer;
        }

        .close-btn:hover {
          color: #333333;
        }

        .modal-body {
          padding: 20px;
        }

        .info-badge-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          background-color: #f8f9fa;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 18px;
          border: 1px solid #e9ecef;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .info-label {
          font-size: 11px;
          color: #777777;
        }

        .info-value {
          font-size: 13px;
          color: #333333;
        }

        .form-field-group {
          margin-bottom: 16px;
        }

        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #444444;
          margin-bottom: 6px;
        }

        .radio-button-group {
          display: flex;
          gap: 10px;
        }

        .radio-pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #dcdcdc;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #555555;
          transition: all 0.2s;
        }

        .radio-pill input {
          display: none;
        }

        .radio-pill.active.add {
          border-color: #18bc9c;
          background-color: #e8f8f5;
          color: #18bc9c;
        }

        .radio-pill.active.sub {
          border-color: #e74c3c;
          background-color: #fdedec;
          color: #e74c3c;
        }

        .modal-input {
          width: 100%;
          height: 38px;
          padding: 6px 12px;
          font-size: 14px;
          border: 1px solid #cccccc;
          border-radius: 4px;
          outline: none;
          box-sizing: border-box;
        }

        .modal-input:focus {
          border-color: #18bc9c;
          box-shadow: 0 0 5px rgba(24, 188, 156, 0.3);
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 12px 20px;
          border-top: 1px solid #e7eaec;
          background-color: #f8f9fa;
        }

        .user-page-wrapper {
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
        }

        /* Page Title */
        .page-header-title {
          padding: 15px 15px 5px 15px;
        }

        .page-header-title h1 {
          font-size: 20px;
          font-weight: 500;
          margin: 0;
          color: #333333;
        }

        .page-header-title small {
          font-size: 12px;
          color: #777777;
          font-weight: 400;
          margin-left: 6px;
        }

        /* Content Body */
        .content-body {
          padding: 10px 15px 20px 15px;
        }

        .panel {
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-radius: 3px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        /* Panel Nav Tabs */
        .panel-heading-tabs {
          background-color: #f5f5f6;
          border-bottom: 1px solid #e7eaec;
          padding: 10px 10px 0 10px;
        }

        .nav-tabs {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          border-bottom: 1px solid transparent;
        }

        .nav-tabs > li {
          margin-bottom: -1px;
        }

        .nav-tabs > li > a {
          display: block;
          padding: 8px 16px;
          font-size: 13px;
          color: #555555;
          text-decoration: none;
          border: 1px solid transparent;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          background-color: #f5f5f6;
        }

        .nav-tabs > li.active > a {
          color: #333333;
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-bottom-color: #ffffff;
          border-top: 2px solid #18bc9c;
          font-weight: 600;
        }

        .panel-body {
          padding: 15px;
        }

        /* Search Filter Form */
        .form-commonsearch {
          background-color: #ffffff;
          padding-bottom: 15px;
          border-bottom: 1px dashed #e7eaec;
        }

        .search-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px 16px;
        }

        @media (max-width: 1200px) {
          .search-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .search-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          align-items: center;
          margin: 0;
        }

        .control-label {
          width: 75px;
          text-align: right;
          margin-right: 12px;
          font-size: 13px;
          font-weight: 500;
          color: #333333;
          flex-shrink: 0;
        }

        .control-input {
          flex: 1;
        }

        .form-control {
          width: 100%;
          height: 31px;
          padding: 4px 10px;
          font-size: 12px;
          line-height: 1.42857143;
          color: #555555;
          background-color: #ffffff;
          border: 1px solid #cccccc;
          border-radius: 2px;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          outline: none;
          box-sizing: border-box;
          transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
        }

        .form-control:focus {
          border-color: #18bc9c;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(24, 188, 156, 0.4);
        }

        .form-control::placeholder {
          color: #999999;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding-left: 87px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.42857143;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 3px;
          user-select: none;
          box-sizing: border-box;
          height: 31px;
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

        .btn-default {
          color: #333333;
          background-color: #ffffff;
          border-color: #cccccc;
        }

        .btn-default:hover {
          background-color: #e6e6e6;
          border-color: #adadad;
        }

        .btn-primary {
          color: #ffffff;
          background-color: #2c3e50;
          border-color: #2c3e50;
        }

        .btn-primary:hover {
          background-color: #1a252f;
        }

        .btn-add {
          gap: 4px;
        }

        /* Toolbar */
        .toolbar-container {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 15px 0 12px 0;
        }

        .btn-refresh {
          width: 32px;
          padding: 0;
        }

        /* Table */
        .table-responsive {
          min-height: 0.01%;
          overflow-x: auto;
          border: 1px solid #e7eaec;
          margin-bottom: 15px;
        }

        .table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          white-space: nowrap;
        }

        .table > thead > tr > th {
          vertical-align: middle;
          border-bottom: 2px solid #ddd;
          border-top: 0;
          border-left: 1px solid #e7eaec;
          border-right: 1px solid #e7eaec;
          padding: 8px 6px;
          line-height: 1.42857143;
          text-align: center;
          font-weight: 600;
          background-color: #f5f5f6;
          color: #333333;
        }

        .table > tbody > tr > td {
          padding: 6px 8px;
          line-height: 1.42857143;
          vertical-align: middle;
          border: 1px solid #e7eaec;
          text-align: center;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: #f9f9f9;
        }

        .table-hover > tbody > tr:hover {
          background-color: #f5f5f5;
        }

        .col-checkbox {
          width: 36px;
          text-align: center;
        }

        .col-avatar {
          width: 40px;
        }

        .avatar-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .col-account {
          font-weight: 500;
        }

        .badge-primary {
          background-color: #337ab7;
          color: #ffffff;
          padding: 2px 6px;
          font-size: 11px;
          border-radius: 2px;
          font-weight: normal;
        }

        .badge-outline-success {
          display: inline-block;
          color: #18bc9c;
          border: 1px solid #18bc9c;
          background-color: #e8f8f5;
          padding: 1px 6px;
          font-size: 11px;
          border-radius: 2px;
          font-weight: 500;
        }

        .text-right {
          text-align: right !important;
        }

        .col-operate-header {
          min-width: 480px;
        }

        .col-operate {
          text-align: left !important;
          padding: 4px 6px !important;
        }

        .btn-group-operate {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          flex-wrap: nowrap;
        }

        .btn-xs {
          padding: 2px 6px;
          font-size: 11px;
          line-height: 1.3;
          border-radius: 2px;
          height: 22px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          border: none;
          color: #ffffff;
          cursor: pointer;
          white-space: nowrap;
        }

        .btn-icon-only {
          padding: 2px 5px;
          gap: 0;
        }

        .btn-dark-blue {
          background-color: #2c3e50;
        }

        .btn-dark-blue:hover {
          background-color: #1a252f;
        }

        .btn-warning {
          background-color: #f39c12;
        }

        .btn-warning:hover {
          background-color: #e08e0b;
        }

        .btn-info {
          background-color: #00c0ef;
        }

        .btn-info:hover {
          background-color: #00acd6;
        }

        .btn-danger {
          background-color: #d9534f;
        }

        .btn-danger:hover {
          background-color: #c9302c;
        }

        /* Pagination */
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 5px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .pagination-info {
          font-size: 12px;
          color: #777777;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-size-select {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .page-size-control {
          width: 55px;
          height: 26px;
          padding: 2px 6px;
          font-size: 12px;
          display: inline-block;
        }

        .pagination {
          display: inline-flex;
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
          color: #333333;
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

        .pagination > li > a:hover {
          background-color: #eeeeee;
        }

        .pagination > .active > a,
        .pagination > .active > a:hover {
          z-index: 3;
          color: #ffffff;
          cursor: default;
          background-color: #2c3e50;
          border-color: #2c3e50;
        }

        .pagination > .disabled > span {
          color: #777777;
          cursor: not-allowed;
          background-color: #ffffff;
          border-color: #dddddd;
        }
      `}</style>
    </div>
  );
}
