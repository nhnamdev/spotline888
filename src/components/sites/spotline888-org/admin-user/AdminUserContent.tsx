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

  // Quick Message Templates (Mẫu tin nhắn nhanh)
  const MESSAGE_TEMPLATES = [
    {
      label: '充值到账',
      title: '充值成功通知',
      content: '尊敬的会员，您的充值申请已处理完成，款项已成功充入您的账户，请查收！如有任何疑问请随时联系在线客服。',
    },
    {
      label: '提现出款',
      title: '提现出款通知',
      content: '尊敬的会员，您的提现申请已审核通过并成功出款，请注意查收您的收款账户。感谢您的支持与信任！',
    },
    {
      label: '实名认证',
      title: '实名认证通过通知',
      content: '尊敬的会员，您的实名身份认证资料已成功通过审核，现已开通平台全部操作权限。',
    },
    {
      label: '安全提醒',
      title: '账户安全提醒',
      content: '尊敬的会员，请妥善保管好您的登录密码与资金安全密码，平台客服绝不会向您索取密码，切勿透露给他人。',
    },
    {
      label: '系统通知',
      title: '平台重要通知',
      content: '尊敬的会员，平台系统已完成全面升级，为您提供更极速、稳定的交易体验。祝您投资愉快！',
    },
  ];

  // Modal State for Sending System Message (发送系统消息)
  const [messageModal, setMessageModal] = useState<{
    isOpen: boolean;
    user: UserItem | null;
    title: string;
    content: string;
    activeTab: 'compose' | 'history';
    loading: boolean;
    history: Array<{ id: number; title: string; content: string; is_read: number; created_at: string }>;
    historyLoading: boolean;
  }>({
    isOpen: false,
    user: null,
    title: '系统通知',
    content: '',
    activeTab: 'compose',
    loading: false,
    history: [],
    historyLoading: false,
  });

  // Modal State for Customer Detail & Bank Info (会员详情与银行卡管理)
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    userItem: UserItem | null;
    userDetail: any | null;
    banks: any[];
    verify: any | null;
    activeTab: 'basic' | 'bank';
    loading: boolean;
    savingUser: boolean;
    savingBank: boolean;
    isEditingBank: boolean;
    bankForm: {
      bankId?: number;
      type: 'bank' | 'usdt_trc20' | 'usdt_erc20';
      bank_name: string;
      bank_branch: string;
      card_number: string;
      account_holder: string;
      nationality: string;
      is_default: boolean;
    };
    userForm: {
      real_name: string;
      phone: string;
      remark: string;
      credit_score: number;
      status: number;
      level: number;
      kong_style: number;
    };
  }>({
    isOpen: false,
    userItem: null,
    userDetail: null,
    banks: [],
    verify: null,
    activeTab: 'basic',
    loading: false,
    savingUser: false,
    savingBank: false,
    isEditingBank: false,
    bankForm: {
      type: 'bank',
      bank_name: '',
      bank_branch: '',
      card_number: '',
      account_holder: '',
      nationality: 'Vietnam',
      is_default: true,
    },
    userForm: {
      real_name: '',
      phone: '',
      remark: '',
      credit_score: 100,
      status: 1,
      level: 1,
      kong_style: 0,
    },
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
      console.error('加载用户列表失败:', err);
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
      alert('请输入有效的金额 (> 0)');
      return;
    }

    setBalanceModal(prev => ({ ...prev, loading: true }));
    try {
      const res = await adminApi.adjustBalance({
        userId: balanceModal.user.uid,
        amount: numAmount,
        type: balanceModal.type,
        memo: balanceModal.memo || (balanceModal.type === 'add' ? `管理员加款: +${numAmount}` : `管理员扣款: -${numAmount}`),
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
        showToast('success', `调整余额成功！当前余额: ${newBalance} $`);
      } else {
        alert(res?.msg || '调整余额失败');
        setBalanceModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err: any) {
      alert('网络连接错误: ' + err.message);
      setBalanceModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleConfirmCredit = async () => {
    if (!creditModal.user) return;
    const numScore = parseFloat(creditModal.score);
    if (isNaN(numScore)) {
      alert('请输入有效的分值');
      return;
    }

    setCreditModal(prev => ({ ...prev, loading: true }));
    try {
      const res = await adminApi.adjustCreditScore({
        userId: creditModal.user.uid,
        score: numScore,
        type: creditModal.type,
        memo: creditModal.memo || `调整信誉分 (${creditModal.type}): ${numScore}`,
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
        showToast('success', `信誉分更新成功！当前分值: ${newScore}/100`);
      } else {
        alert(res?.msg || '调整信誉分失败');
        setCreditModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err: any) {
      alert('网络连接错误: ' + err.message);
      setCreditModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleOpenMessageModal = (user: UserItem) => {
    setMessageModal({
      isOpen: true,
      user,
      title: '系统通知',
      content: '',
      activeTab: 'compose',
      loading: false,
      history: [],
      historyLoading: false,
    });
  };

  const handleFetchMessageHistory = async (userId: number) => {
    setMessageModal(prev => ({ ...prev, historyLoading: true }));
    try {
      const res = await (adminApi as any).getUserMessages(userId);
      if (res && res.code === 1 && Array.isArray(res.data)) {
        setMessageModal(prev => ({ ...prev, history: res.data, historyLoading: false }));
      } else {
        setMessageModal(prev => ({ ...prev, historyLoading: false }));
      }
    } catch {
      setMessageModal(prev => ({ ...prev, historyLoading: false }));
    }
  };

  const handleSendMessage = async () => {
    if (!messageModal.user) return;
    const content = messageModal.content.trim();
    if (!content) {
      alert('请输入消息内容');
      return;
    }

    setMessageModal(prev => ({ ...prev, loading: true }));
    try {
      const res = await (adminApi as any).sendMessage({
        userId: messageModal.user.uid,
        title: messageModal.title.trim() || '系统通知',
        content,
      });

      if (res && res.code === 1) {
        showToast('success', `已成功发送消息给【${messageModal.user.account}】！`);
        setMessageModal(prev => ({
          ...prev,
          isOpen: false,
          user: null,
          title: '系统通知',
          content: '',
          loading: false,
        }));
      } else {
        alert(res?.msg || '发送消息失败，请重试');
        setMessageModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err: any) {
      alert('发送消息出错: ' + (err.message || '网络连接异常'));
      setMessageModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteMessage = async (msgId: number) => {
    if (!confirm('确定要删除此条消息吗？')) return;
    try {
      const res = await (adminApi as any).deleteMessage(msgId);
      if (res && res.code === 1) {
        setMessageModal(prev => ({
          ...prev,
          history: prev.history.filter(m => m.id !== msgId),
        }));
        showToast('success', '删除消息成功');
      } else {
        alert(res?.msg || '删除消息失败');
      }
    } catch {
      alert('删除消息失败');
    }
  };

  const handleOpenDetailModal = async (user: UserItem) => {
    setDetailModal({
      isOpen: true,
      userItem: user,
      userDetail: null,
      banks: [],
      verify: null,
      activeTab: 'basic',
      loading: true,
      savingUser: false,
      savingBank: false,
      isEditingBank: false,
      bankForm: {
        type: 'bank',
        bank_name: '',
        bank_branch: '',
        card_number: '',
        account_holder: user.realName || '',
        nationality: 'Vietnam',
        is_default: true,
      },
      userForm: {
        real_name: user.realName || '',
        phone: user.phone || '',
        remark: '',
        credit_score: user.creditScore ?? 100,
        status: 1,
        level: 1,
        kong_style: 0,
      },
    });

    try {
      const res = await adminApi.getUserDetail(user.uid);
      if (res.code === 1 && res.data) {
        const u = res.data.user || {};
        const b = res.data.banks || [];
        const v = res.data.verify || null;
        setDetailModal(prev => ({
          ...prev,
          loading: false,
          userDetail: u,
          banks: b,
          verify: v,
          userForm: {
            real_name: u.real_name || user.realName || '',
            phone: u.phone || user.phone || '',
            remark: u.remark || '',
            credit_score: u.credit_score !== undefined ? Number(u.credit_score) : 100,
            status: u.status !== undefined ? Number(u.status) : 1,
            level: u.level !== undefined ? Number(u.level) : 1,
            kong_style: u.kong_style !== undefined ? Number(u.kong_style) : 0,
          },
          bankForm: {
            type: 'bank',
            bank_name: '',
            bank_branch: '',
            card_number: '',
            account_holder: u.real_name || user.realName || '',
            nationality: 'Vietnam',
            is_default: b.length === 0,
          },
        }));
      } else {
        setDetailModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err: any) {
      console.error('加载会员详情失败:', err);
      setDetailModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSaveUserDetail = async () => {
    if (!detailModal.userItem) return;
    try {
      setDetailModal(prev => ({ ...prev, savingUser: true }));
      const res = await adminApi.updateUserDetail(detailModal.userItem.uid, detailModal.userForm);
      if (res.code === 1) {
        showToast('success', '保存会员信息成功！');
        setUsers(prev => prev.map(u => u.uid === detailModal.userItem!.uid ? {
          ...u,
          realName: detailModal.userForm.real_name,
          phone: detailModal.userForm.phone,
          creditScore: detailModal.userForm.credit_score,
        } : u));
        setDetailModal(prev => ({ ...prev, savingUser: false }));
      } else {
        alert(res?.msg || '保存会员信息失败');
        setDetailModal(prev => ({ ...prev, savingUser: false }));
      }
    } catch (err: any) {
      alert('保存失败: ' + err.message);
      setDetailModal(prev => ({ ...prev, savingUser: false }));
    }
  };

  const handleStartAddBank = () => {
    setDetailModal(prev => ({
      ...prev,
      isEditingBank: true,
      bankForm: {
        bankId: undefined,
        type: 'bank',
        bank_name: '',
        bank_branch: '',
        card_number: '',
        account_holder: prev.userForm.real_name || prev.userItem?.realName || '',
        nationality: 'Vietnam',
        is_default: prev.banks.length === 0,
      },
    }));
  };

  const handleStartEditBank = (bank: any) => {
    setDetailModal(prev => ({
      ...prev,
      isEditingBank: true,
      bankForm: {
        bankId: bank.id,
        type: bank.type || 'bank',
        bank_name: bank.bank_name || '',
        bank_branch: bank.bank_branch || '',
        card_number: bank.card_number || '',
        account_holder: bank.account_holder || '',
        nationality: bank.nationality || 'Vietnam',
        is_default: Boolean(bank.is_default),
      },
    }));
  };

  const handleSaveBank = async () => {
    if (!detailModal.userItem) return;
    if (!detailModal.bankForm.card_number.trim()) {
      alert('请输入卡号或钱包地址');
      return;
    }
    try {
      setDetailModal(prev => ({ ...prev, savingBank: true }));
      const res = await adminApi.saveUserBank(detailModal.userItem.uid, detailModal.bankForm);
      if (res.code === 1) {
        showToast('success', detailModal.bankForm.bankId ? '修改银行卡成功！' : '添加银行卡成功！');
        setDetailModal(prev => ({
          ...prev,
          banks: res.data || prev.banks,
          isEditingBank: false,
          savingBank: false,
        }));
      } else {
        alert(res?.msg || '保存银行卡失败');
        setDetailModal(prev => ({ ...prev, savingBank: false }));
      }
    } catch (err: any) {
      alert('保存失败: ' + err.message);
      setDetailModal(prev => ({ ...prev, savingBank: false }));
    }
  };

  const handleDeleteBank = async (bankId: number) => {
    if (!detailModal.userItem) return;
    if (!confirm('确定要删除该银行卡/钱包地址吗？')) return;
    try {
      const res = await adminApi.saveUserBank(detailModal.userItem.uid, {
        action: 'delete',
        bankId,
      });
      if (res.code === 1) {
        showToast('success', '删除银行卡成功！');
        setDetailModal(prev => ({
          ...prev,
          banks: res.data || prev.banks.filter(b => b.id !== bankId),
          isEditingBank: prev.bankForm.bankId === bankId ? false : prev.isEditingBank,
        }));
      } else {
        alert(res?.msg || '删除失败');
      }
    } catch (err: any) {
      alert('删除失败: ' + err.message);
    }
  };


  return (
    <div className="user-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> 控制台
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
                  <label className="control-label">账号/ID</label>
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
                      <option value="Choose">选择</option>
                      <option value="1">客户</option>
                      <option value="2">代理</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="control-label">手机号</label>
                  <div className="control-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="手机号"
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
                      <option value="Choose">选择</option>
                      <option value="0">正常</option>
                      <option value="1">风控</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="control-label">状态</label>
                  <div className="control-input">
                    <select
                      className="form-control"
                      value={searchForm.status}
                      onChange={(e) =>
                        setSearchForm({ ...searchForm, status: e.target.value })
                      }
                    >
                      <option value="Choose">选择</option>
                      <option value="1">正常</option>
                      <option value="0">禁用</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit & Reset Buttons */}
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  提交
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
                title="刷新"
                onClick={() => fetchUsers()}
              >
                <i className="fa fa-refresh"></i>
              </button>
              <button type="button" className="btn btn-success btn-add">
                <i className="fa fa-plus"></i> 添加
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
                    <th>ID</th>
                    <th>会员头像</th>
                    <th>账号</th>
                    <th>真实姓名</th>
                    <th>账号类型</th>
                    <th>手机号</th>
                    <th>职业</th>
                    <th>实名状态</th>
                    <th>
                      余额 <i className="fa fa-sort text-muted"></i>
                    </th>
                    <th>USDT余额</th>
                    <th>信誉分</th>
                    <th className="col-operate-header">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8 text-gray-500">
                        <i className="fa fa-refresh fa-spin mr-2"></i> 正在加载会员数据...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8 text-gray-400">
                        暂无数据
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
                              title="查看会员详情及银行卡资料"
                              onClick={() => handleOpenDetailModal(user)}
                            >
                              <i className="fa fa-list"></i> 详情
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-dark-blue"
                              title="发送系统消息给该会员"
                              onClick={() => handleOpenMessageModal(user)}
                            >
                              <i className="fa fa-comment"></i> 发送消息
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-warning"
                              title="修改余额 / 上下分"
                              onClick={() => setBalanceModal({
                                isOpen: true,
                                user,
                                type: 'add',
                                amount: '',
                                memo: '',
                                loading: false,
                              })}
                            >
                              <i className="fa fa-shopping-cart"></i> 上下分
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
                              title="调整信誉分"
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
                              title="编辑会员详情及银行卡"
                              onClick={() => handleOpenDetailModal(user)}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs btn-danger btn-icon-only"
                              title="删除"
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
                    上一页
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
                    下一页
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

      {/* Modal 会员余额调整 (上下分) */}
      {balanceModal.isOpen && balanceModal.user && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa fa-shopping-cart" style={{ color: '#f39c12' }}></i>
                会员余额调整 (上下分)
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
                  <span className="info-label">账号:</span>
                  <strong className="info-value">{balanceModal.user.account}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">UID:</span>
                  <strong className="info-value">{balanceModal.user.uid}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">当前余额:</span>
                  <strong className="info-value" style={{ color: '#18bc9c' }}>$ {balanceModal.user.money}</strong>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">操作类型 <span style={{ color: '#e74c3c' }}>*</span></label>
                <div className="radio-button-group">
                  <label className={`radio-pill ${balanceModal.type === 'add' ? 'active add' : ''}`}>
                    <input 
                      type="radio" 
                      name="balanceType" 
                      value="add" 
                      checked={balanceModal.type === 'add'} 
                      onChange={() => setBalanceModal(prev => ({ ...prev, type: 'add' }))}
                    />
                    <i className="fa fa-plus-circle"></i> 加款 (+)
                  </label>
                  <label className={`radio-pill ${balanceModal.type === 'sub' ? 'active sub' : ''}`}>
                    <input 
                      type="radio" 
                      name="balanceType" 
                      value="sub" 
                      checked={balanceModal.type === 'sub'} 
                      onChange={() => setBalanceModal(prev => ({ ...prev, type: 'sub' }))}
                    />
                    <i className="fa fa-minus-circle"></i> 扣款 (-)
                  </label>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">调整金额 ($) <span style={{ color: '#e74c3c' }}>*</span></label>
                <input 
                  type="number" 
                  className="modal-input" 
                  placeholder="输入金额 (例如: 1000)"
                  min="0.01"
                  step="any"
                  value={balanceModal.amount}
                  onChange={(e) => setBalanceModal(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">备注说明</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="输入调整备注 (选填)"
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
                取消
              </button>
              <button 
                type="button" 
                className="btn btn-success"
                disabled={balanceModal.loading}
                onClick={handleConfirmBalance}
              >
                {balanceModal.loading ? '处理中...' : '确定调整'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 信誉分调整 */}
      {creditModal.isOpen && creditModal.user && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa fa-star" style={{ color: '#f39c12' }}></i>
                信誉分调整
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
                  <span className="info-label">账号:</span>
                  <strong className="info-value">{creditModal.user.account}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">UID:</span>
                  <strong className="info-value">{creditModal.user.uid}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">当前分值:</span>
                  <strong className="info-value" style={{ color: '#f39c12' }}>{creditModal.user.creditScore ?? 100} / 100</strong>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">操作类型 <span style={{ color: '#e74c3c' }}>*</span></label>
                <div className="radio-button-group">
                  <label className={`radio-pill ${creditModal.type === 'add' ? 'active add' : ''}`}>
                    <input 
                      type="radio" 
                      name="creditType" 
                      value="add" 
                      checked={creditModal.type === 'add'} 
                      onChange={() => setCreditModal(prev => ({ ...prev, type: 'add' }))}
                    />
                    <i className="fa fa-plus-circle"></i> 增加分值 (+)
                  </label>
                  <label className={`radio-pill ${creditModal.type === 'sub' ? 'active sub' : ''}`}>
                    <input 
                      type="radio" 
                      name="creditType" 
                      value="sub" 
                      checked={creditModal.type === 'sub'} 
                      onChange={() => setCreditModal(prev => ({ ...prev, type: 'sub' }))}
                    />
                    <i className="fa fa-minus-circle"></i> 扣除分值 (-)
                  </label>
                  <label className={`radio-pill ${creditModal.type === 'set' ? 'active' : ''}`} style={creditModal.type === 'set' ? { borderColor: '#3498db', backgroundColor: '#ebf5fb', color: '#2980b9' } : {}}>
                    <input 
                      type="radio" 
                      name="creditType" 
                      value="set" 
                      checked={creditModal.type === 'set'} 
                      onChange={() => setCreditModal(prev => ({ ...prev, type: 'set' }))}
                    />
                    <i className="fa fa-pencil"></i> 设定分值 (=)
                  </label>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">
                  {creditModal.type === 'set' ? '设定目标分值 (0 - 100)' : '调整分值'}{' '}
                  <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input 
                  type="number" 
                  className="modal-input" 
                  placeholder="输入分值 (例如: 10)"
                  min="0"
                  max="100"
                  value={creditModal.score}
                  onChange={(e) => setCreditModal(prev => ({ ...prev, score: e.target.value }))}
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">备注说明</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="输入调整备注 (选填)"
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
                取消
              </button>
              <button 
                type="button" 
                className="btn btn-warning"
                style={{ color: '#fff', backgroundColor: '#f39c12', borderColor: '#e08e0b' }}
                disabled={creditModal.loading}
                onClick={handleConfirmCredit}
              >
                {creditModal.loading ? '处理中...' : '确定修改'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 发送系统消息 (Gửi tin nhắn hệ thống) */}
      {messageModal.isOpen && messageModal.user && (
        <div className="modal-backdrop">
          <div className="modal-box modal-box-large">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa fa-comment" style={{ color: '#2c3e50' }}></i>
                发送系统消息
              </h3>
              <button 
                type="button" 
                className="close-btn"
                onClick={() => setMessageModal(prev => ({ ...prev, isOpen: false, user: null }))}
              >
                &times;
              </button>
            </div>

            {/* Modal Subtabs: 编辑发送 / 历史消息 */}
            <div className="modal-subnav">
              <button
                type="button"
                className={`modal-subnav-tab ${messageModal.activeTab === 'compose' ? 'active' : ''}`}
                onClick={() => setMessageModal(prev => ({ ...prev, activeTab: 'compose' }))}
              >
                <i className="fa fa-pencil-square-o"></i> 编辑发送
              </button>
              <button
                type="button"
                className={`modal-subnav-tab ${messageModal.activeTab === 'history' ? 'active' : ''}`}
                onClick={() => {
                  setMessageModal(prev => ({ ...prev, activeTab: 'history' }));
                  handleFetchMessageHistory(messageModal.user!.uid);
                }}
              >
                <i className="fa fa-history"></i> 历史消息
              </button>
            </div>

            <div className="modal-body">
              {/* Recipient User Badge */}
              <div className="info-badge-row">
                <div className="info-item">
                  <span className="info-label">接收账号:</span>
                  <strong className="info-value" style={{ color: '#2c3e50', fontWeight: 700 }}>
                    {messageModal.user.account}
                  </strong>
                </div>
                <div className="info-item">
                  <span className="info-label">用户UID:</span>
                  <strong className="info-value">{messageModal.user.uid}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">姓名 / 类型:</span>
                  <strong className="info-value">{messageModal.user.realName} ({messageModal.user.accountType})</strong>
                </div>
              </div>

              {messageModal.activeTab === 'compose' ? (
                <>
                  {/* Quick Templates */}
                  <div className="form-field-group">
                    <label className="field-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>快捷消息模板 (点击快速套用)</span>
                    </label>
                    <div className="template-chips-wrap">
                      {MESSAGE_TEMPLATES.map((tpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="template-chip"
                          onClick={() => {
                            setMessageModal(prev => ({
                              ...prev,
                              title: tpl.title,
                              content: tpl.content,
                            }));
                          }}
                        >
                          <i className="fa fa-tag"></i> {tpl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Title */}
                  <div className="form-field-group">
                    <label className="field-label">
                      消息标题 <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="modal-input" 
                      placeholder="输入消息标题 (例如: 充值成功通知)"
                      value={messageModal.title}
                      onChange={(e) => setMessageModal(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  {/* Message Content */}
                  <div className="form-field-group">
                    <label className="field-label">
                      消息内容 <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <textarea 
                      className="modal-textarea" 
                      rows={5}
                      placeholder="输入发送给会员的系统消息内容..."
                      value={messageModal.content}
                      onChange={(e) => setMessageModal(prev => ({ ...prev, content: e.target.value }))}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#999' }}>{messageModal.content.length} 字</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Message History Tab */
                <div className="message-history-container">
                  {messageModal.historyLoading ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#888' }}>
                      <i className="fa fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                      正在读取历史消息...
                    </div>
                  ) : messageModal.history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#999', fontSize: 13 }}>
                      <i className="fa fa-envelope-o" style={{ fontSize: 24, display: 'block', marginBottom: 8, color: '#ccc' }}></i>
                      暂无发给该会员的历史系统消息
                    </div>
                  ) : (
                    <div className="message-history-list">
                      {messageModal.history.map((item) => (
                        <div key={item.id} className="history-item-card">
                          <div className="history-header">
                            <span className="history-title">{item.title}</span>
                            <div className="history-meta">
                              <span className={`badge-read-status ${item.is_read ? 'read' : 'unread'}`}>
                                {item.is_read ? '用户已读' : '用户未读'}
                              </span>
                              <span className="history-time">{item.created_at}</span>
                              <button
                                type="button"
                                className="history-del-btn"
                                title="删除此消息"
                                onClick={() => handleDeleteMessage(item.id)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          <p className="history-content">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-default"
                disabled={messageModal.loading}
                onClick={() => setMessageModal(prev => ({ ...prev, isOpen: false, user: null }))}
              >
                取消
              </button>
              {messageModal.activeTab === 'compose' ? (
                <button 
                  type="button" 
                  className="btn btn-dark-blue"
                  style={{ color: '#fff', backgroundColor: '#2c3e50', borderColor: '#1a252f', minWidth: 100 }}
                  disabled={messageModal.loading}
                  onClick={handleSendMessage}
                >
                  {messageModal.loading ? (
                    <>
                      <i className="fa fa-spinner fa-spin mr-1"></i> 发送中...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-paper-plane mr-1"></i> 确定发送
                    </>
                  )}
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setMessageModal(prev => ({ ...prev, activeTab: 'compose' }))}
                >
                  <i className="fa fa-pencil"></i> 发送新消息
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 会员详情与银行卡管理 */}
      {detailModal.isOpen && detailModal.userItem && (
        <div className="modal-backdrop">
          <div className="modal-box modal-box-detail">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa fa-id-card-o" style={{ color: '#18bc9c' }}></i>
                会员详情与资料编辑 - {detailModal.userItem.account} (UID: {detailModal.userItem.uid})
              </h3>
              <button 
                type="button" 
                className="close-btn"
                onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false, userItem: null }))}
              >
                &times;
              </button>
            </div>

            {/* Subnav Tabs */}
            <div className="modal-subnav">
              <button
                type="button"
                className={`modal-subnav-tab ${detailModal.activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setDetailModal(prev => ({ ...prev, activeTab: 'basic' }))}
              >
                <i className="fa fa-user"></i> 基本资料与风控
              </button>
              <button
                type="button"
                className={`modal-subnav-tab ${detailModal.activeTab === 'bank' ? 'active' : ''}`}
                onClick={() => setDetailModal(prev => ({ ...prev, activeTab: 'bank' }))}
              >
                <i className="fa fa-credit-card"></i> 银行卡 / USDT 地址 ({detailModal.banks.length})
              </button>
            </div>

            <div className="modal-body modal-body-scroll">
              {detailModal.loading ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: '#666' }}>
                  <i className="fa fa-refresh fa-spin mr-2"></i> 正在加载会员资料...
                </div>
              ) : detailModal.activeTab === 'basic' ? (
                <div>
                  {/* Account Overview Cards */}
                  <div className="info-badge-row" style={{ flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    <div className="info-item">
                      <span className="info-label">会员账号:</span>
                      <strong className="info-value" style={{ color: '#2c3e50' }}>{detailModal.userItem.account}</strong>
                    </div>
                    <div className="info-item">
                      <span className="info-label">UID:</span>
                      <strong className="info-value">{detailModal.userItem.uid}</strong>
                    </div>
                    <div className="info-item">
                      <span className="info-label">现金余额:</span>
                      <strong className="info-value" style={{ color: '#18bc9c' }}>$ {detailModal.userDetail?.money ?? detailModal.userItem.money}</strong>
                    </div>
                    <div className="info-item">
                      <span className="info-label">USDT余额:</span>
                      <strong className="info-value" style={{ color: '#2980b9' }}>{detailModal.userDetail?.usdt ?? detailModal.userItem.usdtBalance} USDT</strong>
                    </div>
                    <div className="info-item">
                      <span className="info-label">冻结资金:</span>
                      <strong className="info-value" style={{ color: '#e74c3c' }}>$ {detailModal.userDetail?.freeze_funds ?? 0}</strong>
                    </div>
                    <div className="info-item">
                      <span className="info-label">实名状态:</span>
                      <strong className="info-value" style={{ color: detailModal.userDetail?.is_auth === 2 ? '#18bc9c' : '#f39c12' }}>
                        {detailModal.userDetail?.is_auth === 2 ? '已实名' : detailModal.userDetail?.is_auth === 1 ? '待审核' : '未认证'}
                      </strong>
                    </div>
                    <div className="info-item">
                      <span className="info-label">注册IP:</span>
                      <span className="info-value">{detailModal.userDetail?.reg_ip || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">注册时间:</span>
                      <span className="info-value">{detailModal.userDetail?.reg_time || detailModal.userDetail?.created_at || '-'}</span>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div className="form-field-group">
                      <label className="field-label">真实姓名</label>
                      <input
                        type="text"
                        className="modal-input"
                        value={detailModal.userForm.real_name}
                        onChange={(e) => setDetailModal(prev => ({
                          ...prev,
                          userForm: { ...prev.userForm, real_name: e.target.value }
                        }))}
                        placeholder="输入客户真实姓名"
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">手机号码</label>
                      <input
                        type="text"
                        className="modal-input"
                        value={detailModal.userForm.phone}
                        onChange={(e) => setDetailModal(prev => ({
                          ...prev,
                          userForm: { ...prev.userForm, phone: e.target.value }
                        }))}
                        placeholder="输入客户手机号码"
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">信用评分 (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="modal-input"
                        value={detailModal.userForm.credit_score}
                        onChange={(e) => setDetailModal(prev => ({
                          ...prev,
                          userForm: { ...prev.userForm, credit_score: Number(e.target.value) }
                        }))}
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">账号状态</label>
                      <select
                        className="modal-input"
                        value={detailModal.userForm.status}
                        onChange={(e) => setDetailModal(prev => ({
                          ...prev,
                          userForm: { ...prev.userForm, status: Number(e.target.value) }
                        }))}
                      >
                        <option value={1}>正常开启</option>
                        <option value={0}>已禁用锁定</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">单控风格 (交易胜负)</label>
                      <select
                        className="modal-input"
                        value={detailModal.userForm.kong_style}
                        onChange={(e) => setDetailModal(prev => ({
                          ...prev,
                          userForm: { ...prev.userForm, kong_style: Number(e.target.value) }
                        }))}
                      >
                        <option value={0}>自然随机 (平台默认)</option>
                        <option value={1}>强制必赢 (100%盈利)</option>
                        <option value={2}>强制必输 (100%亏损)</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">会员等级</label>
                      <select
                        className="modal-input"
                        value={detailModal.userForm.level}
                        onChange={(e) => setDetailModal(prev => ({
                          ...prev,
                          userForm: { ...prev.userForm, level: Number(e.target.value) }
                        }))}
                      >
                        <option value={1}>普通会员</option>
                        <option value={2}>VIP 银卡会员</option>
                        <option value={3}>VIP 金卡会员</option>
                        <option value={4}>VIP 钻石会员</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field-group" style={{ marginTop: '10px' }}>
                    <label className="field-label">管理员备注 (内部)</label>
                    <textarea
                      className="modal-textarea"
                      rows={2}
                      value={detailModal.userForm.remark}
                      onChange={(e) => setDetailModal(prev => ({
                        ...prev,
                        userForm: { ...prev.userForm, remark: e.target.value }
                      }))}
                      placeholder="内部管理备注信息..."
                    />
                  </div>
                </div>
              ) : (
                /* Tab 2: 银行卡 / USDT 地址管理 */
                <div>
                  {detailModal.isEditingBank ? (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2c3e50' }}>
                          <i className="fa fa-pencil-square mr-1"></i>
                          {detailModal.bankForm.bankId ? '编辑银行卡 / 钱包地址' : '添加新的收款银行卡 / 钱包地址'}
                        </h4>
                        <button
                          type="button"
                          className="btn btn-default btn-xs"
                          onClick={() => setDetailModal(prev => ({ ...prev, isEditingBank: false }))}
                        >
                          返回列表
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                        <div className="form-field-group">
                          <label className="field-label">账户类型 <span style={{ color: '#e74c3c' }}>*</span></label>
                          <select
                            className="modal-input"
                            value={detailModal.bankForm.type}
                            onChange={(e) => setDetailModal(prev => ({
                              ...prev,
                              bankForm: { ...prev.bankForm, type: e.target.value as any }
                            }))}
                          >
                            <option value="bank">银行卡 (Bank Card)</option>
                            <option value="usdt_trc20">USDT (TRC20)</option>
                            <option value="usdt_erc20">USDT (ERC20)</option>
                          </select>
                        </div>

                        <div className="form-field-group">
                          <label className="field-label">
                            {detailModal.bankForm.type === 'bank' ? '开户银行名称' : '网络协议'} <span style={{ color: '#e74c3c' }}>*</span>
                          </label>
                          <input
                            type="text"
                            className="modal-input"
                            value={detailModal.bankForm.bank_name}
                            onChange={(e) => setDetailModal(prev => ({
                              ...prev,
                              bankForm: { ...prev.bankForm, bank_name: e.target.value }
                            }))}
                            placeholder={detailModal.bankForm.type === 'bank' ? "例如: Vietcombank, ICBC..." : "TRC20 / ERC20"}
                          />
                        </div>

                        <div className="form-field-group">
                          <label className="field-label">开户人姓名 <span style={{ color: '#e74c3c' }}>*</span></label>
                          <input
                            type="text"
                            className="modal-input"
                            value={detailModal.bankForm.account_holder}
                            onChange={(e) => setDetailModal(prev => ({
                              ...prev,
                              bankForm: { ...prev.bankForm, account_holder: e.target.value }
                            }))}
                            placeholder="持卡人姓名"
                          />
                        </div>

                        <div className="form-field-group">
                          <label className="field-label">开户支行 / 备注</label>
                          <input
                            type="text"
                            className="modal-input"
                            value={detailModal.bankForm.bank_branch}
                            onChange={(e) => setDetailModal(prev => ({
                              ...prev,
                              bankForm: { ...prev.bankForm, bank_branch: e.target.value }
                            }))}
                            placeholder="例如: 河内分行 / 无"
                          />
                        </div>
                      </div>

                      <div className="form-field-group" style={{ marginTop: '10px' }}>
                        <label className="field-label">
                          {detailModal.bankForm.type === 'bank' ? '银行卡号' : 'USDT 钱包地址'} <span style={{ color: '#e74c3c' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="modal-input"
                          style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '14px' }}
                          value={detailModal.bankForm.card_number}
                          onChange={(e) => setDetailModal(prev => ({
                            ...prev,
                            bankForm: { ...prev.bankForm, card_number: e.target.value }
                          }))}
                          placeholder={detailModal.bankForm.type === 'bank' ? "输入银行卡账号" : "输入以T或0x开头的钱包地址"}
                        />
                      </div>

                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          id="is_default_check"
                          checked={detailModal.bankForm.is_default}
                          onChange={(e) => setDetailModal(prev => ({
                            ...prev,
                            bankForm: { ...prev.bankForm, is_default: e.target.checked }
                          }))}
                        />
                        <label htmlFor="is_default_check" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer', margin: 0 }}>
                          设为默认提现账户
                        </label>
                      </div>

                      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={() => setDetailModal(prev => ({ ...prev, isEditingBank: false }))}
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={detailModal.savingBank}
                          onClick={handleSaveBank}
                        >
                          {detailModal.savingBank ? (
                            <>
                              <i className="fa fa-spinner fa-spin mr-1"></i> 保存中...
                            </>
                          ) : (
                            <>
                              <i className="fa fa-check mr-1"></i> 保存账户信息
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                          当前已绑定 <strong style={{ color: '#2c3e50' }}>{detailModal.banks.length}</strong> 个提现账户
                        </span>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={handleStartAddBank}
                        >
                          <i className="fa fa-plus mr-1"></i> 添加银行卡 / USDT
                        </button>
                      </div>

                      {detailModal.banks.length === 0 ? (
                        <div style={{ padding: '30px 0', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                          <i className="fa fa-credit-card" style={{ fontSize: '28px', color: '#cbd5e1', marginBottom: '8px', display: 'block' }}></i>
                          该客户尚未绑定任何银行卡或USDT钱包地址
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {detailModal.banks.map((b: any) => (
                            <div
                              key={b.id}
                              style={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '14px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                  <span
                                    className="badge"
                                    style={{
                                      backgroundColor: b.type === 'bank' ? '#3498db' : '#16a085',
                                      color: '#fff',
                                      fontSize: '11px',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    {b.type === 'bank' ? '银行卡' : b.type?.toUpperCase()}
                                  </span>
                                  {Boolean(b.is_default) && (
                                    <span
                                      className="badge"
                                      style={{
                                        backgroundColor: '#f39c12',
                                        color: '#fff',
                                        fontSize: '11px',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                      }}
                                    >
                                      默认
                                    </span>
                                  )}
                                  <strong style={{ fontSize: '14px', color: '#1e293b' }}>
                                    {b.bank_name || (b.type === 'bank' ? '银行' : 'USDT')}
                                  </strong>
                                </div>

                                <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 600, color: '#2563eb', marginBottom: '4px' }}>
                                  {b.card_number}
                                </div>

                                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '14px' }}>
                                  <span><i className="fa fa-user mr-1"></i> 开户人: <strong>{b.account_holder || '-'}</strong></span>
                                  {b.bank_branch && <span><i className="fa fa-building mr-1"></i> 开户行: {b.bank_branch}</span>}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  className="btn btn-default btn-xs"
                                  title="修改"
                                  onClick={() => handleStartEditBank(b)}
                                >
                                  <i className="fa fa-pencil mr-1"></i> 修改
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-xs"
                                  title="删除"
                                  onClick={() => handleDeleteBank(b.id)}
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn btn-default"
                onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false, userItem: null }))}
              >
                关闭
              </button>

              {detailModal.activeTab === 'basic' && (
                <button 
                  type="button" 
                  className="btn btn-success"
                  disabled={detailModal.savingUser}
                  onClick={handleSaveUserDetail}
                >
                  {detailModal.savingUser ? (
                    <>
                      <i className="fa fa-spinner fa-spin mr-1"></i> 保存中...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check mr-1"></i> 保存基本资料
                    </>
                  )}
                </button>
              )}
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

        .modal-box-large {
          max-width: 580px;
        }

        .modal-box-detail {
          max-width: 680px;
          width: 95%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .modal-body-scroll {
          overflow-y: auto;
          max-height: calc(90vh - 120px);
          padding: 16px 20px;
        }

        .modal-subnav {
          display: flex;
          background-color: #eef2f7;
          border-bottom: 1px solid #d2d6de;
          padding: 0 15px;
          gap: 5px;
        }

        .modal-subnav-tab {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          border: none;
          background: transparent;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .modal-subnav-tab:hover {
          color: #2c3e50;
        }

        .modal-subnav-tab.active {
          color: #2c3e50;
          font-weight: 600;
          border-bottom-color: #2c3e50;
          background-color: #fff;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        .template-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }

        .template-chip {
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 12px;
          border: 1px solid #dcdcdc;
          background: #ffffff;
          color: #444444;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s ease-in-out;
        }

        .template-chip:hover {
          background-color: #2c3e50;
          color: #ffffff;
          border-color: #2c3e50;
        }

        .modal-textarea {
          width: 100%;
          min-height: 100px;
          padding: 8px 12px;
          font-size: 13px;
          line-height: 1.5;
          border: 1px solid #cccccc;
          border-radius: 4px;
          outline: none;
          resize: vertical;
          box-sizing: border-box;
          font-family: inherit;
        }

        .modal-textarea:focus {
          border-color: #2c3e50;
          box-shadow: 0 0 5px rgba(44, 62, 80, 0.3);
        }

        /* Message History */
        .message-history-container {
          max-height: 340px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .message-history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item-card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 14px;
          background-color: #f8fafc;
          transition: all 0.15s;
        }

        .history-item-card:hover {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
        }

        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .history-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .history-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badge-read-status {
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 2px;
          font-weight: 500;
        }

        .badge-read-status.read {
          background-color: #e2e8f0;
          color: #64748b;
        }

        .badge-read-status.unread {
          background-color: #fee2e2;
          color: #dc2626;
        }

        .history-time {
          font-size: 11px;
          color: #94a3b8;
        }

        .history-del-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px 4px;
          font-size: 12px;
          border-radius: 2px;
          transition: color 0.15s;
        }

        .history-del-btn:hover {
          color: #ef4444;
        }

        .history-content {
          margin: 0;
          font-size: 12.5px;
          color: #475569;
          line-height: 1.5;
          white-space: pre-wrap;
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
