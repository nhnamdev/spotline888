const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { pool } = require('../config/db');


/**
 * Migration & Seeder đưa toàn bộ dữ liệu mẫu / hardcoded còn lại vào cơ sở dữ liệu MySQL
 */
async function seedRemainingData() {
  const connection = await pool.getConnection();
  try {
    console.log('🔄 [Seed Remaining] Đang bắt đầu seed toàn bộ dữ liệu còn lại vào MySQL...');

    // 1. fa_loan_config (4 Gói vay tín chấp)
    console.log('💰 1. Đang seed cấu hình gói vay fa_loan_config...');
    const loanConfigs = [
      {
        id: 1,
        name: "5天快贷，支持用户存款到达50000元以上贷款。",
        days: 5,
        daily_rate: 0.0008,
        min_amount: 2000.00,
        max_amount: 50000.00,
        status: 1,
        weigh: 1
      },
      {
        id: 4,
        name: "7天快贷，支持用户存款到达100000元以上贷款。",
        days: 7,
        daily_rate: 0.0010,
        min_amount: 20000.00,
        max_amount: 100000.00,
        status: 1,
        weigh: 1
      },
      {
        id: 2,
        name: "15天快贷，支持用户存款到达300000元以上贷款。",
        days: 15,
        daily_rate: 0.0015,
        min_amount: 200000.00,
        max_amount: 500000.00,
        status: 1,
        weigh: 2
      },
      {
        id: 7,
        name: "30天快贷，支持用户存款到达500000元以上贷款。",
        days: 30,
        daily_rate: 0.0020,
        min_amount: 500000.00,
        max_amount: 1000000.00,
        status: 1,
        weigh: 4
      }
    ];

    for (const item of loanConfigs) {
      await connection.query(`
        INSERT INTO fa_loan_config (id, name, days, daily_rate, min_amount, max_amount, status, weigh, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          days = VALUES(days),
          daily_rate = VALUES(daily_rate),
          min_amount = VALUES(min_amount),
          max_amount = VALUES(max_amount),
          status = VALUES(status),
          weigh = VALUES(weigh)
      `, [item.id, item.name, item.days, item.daily_rate, item.min_amount, item.max_amount, item.status, item.weigh]);
    }
    console.log(`   -> Đã hoàn thành seed ${loanConfigs.length} gói vay vào fa_loan_config`);

    // 2. fa_yuebao_config (5 Gói tiết kiệm Quỹ Yu'e Bao)
    console.log('🏦 2. Đang seed cấu hình Quỹ Yu\'e Bao fa_yuebao_config...');
    const yuebaoConfigs = [
      { id: 6, title: "5", radio: "1.00-1.21%", day: 5, min_rate: 0.0100, max_rate: 0.0121, min_money: "10000.00-50000", status: 1 },
      { id: 5, title: "7", radio: "2.00-2.21%", day: 7, min_rate: 0.0200, max_rate: 0.0221, min_money: "50000.00-600000", status: 1 },
      { id: 4, title: "10", radio: "3.00-3.21%", day: 10, min_rate: 0.0300, max_rate: 0.0321, min_money: "200000.00-900000.00", status: 1 },
      { id: 3, title: "15", radio: "4.00-4.21%", day: 15, min_rate: 0.0400, max_rate: 0.0421, min_money: "500000.00-5000000.00", status: 1 },
      { id: 1, title: "30", radio: "5.00-5.21%", day: 30, min_rate: 0.0500, max_rate: 0.0521, min_money: "10000.00-50000000.00", status: 1 }
    ];

    for (const item of yuebaoConfigs) {
      await connection.query(`
        INSERT INTO fa_yuebao_config (id, title, day, radio, min_rate, max_rate, min_money, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          day = VALUES(day),
          radio = VALUES(radio),
          min_rate = VALUES(min_rate),
          max_rate = VALUES(max_rate),
          min_money = VALUES(min_money),
          status = VALUES(status)
      `, [item.id, item.title, item.day, item.radio, item.min_rate, item.max_rate, item.min_money, item.status]);
    }
    console.log(`   -> Đã hoàn thành seed ${yuebaoConfigs.length} cấu hình Yu'e Bao vào fa_yuebao_config`);

    // 3. fa_product_type (3 Loại sản phẩm)
    console.log('📦 3. Đang seed phân loại sản phẩm fa_product_type...');
    const productTypes = [
      { id: 1, name: "虚拟币", rank: 1000, status: 1 },
      { id: 2, name: "外汇", rank: 1000, status: 1 },
      { id: 3, name: "商品", rank: 1000, status: 1 }
    ];

    for (const pt of productTypes) {
      await connection.query(`
        INSERT INTO fa_product_type (id, name, \`rank\`, status, created_at)
        VALUES (?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          \`rank\` = VALUES(\`rank\`),
          status = VALUES(status)
      `, [pt.id, pt.name, pt.rank, pt.status]);
    }
    console.log(`   -> Đã hoàn thành seed ${productTypes.length} loại sản phẩm vào fa_product_type`);

    // 4. fa_product (10 Sản phẩm Crypto & Hàng hóa từ AdminProductListContent)
    console.log('🪙 4. Đang seed danh sách sản phẩm fa_product...');
    const products = [
      { id: 340, weigh: 220, code: "BTC", title: "BTC/USDT", image: "/uploads/20251103/e4063309d0783b20b4a4f229b9aeccb2.png", type_id: 1, price: 66343.07, is_open: 1, status: 1 },
      { id: 349, weigh: 208, code: "TRX", title: "TRX/USDT", image: "/uploads/20251103/eb48feb407a9617a4723f44265c14f96.png", type_id: 1, price: 0.281531, is_open: 1, status: 1 },
      { id: 347, weigh: 207, code: "DOT", title: "DOT/USDT", image: "/uploads/20251103/6c57613336dc4a7cb082d8267aacf0a1.png", type_id: 1, price: 1.5163, is_open: 1, status: 1 },
      { id: 341, weigh: 206, code: "LINK", title: "LINK/USDT", image: "/uploads/20251103/e7b47802446b12cea02cff2b5aee1ee3.png", type_id: 1, price: 8.70, is_open: 1, status: 1 },
      { id: 351, weigh: 205, code: "BCH", title: "BCH/USDT", image: "/uploads/20251103/0a71c2d5dcfcf70fd748ac23561deda9.png", type_id: 1, price: 438.43, is_open: 1, status: 1 },
      { id: 343, weigh: 204, code: "ETC", title: "ETC/USDT", image: "/uploads/20251103/5fb3aee9e34e569992f98e6c4ea05ea0.png", type_id: 1, price: 8.5479, is_open: 1, status: 1 },
      { id: 378, weigh: 200, code: "GOLD", title: "黄金/伦敦金", image: "/uploads/20250811/72eb62a1a0dfc0df8e874945d8b74614.png", type_id: 3, price: 3971.20, is_open: 0, status: 1 },
      { id: 379, weigh: 199, code: "Silver", title: "白银/伦敦银", image: "/uploads/20250811/d1e1f78eaec7ca09ec6149f1ca92ee14.png", type_id: 3, price: 47.943, is_open: 0, status: 1 },
      { id: 380, weigh: 198, code: "Aluminum", title: "铝", image: "/uploads/20250811/d854eb0c968f51dfa1f868c62b535d48.png", type_id: 3, price: 2824.55, is_open: 0, status: 1 },
      { id: 377, weigh: 197, code: "Zinc", title: "锌", image: "/uploads/20250811/e93910c5da8cb4c062c3e100f7e4367c.png", type_id: 3, price: 3033.69, is_open: 0, status: 1 }
    ];

    for (const p of products) {
      await connection.query(`
        INSERT INTO fa_product (id, weigh, code, title, image, type_id, price, is_open, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          weigh = VALUES(weigh),
          code = VALUES(code),
          title = VALUES(title),
          image = VALUES(image),
          type_id = VALUES(type_id),
          price = VALUES(price),
          is_open = VALUES(is_open),
          status = VALUES(status)
      `, [p.id, p.weigh, p.code, p.title, p.image, p.type_id, p.price, p.is_open, p.status]);
    }
    console.log(`   -> Đã hoàn thành seed ${products.length} sản phẩm vào fa_product`);

    // 5. fa_notice (Thông báo hệ thống từ noticeData.ts)
    console.log('📢 5. Đang seed thông báo fa_notice...');
    const notices = [
      {
        id: 5,
        type: 3,
        title: "隐私政策",
        url: null,
        short_content: "简介",
        content: "<p>内容1内容1内容1内容1内容1内容1内容1内容1<strong>内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1</strong></p>",
        rank: 1000,
        status: 1
      },
      {
        id: 4,
        type: 1,
        title: "公司使命：提供安全且易于使用的数字资产服务",
        url: null,
        short_content: "我们是一家专注于线上数字资产服务的平台，致力于让东南亚用户更轻松地访问和管理他们的加密资产。我们的目标是让加密货币交易变得便捷、快速，并让所有用户都能轻松参与。温馨提醒：如果您是高净值收入人群，需要进行大额（175,000,000 IDR）投资，请优先联系客服办理开通本公司的国际VIP通道，避免影响您的投资体验。一次办理，终身享用。",
        content: "<p>打造老百姓身边的<span class=\"color-text\">理财顾问</span>，并致力于成为居民财富管理的&ldquo;引领者&rdquo;</p>\r\n<p>打造企业家信任的<span class=\"color-text\">投资银行专家</span>，并致力于成为实体经济的&ldquo;服务者&rdquo;</p>\r\n<p>打造机构客户依赖的<span class=\"color-text\">全链条服务商</span>，并致力于成为机构客户的&ldquo;护航者&rdquo;</p>\r\n<p>打造国际市场综合的<span class=\"color-text\">业务提供商</span>，并致力于成为双循环格局的&ldquo;推动者&rdquo;</p>\r\n<p>打造资本市场专业的<span class=\"color-text\">投资交易商</span>，并致力于成为资本市场的&ldquo;示范者&rdquo;</p>",
        rank: 1000,
        status: 1
      }
    ];

    for (const n of notices) {
      await connection.query(`
        INSERT INTO fa_notice (id, type, title, url, short_content, content, \`rank\`, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          type = VALUES(type),
          title = VALUES(title),
          url = VALUES(url),
          short_content = VALUES(short_content),
          content = VALUES(content),
          \`rank\` = VALUES(\`rank\`),
          status = VALUES(status)
      `, [n.id, n.type, n.title, n.url, n.short_content, n.content, n.rank, n.status]);
    }
    console.log(`   -> Đã hoàn thành seed ${notices.length} thông báo vào fa_notice`);

    // 6. fa_auth_group (Nhóm quyền Admin)
    console.log('👥 6. Đang seed nhóm quyền fa_auth_group...');
    const authGroups = [
      { id: 1, pid: 0, name: "Admin group", rules: "*", status: "normal" },
      { id: 10, pid: 1, name: "├ 代理", rules: "13,14,16,15,17,146,147,148,218,219,125,126,127,128,129,130,131,132,175,228,149,150,151,152,173,153,154,155,156,174,208,209,210,211,212,213,214,215,216,217,225,226,227,235,236,237,238,240,242,243,244,245,246,231,232,1,96,66,97,98,204,205,203,224,234,239,233,229,230", status: "normal" },
      { id: 11, pid: 10, name: "│ └ 超级会员", rules: "13,14,16,15,17,146,147,148,125,126,127,128,129,130,131,132,175,149,150,151,152,173,1,96,66,97", status: "normal" },
      { id: 12, pid: 1, name: "└ 分组", rules: "66,96,125,126,127,128,129,130,131,132,146,147,148,149,150,153,156,174,175,218,219,228,229,97,98", status: "normal" }
    ];

    for (const g of authGroups) {
      await connection.query(`
        INSERT INTO fa_auth_group (id, pid, name, rules, status, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          pid = VALUES(pid),
          name = VALUES(name),
          rules = VALUES(rules),
          status = VALUES(status)
      `, [g.id, g.pid, g.name, g.rules, g.status]);
    }
    console.log(`   -> Đã hoàn thành seed ${authGroups.length} nhóm quyền vào fa_auth_group`);

    // 7. fa_attachment (50 Tệp đính kèm)
    console.log('📎 7. Đang seed tệp đính kèm fa_attachment...');
    const attachmentsPath = path.resolve(__dirname, 'data/attachments.json');
    if (fs.existsSync(attachmentsPath)) {
      const rawAttachments = JSON.parse(fs.readFileSync(attachmentsPath, 'utf-8'));
      if (Array.isArray(rawAttachments)) {
        for (const att of rawAttachments) {
          await connection.query(`
            INSERT INTO fa_attachment (id, admin_id, user_id, url, imagewidth, imageheight, imagetype, imageframes, filesize, mimetype, extparam, storage, sha1, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
              url = VALUES(url),
              imagewidth = VALUES(imagewidth),
              imageheight = VALUES(imageheight),
              imagetype = VALUES(imagetype),
              filesize = VALUES(filesize),
              mimetype = VALUES(mimetype),
              storage = VALUES(storage)
          `, [
            att.id,
            att.admin_id || 0,
            att.user_id ? Number(att.user_id) : 0,
            att.url,
            att.imagewidth || '',
            att.imageheight || '',
            att.imagetype || '',
            att.imageframes || 0,
            att.filesize || 0,
            att.mimetype || '',
            att.extparam || null,
            att.storage || 'local',
            att.sha1 || ''
          ]);
        }
        console.log(`   -> Đã hoàn thành seed ${rawAttachments.length} tệp đính kèm vào fa_attachment`);
      }
    }

    // 8. fa_auth_rule (128 Quy tắc menu FastAdmin)
    console.log('📋 8. Đang seed danh sách quy tắc menu fa_auth_rule...');
    const authRulesPath = path.resolve(__dirname, 'data/authRules.json');
    if (fs.existsSync(authRulesPath)) {
      const authRules = JSON.parse(fs.readFileSync(authRulesPath, 'utf-8'));
      if (Array.isArray(authRules)) {
        for (const rule of authRules) {
          await connection.query(`
            INSERT INTO fa_auth_rule (id, pid, name, title, icon, \`condition\`, remark, ismenu, weigh, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, IF(? > 0, FROM_UNIXTIME(?), NOW()))
            ON DUPLICATE KEY UPDATE
              pid = VALUES(pid),
              title = VALUES(title),
              icon = VALUES(icon),
              \`condition\` = VALUES(\`condition\`),
              remark = VALUES(remark),
              ismenu = VALUES(ismenu),
              weigh = VALUES(weigh),
              status = VALUES(status)
          `, [
            rule.id,
            rule.pid || 0,
            rule.name,
            rule.title || '',
            rule.icon || '',
            rule.condition || '',
            rule.remark || '',
            rule.ismenu !== undefined ? rule.ismenu : 1,
            rule.weigh || 0,
            rule.status || 'normal',
            rule.createtime || 0,
            rule.createtime || 0
          ]);
        }
        console.log(`   -> Đã hoàn thành seed ${authRules.length} quy tắc vào fa_auth_rule`);
      }
    }

    // 9. fa_admin_log (10 Nhật ký quản trị viên)
    console.log('📝 9. Đang seed nhật ký quản trị fa_admin_log...');
    const adminLogsPath = path.resolve(__dirname, 'data/adminLogs.json');
    if (fs.existsSync(adminLogsPath)) {
      const adminLogs = JSON.parse(fs.readFileSync(adminLogsPath, 'utf-8'));
      if (Array.isArray(adminLogs)) {
        for (const log of adminLogs) {
          await connection.query(`
            INSERT INTO fa_admin_log (id, admin_id, username, url, title, content, ip, useragent, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, IF(? > 0, FROM_UNIXTIME(?), NOW()))
            ON DUPLICATE KEY UPDATE
              title = VALUES(title),
              content = VALUES(content),
              ip = VALUES(ip),
              useragent = VALUES(useragent)
          `, [
            log.id,
            log.admin_id || 1,
            log.username || 'admin',
            log.url || '',
            log.title || '',
            log.content || '',
            log.ip || '',
            log.useragent || '',
            log.createtime || 0,
            log.createtime || 0
          ]);
        }
        console.log(`   -> Đã hoàn thành seed ${adminLogs.length} nhật ký vào fa_admin_log`);
      }
    }


    console.log('🌟 [Seed Remaining] ĐÃ HOÀN THÀNH TOÀN BỘ MIGRATION DỮ LIỆU CÒN LẠI VÀO DATABASE!');
  } catch (err) {
    console.error('❌ Lỗi khi seed dữ liệu còn lại:', err);
    throw err;
  } finally {
    connection.release();
  }
}

if (require.main === module) {
  seedRemainingData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedRemainingData };
