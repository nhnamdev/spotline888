const http = require('http');
const app = require('./src/app');

const TEST_PORT = 5055;
let server;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (body) {
      reqHeaders['Content-Length'] = Buffer.byteLength(dataString);
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData);
            resolve({ status: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, body: rawData });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (body) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Bắt đầu chạy chuỗi kiểm tra tự động toàn diện backend Spotline888...\n');

  server = app.listen(TEST_PORT);
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message, errorDetail = null) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      if (errorDetail) {
        console.error(`     Chi tiết lỗi:`, JSON.stringify(errorDetail));
      }
      failedCount++;
    }
  }

  try {
    // 1. Health check
    console.log('--- PHÂN HỆ 1: HEALTH CHECK ---');
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'ok', 'API Health Check phản hồi 200 OK và status "ok"', health.body);

    // 2. Auth - Đăng ký & Đăng nhập
    console.log('\n--- PHÂN HỆ 2: USER AUTH & PROFILE ---');
    const testUsername = `user_${Date.now().toString().slice(-6)}`;
    const regRes = await request('POST', '/api/auth/register', {
      username: testUsername,
      password: 'Password123!',
      confirmPassword: 'Password123!',
      inviteCode: '',
    });
    assert(regRes.status === 200 && regRes.body.code === 1, `Đăng ký user mới [${testUsername}] thành công`, regRes.body);

    const loginRes = await request('POST', '/api/auth/login', {
      username: testUsername,
      password: 'Password123!',
    });
    assert(loginRes.status === 200 && loginRes.body.code === 1, `Đăng nhập user [${testUsername}] thành công`, loginRes.body);
    const userToken = loginRes.body.data?.token;
    assert(!!userToken, 'Nhận JWT User Token');

    const userHeaders = { Authorization: `Bearer ${userToken}` };
    const meRes = await request('GET', '/api/auth/me', null, userHeaders);
    assert(meRes.status === 200 && meRes.body.data?.username === testUsername, 'Lấy thông tin cá nhân /api/auth/me chuẩn xác', meRes.body);

    // 3. Admin Auth & Captcha
    console.log('\n--- PHÂN HỆ 3: ADMIN AUTH & PERMISSIONS ---');
    const captchaRes = await request('GET', '/api/admin/captcha');
    assert(captchaRes.status === 200 && captchaRes.body.data?.key, 'Lấy captcha admin thành công', captchaRes.body);

    let adminLoginRes = await request('POST', '/api/admin/login', {
      username: 'admin',
      password: 'Password123!',
      captchaKey: captchaRes.body.data?.key,
      captchaCode: captchaRes.body.data?.code,
    });
    
    let adminToken = adminLoginRes.body.data?.token;
    if (!adminToken) {
      const captcha2 = await request('GET', '/api/admin/captcha');
      adminLoginRes = await request('POST', '/api/admin/login', {
        username: 'admin',
        password: 'admin888',
        captchaKey: captcha2.body.data?.key,
        captchaCode: captcha2.body.data?.code,
      });
      adminToken = adminLoginRes.body.data?.token;
    }
    assert(!!adminToken, 'Đăng nhập admin thành công và lấy JWT Admin Token', adminLoginRes.body);
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    const adminMeRes = await request('GET', '/api/admin/me', null, adminHeaders);
    assert(adminMeRes.status === 200 && adminMeRes.body.code === 1, 'Lấy profile Admin /api/admin/me chuẩn xác', adminMeRes.body);

    // 4. Ngân hàng & KYC
    console.log('\n--- PHÂN HỆ 4: USER BANK & KYC ---');
    const addBankRes = await request('POST', '/api/user/bank', {
      bankName: 'MB Bank',
      bankBranch: 'Hà Nội',
      bankCard: '999988887777',
      name: 'NGUYEN VAN TEST',
    }, userHeaders);
    assert(addBankRes.status === 200 && addBankRes.body.code === 1, 'Thêm tài khoản ngân hàng thành công', addBankRes.body);

    const banksRes = await request('GET', '/api/user/bank', null, userHeaders);
    const bankList = Array.isArray(banksRes.body.data) ? banksRes.body.data : (banksRes.body.data ? [banksRes.body.data] : []);
    assert(banksRes.status === 200 && bankList.length > 0, 'Lấy danh sách tài khoản ngân hàng liên kết thành công', banksRes.body);

    const kycRes = await request('POST', '/api/user/verify', {
      realName: 'NGUYEN VAN TEST',
      idCard: '001200009999',
      frontImg: 'https://example.com/front.jpg',
      backImg: 'https://example.com/back.jpg',
    }, userHeaders);
    assert(kycRes.status === 200 && kycRes.body.code === 1, 'Gửi yêu cầu xác minh KYC thành công', kycRes.body);

    // Admin duyệt KYC
    const adminKycList = await request('GET', '/api/admin/verify?status=pending', null, adminHeaders);
    assert(adminKycList.status === 200 && adminKycList.body.code === 1, 'Admin lấy danh sách duyệt KYC', adminKycList.body);
    const pendingKycList = adminKycList.body.data?.rows || adminKycList.body.data || [];
    const pendingKyc = pendingKycList[0];
    if (pendingKyc) {
      const reviewKyc = await request('POST', '/api/admin/verify/audit', {
        id: pendingKyc.id,
        status: 2, // 2: approved
        remark: 'Đã duyệt hồ sơ KYC tự động',
      }, adminHeaders);
      assert(reviewKyc.status === 200 && reviewKyc.body.code === 1, `Admin duyệt thành công hồ sơ KYC ID: ${pendingKyc.id}`, reviewKyc.body);
    }

    // 5. Nạp tiền & Duyệt nạp (Upmark)
    console.log('\n--- PHÂN HỆ 5: RECHARGE & UPMARK ---');
    const rechargeRes = await request('POST', '/api/recharge/submit', {
      money: 10000000, // 10 triệu
      channel: 'bank_transfer',
      voucher: 'https://example.com/bill.jpg',
      remark: 'Nạp tiền test tự động',
    }, userHeaders);
    assert(rechargeRes.status === 200 && rechargeRes.body.code === 1, 'Tạo đơn nạp tiền 10,000,000 VND thành công', rechargeRes.body);
    const rechargeOrderSn = rechargeRes.body.data?.order_sn;

    const adminUpmarkList = await request('GET', '/api/admin/upmark?status=pending', null, adminHeaders);
    assert(adminUpmarkList.status === 200 && adminUpmarkList.body.code === 1, 'Admin lấy danh sách yêu cầu nạp tiền (Upmark)', adminUpmarkList.body);

    const pendingUpmarks = adminUpmarkList.body.data?.rows || adminUpmarkList.body.data || [];
    const pendingUpmark = pendingUpmarks.find((item) => item.order_sn === rechargeOrderSn) || pendingUpmarks[0];
    if (pendingUpmark) {
      const approveUpmark = await request('POST', '/api/admin/upmark/check', {
        id: pendingUpmark.id,
        status: 'approved',
        remark: 'Duyệt nạp tiền tự động kiểm thử',
      }, adminHeaders);
      assert(approveUpmark.status === 200 && approveUpmark.body.code === 1, `Admin duyệt thành công đơn nạp ID: ${pendingUpmark.id}`, approveUpmark.body);
    }

    // Kiểm tra số dư người dùng đã được cộng tiền
    const meAfterRecharge = await request('GET', '/api/auth/me', null, userHeaders);
    assert(Number(meAfterRecharge.body.data?.money) >= 10000000, `Số dư User đã tăng lên: ${meAfterRecharge.body.data?.money} VND`, meAfterRecharge.body);

    // 6. Rút tiền & Duyệt rút (Downmark)
    console.log('\n--- PHÂN HỆ 6: WITHDRAW & DOWNMARK ---');
    const withdrawRes = await request('POST', '/api/withdraw/submit', {
      money: 2000000, // Rút 2 triệu
      bankId: bankList[0]?.id || 1,
      bankName: 'MB Bank',
      bankCard: '999988887777',
      bankBranch: 'Hà Nội',
      name: 'NGUYEN VAN TEST',
      password: 'Password123!',
    }, userHeaders);
    assert(withdrawRes.status === 200 && withdrawRes.body.code === 1, 'Tạo đơn rút tiền 2,000,000 VND thành công', withdrawRes.body);
    const withdrawOrderSn = withdrawRes.body.data?.order_sn;

    const adminDownmarkList = await request('GET', '/api/admin/downmark?status=pending', null, adminHeaders);
    assert(adminDownmarkList.status === 200 && adminDownmarkList.body.code === 1, 'Admin lấy danh sách yêu cầu rút tiền (Downmark)', adminDownmarkList.body);

    const pendingDownmarks = adminDownmarkList.body.data?.rows || adminDownmarkList.body.data || [];
    const pendingDownmark = pendingDownmarks.find((item) => item.order_sn === withdrawOrderSn) || pendingDownmarks[0];
    if (pendingDownmark) {
      const approveDownmark = await request('POST', '/api/admin/downmark/check', {
        id: pendingDownmark.id,
        status: 'approved',
        remark: 'Đã chuyển khoản thành công',
      }, adminHeaders);
      assert(approveDownmark.status === 200 && approveDownmark.body.code === 1, `Admin duyệt đơn rút tiền ID: ${pendingDownmark.id}`, approveDownmark.body);
    }

    // 7. Giao dịch Trading & Settle
    console.log('\n--- PHÂN HỆ 7: BINARY OPTIONS TRADING & ORDER CONTROL ---');
    const productsRes = await request('GET', '/api/products');
    assert(productsRes.status === 200 && productsRes.body.code === 1, 'Lấy danh sách mã sản phẩm giao dịch thành công', productsRes.body);
    const productList = productsRes.body.data || [];
    const testProduct = productList[0] || { code: 'BTC/USDT', id: 1 };

    const orderRes = await request('POST', '/api/order/create', {
      productId: testProduct.id,
      productCode: testProduct.code,
      productTitle: testProduct.title || 'Bitcoin',
      direction: 'buy',
      money: 100000,
      second: 30, // 30s
    }, userHeaders);
    assert(orderRes.status === 200 && orderRes.body.code === 1, `Đặt lệnh MUA (BUY) ${testProduct.code} trị giá 100,000 VND thành công`, orderRes.body);
    const createdOrderId = orderRes.body.data?.orderId;

    const myOrdersRes = await request('GET', '/api/order/my-orders', null, userHeaders);
    assert(myOrdersRes.status === 200 && myOrdersRes.body.code === 1, 'Lấy danh sách lệnh của User thành công', myOrdersRes.body);

    // Admin kiểm tra danh sách orders và can thiệp kết quả thắng
    const adminOrders = await request('GET', '/api/admin/order', null, adminHeaders);
    assert(adminOrders.status === 200 && adminOrders.body.code === 1, 'Admin lấy danh sách toàn bộ lệnh giao dịch', adminOrders.body);

    if (createdOrderId) {
      const controlRes = await request('POST', '/api/admin/order/control', {
        orderId: createdOrderId,
        controlResult: 'win',
      }, adminHeaders);
      assert(controlRes.status === 200 && controlRes.body.code === 1, `Admin can thiệp kết quả lệnh ID ${createdOrderId} thành WIN`, controlRes.body);
    }

    // 8. Yu'e Bao (Quỹ tiết kiệm)
    console.log('\n--- PHÂN HỆ 8: YU\'E BAO (TIẾT KIỆM HƯỞNG LÃI) ---');
    const yuebaoIn = await request('POST', '/api/yuebao/transfer', {
      type: 'in', // chuyển vào
      amount: 1000000, // 1 triệu
      configId: 1,
    }, userHeaders);
    assert(yuebaoIn.status === 200 && yuebaoIn.body.code === 1, 'Chuyển 1,000,000 VND vào quỹ Yu\'e Bao thành công', yuebaoIn.body);

    const yuebaoInfo = await request('GET', '/api/yuebao/info', null, userHeaders);
    assert(yuebaoInfo.status === 200 && yuebaoInfo.body.code === 1, 'Lấy thông tin tài khoản Yu\'e Bao chính xác', yuebaoInfo.body);

    const yuebaoOut = await request('POST', '/api/yuebao/transfer', {
      type: 'out', // rút ra
      amount: 500000, // 500k
    }, userHeaders);
    assert(yuebaoOut.status === 200 && yuebaoOut.body.code === 1, 'Chuyển 500,000 VND từ Yu\'e Bao về ví chính thành công', yuebaoOut.body);

    // 9. Vay vốn (Loan)
    console.log('\n--- PHÂN HỆ 9: LOAN (VAY TÀI CHÍNH) ---');
    const loanApply = await request('POST', '/api/loan/apply', {
      money: 20000,
      configId: 1,
      cycleDays: 30,
      realName: 'NGUYEN VAN TEST',
      idCard: '001200009999',
      phone: '0901234567',
      reason: 'Vay đầu tư kinh doanh thử nghiệm',
    }, userHeaders);
    assert(loanApply.status === 200 && loanApply.body.code === 1, 'Đăng ký vay 5,000,000 VND thành công', loanApply.body);
    const loanRecordId = loanApply.body.data?.id || loanApply.body.data?.loanId;

    const adminLoans = await request('GET', '/api/admin/loan-record', null, adminHeaders);
    assert(adminLoans.status === 200 && adminLoans.body.code === 1, 'Admin lấy danh sách hồ sơ vay vốn', adminLoans.body);

    const pendingLoans = adminLoans.body.data?.rows || adminLoans.body.data || [];
    const targetLoan = pendingLoans.find((item) => item.id === loanRecordId) || pendingLoans[0];
    if (targetLoan) {
      const reviewLoan = await request('POST', '/api/admin/loan-record/action', {
        id: targetLoan.id,
        action: 'approve',
        remark: 'Hồ sơ đủ điều kiện giải ngân tự động',
      }, adminHeaders);
      assert(reviewLoan.status === 200 && reviewLoan.body.code === 1, `Admin duyệt giải ngân khoản vay ID: ${targetLoan.id}`, reviewLoan.body);
    }

    // 10. Flash Exchange (Quy đổi tiền tệ)
    console.log('\n--- PHÂN HỆ 10: FLASH EXCHANGE ---');
    const exchangeRate = await request('GET', '/api/exchange/rate');
    assert(exchangeRate.status === 200 && exchangeRate.body.code === 1, 'Lấy tỷ giá quy đổi tiền tệ thành công', exchangeRate.body);

    const exchangeRes = await request('POST', '/api/exchange/swap', {
      fromCurrency: 'VND',
      toCurrency: 'USDT',
      amount: 500000,
    }, userHeaders);
    assert(exchangeRes.status === 200 && exchangeRes.body.code === 1, 'Quy đổi 500,000 VND sang USDT thành công', exchangeRes.body);

    // 11. Banners, Notices & Admin Dashboard Stats
    console.log('\n--- PHÂN HỆ 11: CONTENT & ADMIN DASHBOARD ---');
    const banners = await request('GET', '/api/content/banners');
    assert(banners.status === 200 && banners.body.code === 1, 'Lấy danh sách banners thành công', banners.body);

    const notices = await request('GET', '/api/content/notices');
    assert(notices.status === 200 && notices.body.code === 1, 'Lấy danh sách thông báo hệ thống thành công', notices.body);

    const dashboard = await request('GET', '/api/admin/dashboard/stats', null, adminHeaders);
    assert(dashboard.status === 200 && dashboard.body.code === 1, 'Admin Dashboard thống kê số liệu tổng quan chuẩn xác', dashboard.body);

  } catch (err) {
    console.error('❌ Lỗi ngoại lệ trong quá trình test:', err);
    failedCount++;
  } finally {
    console.log(`\n=============================================`);
    console.log(`📊 TỔNG KẾT KIỂM THỬ: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log(`=============================================\n`);
    if (server) server.close();
    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runTests();
