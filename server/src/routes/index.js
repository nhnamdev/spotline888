const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('../middlewares/auth');
const adminAuthMiddleware = require('../middlewares/adminAuth');

// Controllers
const authController = require('../controllers/auth.controller');
const adminAuthController = require('../controllers/adminAuth.controller');
const userBankController = require('../controllers/userBank.controller');
const verifyController = require('../controllers/verify.controller');
const rechargeController = require('../controllers/recharge.controller');
const withdrawController = require('../controllers/withdraw.controller');
const tradingController = require('../controllers/trading.controller');
const yuebaoController = require('../controllers/yuebao.controller');
const loanController = require('../controllers/loan.controller');
const exchangeController = require('../controllers/exchange.controller');
const contentController = require('../controllers/content.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Admin Controllers
const adminUserController = require('../controllers/adminUser.controller');
const adminVerifyController = require('../controllers/adminVerify.controller');
const adminUpmarkController = require('../controllers/adminUpmark.controller');
const adminDownmarkController = require('../controllers/adminDownmark.controller');
const adminProductController = require('../controllers/adminProduct.controller');
const adminOrderController = require('../controllers/adminOrder.controller');
const adminYuebaoController = require('../controllers/adminYuebao.controller');
const adminLoanController = require('../controllers/adminLoan.controller');
const adminDashboardController = require('../controllers/adminDashboard.controller');
const adminConfigController = require('../controllers/adminConfig.controller');
const adminAuthManageController = require('../controllers/adminAuthManage.controller');
const adminAttachmentController = require('../controllers/adminAttachment.controller');
const adminNoticeController = require('../controllers/adminNotice.controller');

// =============================================================================
// 1. PHÂN HỆ AUTH & USER PROFILE
// =============================================================================
router.post('/login/register', authController.register);
router.post('/login/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.get('/user/profile', authMiddleware, authController.getProfile);
router.get('/auth/me', authMiddleware, authController.getProfile);
router.post('/user/change-password', authMiddleware, authController.changePassword);

// Ngân hàng & Ví tiền
router.get('/user/bank', authMiddleware, userBankController.getBankAccounts);
router.post('/user/bank', authMiddleware, userBankController.bindBankAccount);

// Xác thực danh tính KYC
router.get('/user/verify', authMiddleware, verifyController.getVerifyStatus);
router.post('/user/verify', authMiddleware, verifyController.submitVerify);

// Tin nhắn hộp thư
router.get('/user/messages', authMiddleware, contentController.getUserMessages);
router.post('/user/messages/read-all', authMiddleware, contentController.markMessagesAsRead);

// =============================================================================
// 2. PHÂN HỆ NẠP TIỀN, RÚT TIỀN & BIẾN ĐỘNG SỐ DƯ
// =============================================================================
router.get('/recharge/channels', rechargeController.getRechargeChannels);
router.post('/recharge/submit', authMiddleware, rechargeController.submitRecharge);
router.get('/recharge/list', authMiddleware, rechargeController.getRechargeList);

router.post('/withdraw/submit', authMiddleware, withdrawController.submitWithdraw);
router.get('/withdraw/list', authMiddleware, withdrawController.getWithdrawList);

router.get('/money/records', authMiddleware, withdrawController.getMoneyLogs);

// =============================================================================
// 3. PHÂN HỆ THỊ TRƯỜNG & ĐẶT LỆNH QUYỀN CHỌN NHỊ PHÂN
// =============================================================================
router.get('/products', tradingController.getProducts);
router.get('/products/:code/kline', tradingController.getKlineData);

router.post('/order/create', authMiddleware, tradingController.createOrder);
router.get('/order/my-orders', authMiddleware, tradingController.getMyOrders);

// =============================================================================
// 4. PHÂN HỆ QUỸ TIẾT KIỆM YU'E BAO & VAY TÍN CHẤP
// =============================================================================
router.get('/yuebao/info', authMiddleware, yuebaoController.getYuebaoInfo);
router.post('/yuebao/transfer', authMiddleware, yuebaoController.transferYuebao);

router.get('/loan/configs', loanController.getLoanConfigs);
router.post('/loan/apply', authMiddleware, loanController.applyLoan);
router.get('/loan/my-loans', authMiddleware, loanController.getMyLoans);

// =============================================================================
// 5. PHÂN HỆ QUY ĐỔI TIỀN & NỘI DUNG
// =============================================================================
router.get('/exchange/rate', exchangeController.getExchangeRate);
router.post('/exchange/swap', authMiddleware, exchangeController.swapCurrency);

router.get('/content/banners', contentController.getBanners);
router.get('/content/notices', contentController.getNotices);
router.get('/config/public', contentController.getPublicConfig);

// Phân hệ Tải tệp lên Cloudflare R2
router.post('/upload', upload.single('file'), uploadController.uploadFile);
router.post('/common/upload', upload.single('file'), uploadController.uploadFile);

// =============================================================================
// 6. PHÂN HỆ QUẢN TRỊ ADMIN (YÊU CẦU ADMIN AUTH TRỪ LOGIN & CAPTCHA)
// =============================================================================
router.get('/admin/captcha', adminAuthController.getCaptcha);
router.post('/admin/login', adminAuthController.login);
router.get('/admin/profile', adminAuthMiddleware, adminAuthController.getProfile);
router.get('/admin/me', adminAuthMiddleware, adminAuthController.getProfile);

// Dashboard
router.get('/admin/dashboard/stats', adminAuthMiddleware, adminDashboardController.getDashboardStats);

// Quản lý Hội viên
router.get('/admin/user', adminAuthMiddleware, adminUserController.getUsers);
router.get('/admin/user/:id', adminAuthMiddleware, adminUserController.getUserDetail);
// Điều chỉnh số dư tiền mặt (上下分)
router.post('/admin/user/score', adminAuthMiddleware, adminUserController.adjustScore);
router.post('/admin/user/balance', adminAuthMiddleware, adminUserController.adjustScore);
// Điều chỉnh điểm tín nhiệm (信誉分)
router.post('/admin/user/credit-score', adminAuthMiddleware, adminUserController.adjustCreditScore);
router.post('/admin/user/score/credit', adminAuthMiddleware, adminUserController.adjustCreditScore);
// Cấu hình phong cách & phong tỏa tài khoản
router.post('/admin/user/control', adminAuthMiddleware, adminUserController.updateUserControl);
// Gửi tin nhắn hệ thống cho hội viên & quản lý tin nhắn
router.post('/admin/user/message', adminAuthMiddleware, adminUserController.sendMessage);
router.get('/admin/user/:id/messages', adminAuthMiddleware, adminUserController.getUserMessagesForAdmin);
router.delete('/admin/message/:id', adminAuthMiddleware, adminUserController.deleteMessage);

// Quản lý KYC
router.get('/admin/verify', adminAuthMiddleware, adminVerifyController.getVerifies);
router.post('/admin/verify/audit', adminAuthMiddleware, adminVerifyController.auditVerify);

// Quản lý Nạp & Rút tiền
router.get('/admin/upmark', adminAuthMiddleware, adminUpmarkController.getUpmarks);
router.post('/admin/upmark/check', adminAuthMiddleware, adminUpmarkController.checkUpmark);

router.get('/admin/downmark', adminAuthMiddleware, adminDownmarkController.getDownmarks);
router.post('/admin/downmark/check', adminAuthMiddleware, adminDownmarkController.checkDownmark);

// Quản lý Sản phẩm & Phân loại
router.get('/admin/product', adminAuthMiddleware, adminProductController.getProducts);
router.post('/admin/product', adminAuthMiddleware, adminProductController.saveProduct);
router.delete('/admin/product/:id', adminAuthMiddleware, adminProductController.deleteProduct);

router.get('/admin/product-type', adminAuthMiddleware, adminProductController.getProductTypes);
router.post('/admin/product-type', adminAuthMiddleware, adminProductController.saveProductType);
router.delete('/admin/product-type/:id', adminAuthMiddleware, adminProductController.deleteProductType);

// Quản lý Đơn cược
router.get('/admin/order', adminAuthMiddleware, adminOrderController.getOrders);
router.post('/admin/order/control', adminAuthMiddleware, adminOrderController.controlOrder);

// Quản lý Quỹ Yu'e Bao
router.get('/admin/yuebao-order', adminAuthMiddleware, adminYuebaoController.getYuebaoOrders);
router.get('/admin/yuebao-config', adminAuthMiddleware, adminYuebaoController.getYuebaoConfigs);
router.post('/admin/yuebao-config', adminAuthMiddleware, adminYuebaoController.saveYuebaoConfig);
router.delete('/admin/yuebao-config/:id', adminAuthMiddleware, adminYuebaoController.deleteYuebaoConfig);

// Quản lý Gói vay & Hồ sơ vay
router.get('/admin/loan-record', adminAuthMiddleware, adminLoanController.getLoanRecords);
router.post('/admin/loan-record/action', adminAuthMiddleware, adminLoanController.actionLoanRecord);
router.get('/admin/loan-config', adminAuthMiddleware, adminLoanController.getLoanConfigs);
router.post('/admin/loan-config', adminAuthMiddleware, adminLoanController.saveLoanConfig);
router.delete('/admin/loan-config/:id', adminAuthMiddleware, adminLoanController.deleteLoanConfig);

// Quản lý Cấu hình & IP Whitelist
router.get('/admin/general/config', adminAuthMiddleware, adminConfigController.getAllConfigs);
router.post('/admin/general/config', adminAuthMiddleware, adminConfigController.updateConfigs);
router.get('/admin/ipwhitelist', adminAuthMiddleware, adminConfigController.getIpWhitelist);
router.post('/admin/ipwhitelist', adminAuthMiddleware, adminConfigController.addIpWhitelist);
router.delete('/admin/ipwhitelist/:id', adminAuthMiddleware, adminConfigController.deleteIpWhitelist);

// Quản lý Phân quyền Admin (Auth Manage)
router.get('/admin/auth/admin', adminAuthMiddleware, adminAuthManageController.getAdminUsers);
router.post('/admin/auth/admin', adminAuthMiddleware, adminAuthManageController.saveAdminUser);
router.delete('/admin/auth/admin/:id', adminAuthMiddleware, adminAuthManageController.deleteAdminUser);

router.get('/admin/auth/group', adminAuthMiddleware, adminAuthManageController.getAuthGroups);
router.post('/admin/auth/group', adminAuthMiddleware, adminAuthManageController.saveAuthGroup);
router.delete('/admin/auth/group/:id', adminAuthMiddleware, adminAuthManageController.deleteAuthGroup);

router.get('/admin/auth/rule', adminAuthMiddleware, adminAuthManageController.getAuthRules);
router.post('/admin/auth/rule', adminAuthMiddleware, adminAuthManageController.saveAuthRule);
router.delete('/admin/auth/rule/:id', adminAuthMiddleware, adminAuthManageController.deleteAuthRule);

router.get('/admin/auth/log', adminAuthMiddleware, adminAuthManageController.getAdminLogs);
router.delete('/admin/auth/log', adminAuthMiddleware, adminAuthManageController.deleteAdminLogs);

// Quản lý Tệp đính kèm (Attachment)
router.get('/admin/attachment', adminAuthMiddleware, adminAttachmentController.getAttachments);
router.delete('/admin/attachment/:id', adminAuthMiddleware, adminAttachmentController.deleteAttachment);

// Quản lý Thông báo Admin (Notice)
router.get('/admin/notice', adminAuthMiddleware, adminNoticeController.getNotices);
router.post('/admin/notice', adminAuthMiddleware, adminNoticeController.saveNotice);
router.delete('/admin/notice/:id', adminAuthMiddleware, adminNoticeController.deleteNotice);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Spotline888 Express Backend API',
    endpoints_count: 36,
  });
});

module.exports = router;
