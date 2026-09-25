const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

// Danh sách cấu hình mặc định ban đầu cho hệ thống
const DEFAULT_CONFIGS = [
  // 1. Nhóm basic
  { name: 'name', group: 'basic', title: '站点名称', type: 'string', value: 'Spotline' },
  { name: 'web_name', group: 'basic', title: '网站品牌名', type: 'string', value: 'Spotline' },
  { name: 'default_frontend_lang', group: 'basic', title: '默认前台语言', type: 'string', value: 'zh-CN' },
  { name: 'currency_code', group: 'basic', title: '结算货币代码', type: 'string', value: 'USD' },
  { name: 'currency_short', group: 'basic', title: '货币符号', type: 'string', value: '$' },
  { name: 'currency_name', group: 'basic', title: '货币名称', type: 'string', value: 'US Dollar' },
  { name: 'enabled_langs', group: 'basic', title: '支持语言', type: 'string', value: 'zh-CN,en-US,vi-VN,ja-JP,ko-KR' },
  { name: 'invite_code_enable', group: 'basic', title: '注册是否必须邀请码', type: 'string', value: '0' },
  { name: 'need_bind_account', group: 'basic', title: '是否需要绑定账户', type: 'string', value: '1' },
  { name: 'kefu_script', group: 'basic', title: '客服外链', type: 'string', value: 'https://wa.me/6287713795721' },
  { name: 'kefu_url', group: 'basic', title: '在线客服URL', type: 'string', value: 'https://wa.me/6287713795721' },
  { name: 'trade_time', group: 'basic', title: '交易开放时间', type: 'string', value: '00:00-24:00' },
  { name: 'version', group: 'basic', title: '系统版本号', type: 'string', value: '1.0.65' },
  { name: 'bet_max', group: 'basic', title: '单笔最大下单', type: 'string', value: '50000000' },
  { name: 'bet_min', group: 'basic', title: '单笔最小下单', type: 'string', value: '2000' },
  { name: 'order_voice', group: 'basic', title: '下单语音提示', type: 'string', value: '0' },
  { name: 'withdraw_voice', group: 'basic', title: '提现语音提示', type: 'string', value: '0' },
  { name: 'quick_amounts_enable', group: 'basic', title: '开启充值快捷金额', type: 'string', value: '1' },
  { name: 'quick_amounts', group: 'basic', title: '快捷充值金额', type: 'string', value: '100,500,1000,2000,5000,10000' },
  { name: 'black_ips', group: 'basic', title: '黑名单IP列表', type: 'array', value: '[]' },

  // 2. Nhóm recharge (Nạp tiền)
  { name: 'min_chongzhi', group: 'recharge', title: '最低充值金额', type: 'string', value: '100' },
  { name: 'max_chongzhi', group: 'recharge', title: '最高充值金额', type: 'string', value: '1000000' },
  { name: 'web_bank_name', group: 'recharge', title: '平台收款银行', type: 'string', value: 'Maybank Malaysia' },
  { name: 'web_bank_place', group: 'recharge', title: '开户支行', type: 'string', value: 'Kuala Lumpur Branch' },
  { name: 'web_bank_user', group: 'recharge', title: '收款人姓名', type: 'string', value: 'SPOTLINE OFFICIAL LTD' },
  { name: 'web_bank_number', group: 'recharge', title: '收款卡号', type: 'string', value: '514271829102' },
  { name: 'web_bank_tips', group: 'recharge', title: '充值提示说明', type: 'string', value: '尊敬的用户：自主余额充值通道目前正在进行系统维护与升级。如果您需要对账户余额进行充值，请联系在线客服。' },
  { name: 'bank_status', group: 'recharge', title: '银行卡充值开关', type: 'string', value: '1' },
  { name: 'usdt_status', group: 'recharge', title: 'USDT充值开关', type: 'string', value: '1' },
  { name: 'usdt_address', group: 'recharge', title: 'USDT-TRC20收款地址', type: 'string', value: 'TN7sOfficialDepositWalletAddressTrc20' },
  { name: 'usdt_cny_rate', group: 'recharge', title: 'USDT汇率换算', type: 'string', value: '4.07' },

  // 3. Nhóm cashout (Rút tiền)
  { name: 'save_bank_info', group: 'cashout', title: '保存银行卡信息', type: 'string', value: '1' },
  { name: 'cny_open', group: 'cashout', title: '法币出金开关', type: 'string', value: '1' },
  { name: 'usdt_open', group: 'cashout', title: 'USDT出金开关', type: 'string', value: '1' },
  { name: 'tx_min_tixian', group: 'cashout', title: '单笔最低提现', type: 'string', value: '100' },
  { name: 'tx_max_tixian', group: 'cashout', title: '单笔最高提现', type: 'string', value: '50000000000' },
  { name: 'tx_max_times', group: 'cashout', title: '每日提现次数', type: 'string', value: '50' },
  { name: 'cashout_start_time', group: 'cashout', title: '出金开放开始小时', type: 'string', value: '0' },
  { name: 'cashout_end_time', group: 'cashout', title: '出金开放结束小时', type: 'string', value: '24' },
  { name: 'tx_text_chaoxian_cishu', group: 'cashout', title: '超限次数提示语', type: 'string', value: '尊敬的会员：受监管限制，今日出金次数已达上限，请于明日继续提交。' },
  { name: 'tx_text_no_time', group: 'cashout', title: '非开放时间提示语', type: 'string', value: '尊敬的会员：请在指定出金时间内提交申请（09:00 - 20:00）。' },
  { name: 'tx_rate_limit', group: 'cashout', title: '提现汇率限制', type: 'string', value: '0' },
  { name: 'tx_fee_rate', group: 'cashout', title: '提现手续费率(%)', type: 'string', value: '0' },

  // 4. Nhóm stock & trade
  { name: 'trade_type', group: 'stock', title: '交易模式', type: 'string', value: 'usdt' },

  // 5. Nhóm message
  { name: 'register_message_enable', group: 'message', title: '开启注册站内信', type: 'string', value: '1' },
  { name: 'register_message_content', group: 'message', title: '注册站内信内容', type: 'string', value: '欢迎来到SPOT！感谢您选择我们平台。' },

  // 6. Nhóm other
  { name: 'vip_show', group: 'other', title: '前台显示VIP等级', type: 'string', value: '1' },
  { name: 'vip', group: 'other', title: 'VIP等级配置', type: 'string', value: '{"1":"0","2":"1","3":"2","4":"3","5":"4","6":"5","7":"6","8":"7","9":"8"}' },
  { name: 'mpsswd_show', group: 'other', title: '前台显示资金密码', type: 'string', value: '1' },
  { name: 'play_type', group: 'other', title: '玩法模式', type: 'string', value: '1' },
  { name: 'profit_time', group: 'other', title: '结息时间段', type: 'string', value: '09:00-22:00' },
];

