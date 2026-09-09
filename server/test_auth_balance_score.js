const http = require('http');
const app = require('./src/app');
const { pool } = require('./src/config/db');

async function runTests() {
  console.log('=================================================================');
  console.log('🚀 BẮT ĐẦU KIỂM THỬ: LUỒNG AUTH, ĐIỀU CHỈNH SỐ DƯ & ĐIỂM TÍN NHIỆM');
  console.log('=================================================================\n');

  // Khởi động server test nội bộ
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099/api';

  function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${baseUrl}${path}`);
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const req = http.request(
        url,
        {
          method,
          headers,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve({ status: res.statusCode, body: json });
            } catch {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        }
      );

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  let passedCount = 0;
  let failedCount = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passedCount++;
    } else {
      console.error(`  ❌ [FAIL] ${name} -> ${details}`);
      failedCount++;
    }
  }

  try {
    const testUsername = `user_${Date.now().toString().slice(-6)}`;
    const testPassword = 'password123';
    const testFundPassword = 'fundpass123';
    let userToken = null;
    let userId = null;
    let adminToken = null;

    // =========================================================================
    // PHẦN 1: KIỂM TRA LUỒNG AUTH (USER & ADMIN)
    // =========================================================================
    console.log('--- 1. KIỂM TRA LUỒNG AUTH ---');

    // 1.1 Đăng ký hội viên mới
    const regRes = await request('POST', '/auth/register', {
      username: testUsername,
      password: testPassword,
      fundPassword: testFundPassword,
      phone: '098' + Math.floor(1000000 + Math.random() * 9000000),
    });
    assert(
      'Đăng ký tài khoản hội viên mới thành công',
      regRes.body.code === 1 && regRes.body.data && regRes.body.data.token,
      regRes.body?.msg || JSON.stringify(regRes)
    );
    userId = regRes.body.data?.id;
    userToken = regRes.body.data?.token;

    // 1.2 Đăng nhập với tài khoản vừa tạo
    const loginRes = await request('POST', '/auth/login', {
      username: testUsername,
      password: testPassword,
    });
    assert(
      'Đăng nhập tài khoản hội viên thành công',
      loginRes.body.code === 1 && loginRes.body.data?.token,
      loginRes.body?.msg || JSON.stringify(loginRes)
    );
    userToken = loginRes.body.data?.token;

    // 1.3 Lấy thông tin cá nhân (Profile / Me)
    const profileRes = await request('GET', '/auth/me', null, userToken);
    assert(
      'Lấy thông tin cá nhân (Me / Profile) trả về số dư và điểm tín nhiệm',
      profileRes.body.code === 1 &&
        profileRes.body.data?.account === testUsername &&
        profileRes.body.data?.money !== undefined &&
        profileRes.body.data?.credit_score !== undefined,
      profileRes.body?.msg || JSON.stringify(profileRes)
    );

    // 1.4 Đổi mật khẩu đăng nhập
    const newPassword = 'newPassword999';
    const changePassRes = await request(
      'POST',
      '/user/change-password',
      {
        oldPassword: testPassword,
        newPassword: newPassword,
        type: 'login',
      },
      userToken
    );
    assert(
      'Đổi mật khẩu đăng nhập thành công',
      changePassRes.body.code === 1,
      changePassRes.body?.msg || JSON.stringify(changePassRes)
    );

    // 1.5 Kiểm tra đăng nhập với mật khẩu cũ thất bại & mật khẩu mới thành công
    const oldLoginFail = await request('POST', '/auth/login', {
      username: testUsername,
      password: testPassword,
    });
    assert(
      'Đăng nhập với mật khẩu cũ bị từ chối chính xác',
      oldLoginFail.body.code === 0,
      oldLoginFail.body?.msg || JSON.stringify(oldLoginFail)
    );

    const newLoginSuccess = await request('POST', '/auth/login', {
      username: testUsername,
      password: newPassword,
    });
    assert(
      'Đăng nhập với mật khẩu mới thành công',
      newLoginSuccess.body.code === 1 && newLoginSuccess.body.data?.token,
      newLoginSuccess.body?.msg || JSON.stringify(newLoginSuccess)
    );
    userToken = newLoginSuccess.body.data?.token;

    // 1.6 Đổi mật khẩu rút tiền (Fund Password)
    const newFundPassword = 'newFund999';
    const changeFundPassRes = await request(
      'POST',
      '/user/change-password',
      {
        oldPassword: testFundPassword,
        newPassword: newFundPassword,
        type: 'fund',
      },
      userToken
    );
    assert(
      'Đổi mật khẩu rút tiền thành công',
      changeFundPassRes.body.code === 1,
      changeFundPassRes.body?.msg || JSON.stringify(changeFundPassRes)
    );

    // 1.7 Lấy captcha admin
    const captchaRes = await request('GET', '/admin/captcha');
    assert(
      'Lấy mã Captcha admin thành công',
      captchaRes.body.code === 1 && captchaRes.body.data?.key && captchaRes.body.data?.code,
      captchaRes.body?.msg || JSON.stringify(captchaRes)
    );

    // 1.8 Đăng nhập Admin
    const adminLoginRes = await request('POST', '/admin/login', {
      username: 'admin',
      password: 'admin888',
      captchaKey: captchaRes.body.data.key,
      captchaCode: captchaRes.body.data.code,
    });
    assert(
      'Đăng nhập quản trị viên (Admin) thành công',
      adminLoginRes.body.code === 1 && adminLoginRes.body.data?.token,
      adminLoginRes.body?.msg || JSON.stringify(adminLoginRes)
    );
    adminToken = adminLoginRes.body.data?.token;

    // 1.9 Lấy thông tin Admin Profile
    const adminMeRes = await request('GET', '/admin/me', null, adminToken);
    assert(
      'Lấy thông tin Admin Profile thành công',
      adminMeRes.body.code === 1 && adminMeRes.body.data?.username === 'admin',
      adminMeRes.body?.msg || JSON.stringify(adminMeRes)
    );

    // =========================================================================
    // PHẦN 2: KIỂM TRA ĐIỀU CHỈNH SỐ DƯ (MONEY / BALANCE / 上下分)
    // =========================================================================
    console.log('\n--- 2. KIỂM TRA ĐIỀU CHỈNH SỐ DƯ ---');

    // 2.1 Admin cộng tiền cho hội viên (+5,000 MYR)
    const addMoneyAmount = 5000.0;
    const addMoneyRes = await request(
      'POST',
      '/admin/user/balance',
      {
        userId: userId,
        amount: addMoneyAmount,
        type: 'add',
        memo: 'Thử nghiệm cộng số dư từ Admin',
      },
      adminToken
    );
    assert(
      'Admin cộng số dư (+5000) thành công',
      addMoneyRes.body.code === 1 &&
        parseFloat(addMoneyRes.body.data?.after_balance) === 5000.0,
      addMoneyRes.body?.msg || JSON.stringify(addMoneyRes)
    );

    // 2.2 Kiểm tra số dư hội viên sau khi được cộng
    const checkBalRes1 = await request('GET', '/auth/me', null, userToken);
    assert(
      'Số dư trong hồ sơ hội viên phản ánh đúng 5,000 MYR',
      parseFloat(checkBalRes1.body.data?.money) === 5000.0,
      `Money hiện tại: ${checkBalRes1.body.data?.money}`
    );

    // 2.3 Admin trừ tiền hội viên (-1,500 MYR)
    const subMoneyAmount = 1500.0;
    const subMoneyRes = await request(
      'POST',
      '/admin/user/score',
      {
        userId: userId,
        amount: subMoneyAmount,
        type: 'sub',
        memo: 'Thử nghiệm trừ số dư từ Admin',
      },
      adminToken
    );
    assert(
      'Admin trừ số dư (-1500) thành công',
      subMoneyRes.body.code === 1 &&
        parseFloat(subMoneyRes.body.data?.after_balance) === 3500.0,
      subMoneyRes.body?.msg || JSON.stringify(subMoneyRes)
    );

    // 2.4 Kiểm tra sổ cái fa_user_money_log đã ghi nhận giao dịch
    const [moneyLogs] = await pool.query(
      'SELECT * FROM fa_user_money_log WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );
    assert(
      'Sổ cái biến động số dư fa_user_money_log ghi nhận 2 giao dịch nạp/trừ chuẩn',
      moneyLogs.length >= 2,
      `Số bản ghi tìm thấy: ${moneyLogs.length}`
    );

    // 2.5 Kiểm tra cơ chế chống âm tiền (Trừ vượt quá số dư hiện tại)
    const excessiveSubRes = await request(
      'POST',
      '/admin/user/balance',
      {
        userId: userId,
        amount: 99999999,
        type: 'sub',
      },
      adminToken
    );
    assert(
      'Trừ tiền vượt số dư hiện tại bị chặn và báo lỗi an toàn',
      excessiveSubRes.body.code === 0,
      excessiveSubRes.body?.msg || JSON.stringify(excessiveSubRes)
    );

    // =========================================================================
    // PHẦN 3: KIỂM TRA ĐIỀU CHỈNH ĐIỂM SỐ TÍN NHIỆM (CREDIT SCORE / 信誉分)
    // =========================================================================
    console.log('\n--- 3. KIỂM TRA TĂNG / ĐIỀU CHỈNH ĐIỂM TÍN NHIỆM ---');

    // Mặc định user mới có credit_score = 100.
    // 3.1 Trừ điểm tín nhiệm (-25) -> điểm còn 75
    const subCreditRes = await request(
      'POST',
      '/admin/user/credit-score',
      {
        userId: userId,
        score: 25,
        type: 'sub',
        memo: 'Phạt điểm tín nhiệm',
      },
      adminToken
    );
    assert(
      'Trừ điểm tín nhiệm (-25) thành công (100 -> 75)',
      subCreditRes.body.code === 1 && subCreditRes.body.data?.after_score === 75,
      subCreditRes.body?.msg || JSON.stringify(subCreditRes)
    );

    // 3.2 Tăng điểm tín nhiệm (+15) -> điểm thành 90
    const addCreditRes = await request(
      'POST',
      '/admin/user/credit-score',
      {
        userId: userId,
        score: 15,
        type: 'add',
        memo: 'Tăng điểm tín nhiệm do nạp tiền',
      },
      adminToken
    );
    assert(
      'Tăng điểm số tín nhiệm (+15) thành công (75 -> 90)',
      addCreditRes.body.code === 1 && addCreditRes.body.data?.after_score === 90,
      addCreditRes.body?.msg || JSON.stringify(addCreditRes)
    );

    // 3.3 Đặt điểm trực tiếp (set = 88)
    const setCreditRes = await request(
      'POST',
      '/admin/user/score/credit',
      {
        userId: userId,
        score: 88,
        type: 'set',
        memo: 'Đặt điểm cố định',
      },
      adminToken
    );
    assert(
      'Đặt điểm tín nhiệm trực tiếp (set = 88) thành công',
      setCreditRes.body.code === 1 && setCreditRes.body.data?.after_score === 88,
      setCreditRes.body?.msg || JSON.stringify(setCreditRes)
    );

    // 3.4 Kiểm tra biên giới hạn trần: Tăng vượt quá 100 điểm vẫn giữ trần 100
    const overCreditRes = await request(
      'POST',
      '/admin/user/credit-score',
      {
        userId: userId,
        score: 500,
        type: 'add',
      },
      adminToken
    );
    assert(
      'Giới hạn trần điểm tín nhiệm không vượt quá 100',
      overCreditRes.body.code === 1 && overCreditRes.body.data?.after_score === 100,
      `Điểm nhận được: ${overCreditRes.body.data?.after_score}`
    );

    // 3.5 Kiểm tra biên giới hạn sàn: Trừ điểm xuống dưới 0 vẫn giữ sàn 0
    const underCreditRes = await request(
      'POST',
      '/admin/user/credit-score',
      {
        userId: userId,
        score: 500,
        type: 'sub',
      },
      adminToken
    );
    assert(
      'Giới hạn sàn điểm tín nhiệm không bị âm (tối thiểu 0)',
      underCreditRes.body.code === 1 && underCreditRes.body.data?.after_score === 0,
      `Điểm nhận được: ${underCreditRes.body.data?.after_score}`
    );

    // 3.6 Khôi phục lại điểm chuẩn 100 qua updateUserControl
    const controlRes = await request(
      'POST',
      '/admin/user/control',
      {
        userId: userId,
        credit_score: 100,
        kong_style: 0,
        fund_status: 1,
      },
      adminToken
    );
    assert(
      'Cập nhật cấu hình hội viên và điểm tín nhiệm qua /admin/user/control thành công',
      controlRes.body.code === 1,
      controlRes.body?.msg || JSON.stringify(controlRes)
    );

    // 3.7 Kiểm tra lại profile của user để đảm bảo data đồng bộ
    const finalProfile = await request('GET', '/auth/me', null, userToken);
    assert(
      'Profile hội viên đồng bộ hoàn hảo: Điểm tín nhiệm = 100, Số dư = 3,500 MYR',
      finalProfile.body.data?.credit_score === 100 &&
        parseFloat(finalProfile.body.data?.money) === 3500.0,
      `Điểm: ${finalProfile.body.data?.credit_score}, Tiền: ${finalProfile.body.data?.money}`
    );

    // =========================================================================
    // DỌN DẸP TEST USER (Đảm bảo DB không bị rác)
    // =========================================================================
    await pool.query('DELETE FROM fa_user_money_log WHERE user_id = ?', [userId]);
    await pool.query('DELETE FROM fa_user WHERE id = ?', [userId]);

    console.log('\n=================================================================');
    console.log(`🎉 TỔNG KẾT KIỂM THỬ: ${passedCount} PASS, ${failedCount} FAIL`);
    console.log('=================================================================');

    if (failedCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('💥 Lỗi không mong đợi trong quá trình test:', err);
    failedCount++;
  } finally {
    server.close();
    await pool.end();
    if (failedCount === 0) {
      console.log('✅ TẤT CẢ CÁC TEST CASE ĐÃ VƯỢT QUA 100% XUẤT SẮC!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

runTests();
