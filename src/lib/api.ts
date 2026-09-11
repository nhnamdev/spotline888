/**
 * Spotline888 API Client
 * Cung cấp các hàm gọi API tập trung cho cả phân hệ User và Admin
 */

export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
  time?: number;
}

// Lấy base URL phù hợp cho Next.js Client
const BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

/**
 * Hàm gọi API chung tự động kèm Token xác thực
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isAdmin = false
): Promise<ApiResponse<T>> {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    if (isAdmin) {
      token = localStorage.getItem('admin_token');
    } else {
      token = localStorage.getItem('user_token') || localStorage.getItem('token');
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}/api${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && typeof window !== 'undefined') {
      if (isAdmin) {
        localStorage.removeItem('admin_token');
        document.cookie = 'admin_token=; path=/; max-age=0';
        if (!window.location.pathname.startsWith('/admin/login')) {
          window.location.href = '/admin/login';
        }
      } else {
        localStorage.removeItem('user_token');
        localStorage.removeItem('token');
        document.cookie = 'user_token=; path=/; max-age=0';
        document.cookie = 'token=; path=/; max-age=0';
        if (
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')
        ) {
          window.location.href = '/login';
        }
      }
    }

    const data: ApiResponse<T> = await res.json();
    return data;
  } catch (err: any) {
    return {
      code: 0,
      msg: err.message || 'Lỗi kết nối máy chủ',
      data: null as any,
    };
  }
}

// 1. Phân hệ Auth
export const authApi = {
  login: (data: { username?: string; password?: string; account?: string; passwd?: string }) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data: { username?: string; password?: string; fundPassword?: string; inviteCode?: string }) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () => apiFetch('/auth/me', { method: 'GET' }),

  changePassword: (data: { oldPassword?: string; newPassword?: string; type?: 'login' | 'fund' }) =>
    apiFetch('/user/change-password', { method: 'POST', body: JSON.stringify(data) }),
};

// 2. Phân hệ Ngân hàng & KYC
export const bankApi = {
  getBanks: () => apiFetch('/user/bank', { method: 'GET' }),

  bindBank: (data: {
    bankName?: string;
    bankBranch?: string;
    bankCard?: string;
    accountHolder?: string;
    type?: 'bank' | 'usdt';
  }) => apiFetch('/user/bank', { method: 'POST', body: JSON.stringify(data) }),
};

export const verifyApi = {
  getStatus: () => apiFetch('/user/verify', { method: 'GET' }),

  submitVerify: (data: {
    realName: string;
    idCard: string;
    frontImg: string;
    backImg: string;
    profession?: string;
  }) => apiFetch('/user/verify', { method: 'POST', body: JSON.stringify(data) }),
};

// 3. Phân hệ Nạp & Rút tiền
export const rechargeApi = {
  getChannels: () => apiFetch('/recharge/channels', { method: 'GET' }),

  submitRecharge: (data: {
    money: number;
    channel?: string;
    voucher?: string;
    remark?: string;
  }) => apiFetch('/recharge/submit', { method: 'POST', body: JSON.stringify(data) }),

  getRechargeList: (page = 1, limit = 20) =>
    apiFetch(`/recharge/list?page=${page}&limit=${limit}`, { method: 'GET' }),
};

export const withdrawApi = {
  submitWithdraw: (data: {
    money: number;
    password: string;
    bankId?: number;
    withdraw_type?: 'bank_card' | 'usdt';
  }) => apiFetch('/withdraw/submit', { method: 'POST', body: JSON.stringify(data) }),

  getWithdrawList: (page = 1, limit = 20) =>
    apiFetch(`/withdraw/list?page=${page}&limit=${limit}`, { method: 'GET' }),

  getMoneyRecords: (page = 1, limit = 20, type?: string) =>
    apiFetch(`/money/records?page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`, { method: 'GET' }),
};

// 4. Phân hệ Thị trường & Đặt lệnh (Trading)
export const tradingApi = {
  getProducts: () => apiFetch('/products', { method: 'GET' }),

  getKline: (code: string, timeframe = '5m') =>
    apiFetch(`/products/${code}/kline?timeframe=${timeframe}`, { method: 'GET' }),

  createOrder: (data: {
    productId?: number;
    symbol: string;
    direction: 'buy_up' | 'buy_down' | 'buy' | 'call';
    money: number;
    duration?: number;
    yield_rate?: number;
  }) => apiFetch('/order/create', { method: 'POST', body: JSON.stringify(data) }),

  getMyOrders: (status = 'all', page = 1, limit = 20) =>
    apiFetch(`/order/my-orders?status=${status}&page=${page}&limit=${limit}`, { method: 'GET' }),
};

// 5. Phân hệ Quỹ Yu'e Bao & Vay vốn
export const yuebaoApi = {
  getInfo: () => apiFetch('/yuebao/info', { method: 'GET' }),

  transfer: (type: 'in' | 'out', amount: number, configId?: number) =>
    apiFetch('/yuebao/transfer', { method: 'POST', body: JSON.stringify({ type, amount, configId }) }),
};

export const loanApi = {
  getConfigs: () => apiFetch('/loan/configs', { method: 'GET' }),

  apply: (data: {
    configId: number;
    money: number;
    cycleDays?: number;
    reason?: string;
  }) => apiFetch('/loan/apply', { method: 'POST', body: JSON.stringify(data) }),

  getMyLoans: () => apiFetch('/loan/my-loans', { method: 'GET' }),
};

// 6. Phân hệ Quy đổi ngoại tệ & Nội dung
export const exchangeApi = {
  getRate: () => apiFetch('/exchange/rate', { method: 'GET' }),

  swap: (data: { fromCurrency: string; toCurrency: string; amount: number; direction?: string }) =>
    apiFetch('/exchange/swap', { method: 'POST', body: JSON.stringify(data) }),
};

export const contentApi = {
  getBanners: () => apiFetch('/content/banners', { method: 'GET' }),

  getNotices: (type?: number) =>
    apiFetch(`/content/notices${type ? `?type=${type}` : ''}`, { method: 'GET' }),

  getPublicConfig: () => apiFetch('/config/public', { method: 'GET' }),

  getUserMessages: () => apiFetch('/user/messages', { method: 'GET' }),
  markMessagesRead: () => apiFetch('/user/messages/read-all', { method: 'POST' }),
};

// 7. Phân hệ Quản trị Admin
export const adminApi = {
  getCaptcha: () => apiFetch('/admin/captcha', { method: 'GET' }),

  login: (data: { username: string; password: string; captchaKey?: string; captchaCode?: string }) =>
    apiFetch('/admin/login', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () => apiFetch('/admin/me', { method: 'GET' }, true),

  getStats: () => apiFetch('/admin/dashboard/stats', { method: 'GET' }, true),

  getUsers: (page = 1, limit = 10, search?: string) =>
    apiFetch(`/admin/user?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`, { method: 'GET' }, true),

  getUserDetail: (userId: number) =>
    apiFetch(`/admin/user/${userId}`, { method: 'GET' }, true),

  saveUserBank: (userId: number, data: {
    action?: 'delete';
    bankId?: number;
    type?: 'bank' | 'usdt_trc20' | 'usdt_erc20';
    bank_name?: string;
    bank_branch?: string;
    card_number?: string;
    account_holder?: string;
    nationality?: string;
    is_default?: boolean | number;
  }) => apiFetch(`/admin/user/${userId}/bank`, { method: 'POST', body: JSON.stringify(data) }, true),

  updateUserDetail: (userId: number, data: {
    real_name?: string;
    phone?: string;
    remark?: string;
    status?: number;
    level?: number;
    credit_score?: number;
    kong_style?: number;
  }) => apiFetch(`/admin/user/${userId}/update`, { method: 'POST', body: JSON.stringify(data) }, true),

  getVerifies: (status?: string, page = 1, limit = 10, search?: string) =>
    apiFetch(`/admin/verify?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`, { method: 'GET' }, true),

  auditVerify: (id: number, status: 'approved' | 'rejected' | 2 | 3, remark?: string) =>
    apiFetch('/admin/verify/audit', { method: 'POST', body: JSON.stringify({ id, status, remark }) }, true),

  getUpmarks: (status?: string, page = 1, limit = 10) =>
    apiFetch(`/admin/upmark?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`, { method: 'GET' }, true),

  checkUpmark: (id: number, status: 'approved' | 'rejected', remark?: string) =>
    apiFetch('/admin/upmark/check', { method: 'POST', body: JSON.stringify({ id, status, remark }) }, true),

  getDownmarks: (status?: string, page = 1, limit = 10) =>
    apiFetch(`/admin/downmark?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`, { method: 'GET' }, true),

  checkDownmark: (id: number, status: 'approved' | 'rejected', remark?: string) =>
    apiFetch('/admin/downmark/check', { method: 'POST', body: JSON.stringify({ id, status, remark }) }, true),

  getOrders: (page = 1, limit = 10, status?: string) =>
    apiFetch(`/admin/order?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`, { method: 'GET' }, true),

  getYuebaoOrders: (page = 1, limit = 20) =>
    apiFetch(`/admin/yuebao-order?page=${page}&limit=${limit}`, { method: 'GET' }, true),

  controlOrder: (orderId: number, controlResult: 'win' | 'lose') =>
    apiFetch('/admin/order/control', { method: 'POST', body: JSON.stringify({ orderId, controlResult }) }, true),

  adjustBalance: (data: { userId: number; amount: number; type?: 'add' | 'sub'; memo?: string }) =>
    apiFetch('/admin/user/balance', { method: 'POST', body: JSON.stringify(data) }, true),

  adjustCreditScore: (data: { userId: number; score: number; type?: 'add' | 'sub' | 'set'; memo?: string }) =>
    apiFetch('/admin/user/credit-score', { method: 'POST', body: JSON.stringify(data) }, true),

  updateUserControl: (data: {
    userId: number;
    kong_style?: number;
    credit_score?: number;
    fund_status?: number;
    say_limit?: number;
    status?: number;
    level?: number;
    remark?: string;
  }) => apiFetch('/admin/user/control', { method: 'POST', body: JSON.stringify(data) }, true),

  // Gửi và quản lý tin nhắn hệ thống
  sendMessage: (data: { userId: number; title?: string; content: string }) =>
    apiFetch('/admin/user/message', { method: 'POST', body: JSON.stringify(data) }, true),

  getUserMessages: (userId: number) =>
    apiFetch(`/admin/user/${userId}/messages`, { method: 'GET' }, true),

  deleteMessage: (id: number) =>
    apiFetch(`/admin/message/${id}`, { method: 'DELETE' }, true),

  getConfigs: () => apiFetch('/admin/general/config', { method: 'GET' }, true),

  updateConfigs: (configs: Record<string, any>) =>
    apiFetch('/admin/general/config', { method: 'POST', body: JSON.stringify(configs) }, true),

  // Cấu hình Gói vay (Loan Config)
  getLoanConfigs: () => apiFetch('/admin/loan-config', { method: 'GET' }, true),
  saveLoanConfig: (data: any) => apiFetch('/admin/loan-config', { method: 'POST', body: JSON.stringify(data) }, true),
  deleteLoanConfig: (id: number) => apiFetch(`/admin/loan-config/${id}`, { method: 'DELETE' }, true),

  // Cấu hình Quỹ Yu'e Bao (Yuebao Config)
  getYuebaoConfigs: () => apiFetch('/admin/yuebao-config', { method: 'GET' }, true),
  saveYuebaoConfig: (data: any) => apiFetch('/admin/yuebao-config', { method: 'POST', body: JSON.stringify(data) }, true),
  deleteYuebaoConfig: (id: number) => apiFetch(`/admin/yuebao-config/${id}`, { method: 'DELETE' }, true),

  // Quản lý Sản phẩm (Product)
  getProducts: (page = 1, limit = 50) => apiFetch(`/admin/product?page=${page}&limit=${limit}`, { method: 'GET' }, true),
  saveProduct: (data: any) => apiFetch('/admin/product', { method: 'POST', body: JSON.stringify(data) }, true),
  deleteProduct: (id: number) => apiFetch(`/admin/product/${id}`, { method: 'DELETE' }, true),

  // Quản lý Phân loại sản phẩm (Product Type)
  getProductTypes: () => apiFetch('/admin/product-type', { method: 'GET' }, true),
  saveProductType: (data: any) => apiFetch('/admin/product-type', { method: 'POST', body: JSON.stringify(data) }, true),
  deleteProductType: (id: number) => apiFetch(`/admin/product-type/${id}`, { method: 'DELETE' }, true),

  // Quản lý Phân quyền Admin (Auth Manage)
  getAdminUsers: () => apiFetch('/admin/auth/admin', { method: 'GET' }, true),
  saveAdminUser: (data: any) => apiFetch('/admin/auth/admin', { method: 'POST', body: JSON.stringify(data) }, true),
  deleteAdminUser: (id: number) => apiFetch(`/admin/auth/admin/${id}`, { method: 'DELETE' }, true),

  getAuthGroups: () => apiFetch('/admin/auth/group', { method: 'GET' }, true),
  saveAuthGroup: (data: any) => apiFetch('/admin/auth/group', { method: 'POST', body: JSON.stringify(data) }, true),
  deleteAuthGroup: (id: number) => apiFetch(`/admin/auth/group/${id}`, { method: 'DELETE' }, true),

  getAuthRules: () => apiFetch('/admin/auth/rule', { method: 'GET' }, true),
  saveAuthRule: (data: any) => apiFetch('/admin/auth/rule', { method: 'POST', body: JSON.stringify(data) }, true),
  deleteAuthRule: (id: number) => apiFetch(`/admin/auth/rule/${id}`, { method: 'DELETE' }, true),

  getAdminLogs: (limit = 50) => apiFetch(`/admin/auth/log?limit=${limit}`, { method: 'GET' }, true),
  deleteAdminLogs: (ids?: number[]) => apiFetch('/admin/auth/log', { method: 'DELETE', body: JSON.stringify({ ids }) }, true),

  // Quản lý Tệp đính kèm (Attachment)
  getAttachments: (page = 1, limit = 50) => apiFetch(`/admin/attachment?page=${page}&limit=${limit}`, { method: 'GET' }, true),
  deleteAttachment: (id: number) => apiFetch(`/admin/attachment/${id}`, { method: 'DELETE' }, true),

  // Quản lý Thông báo Admin (Notice)
  getAdminNotices: () => apiFetch('/admin/notice', { method: 'GET' }, true),
  saveAdminNotice: (data: any) => apiFetch('/admin/notice', { method: 'POST', body: JSON.stringify(data) }, true),
  deleteAdminNotice: (id: number) => apiFetch(`/admin/notice/${id}`, { method: 'DELETE' }, true),
};

// 8. Phân hệ Tải tệp lên Cloudflare R2
export const uploadApi = {
  uploadFile: async (file: File, type = 'general'): Promise<ApiResponse<{ url: string; path: string; key: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('admin_token')) : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return await res.json();
    } catch (err: any) {
      return {
        code: 0,
        msg: err.message || 'Lỗi tải ảnh lên Cloudflare R2',
        data: null as any,
      };
    }
  },
};