/**
 * Lấy toàn bộ cấu hình hệ thống (Tự động nạp dữ liệu mặc định nếu bảng đang rỗng)
 * Route: GET /api/admin/general/config
 */
async function getAllConfigs(req, res) {
  try {
    let [rows] = await pool.query('SELECT * FROM fa_config ORDER BY `group` ASC, id ASC');

    // Nếu bảng fa_config chưa có dữ liệu -> Tự động nạp toàn bộ cấu hình mặc định vào database
    if (rows.length === 0) {
      for (const item of DEFAULT_CONFIGS) {
        await pool.query(
          'INSERT IGNORE INTO fa_config (`name`, `group`, `title`, `type`, `value`) VALUES (?, ?, ?, ?, ?)',
          [item.name, item.group, item.title, item.type, item.value]
        );
      }
      [rows] = await pool.query('SELECT * FROM fa_config ORDER BY `group` ASC, id ASC');
    }

    const groupMap = {};
    rows.forEach((item) => {
      if (!groupMap[item.group]) groupMap[item.group] = [];
      groupMap[item.group].push(item);
    });
    return success(res, 'Lấy cấu hình thành công', { list: rows, grouped: groupMap });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Cập nhật cấu hình hệ thống
 * Route: POST /api/admin/general/config
 */
async function updateConfigs(req, res) {
  try {
    const configs = req.body; // { min_chongzhi: '100', usdt_cny_rate: '4.07', ... }

    for (const [key, val] of Object.entries(configs)) {
      // Dùng UPSERT: Nếu key đã có thì cập nhật value, nếu chưa có thì thêm mới vào fa_config
      await pool.query(
        'INSERT INTO fa_config (`name`, `value`, `group`, `title`, `type`) VALUES (?, ?, "basic", ?, "string") ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
        [key, String(val), key]
      );
    }

    return success(res, 'Cập nhật cấu hình thành công');
  } catch (err) {
    return error(res, 'Lỗi cập nhật cấu hình: ' + err.message);
  }
}

/**
 * Quản lý IP Whitelist
 * Route: GET /api/admin/ipwhitelist
 */
async function getIpWhitelist(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM fa_ip_filter WHERE type = 'whitelist' ORDER BY id DESC");
    return success(res, 'Lấy IP whitelist thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Thêm IP Whitelist
 * Route: POST /api/admin/ipwhitelist
 */
async function addIpWhitelist(req, res) {
  try {
    const { ip, remark } = req.body;
    if (!ip) return error(res, 'Vui lòng nhập IP');

    const [result] = await pool.query(
      "INSERT INTO fa_ip_filter (ip, type, remark, status, created_at) VALUES (?, 'whitelist', ?, 1, NOW())",
      [ip.trim(), remark || '']
    );

    return success(res, 'Thêm IP thành công', { id: result.insertId });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Xóa IP Whitelist
 * Route: DELETE /api/admin/ipwhitelist/:id
 */
async function deleteIpWhitelist(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fa_ip_filter WHERE id = ?', [id]);
    return success(res, 'Đã xóa IP khỏi whitelist');
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = {
  getAllConfigs,
  updateConfigs,
  getIpWhitelist,
  addIpWhitelist,
  deleteIpWhitelist,
};
