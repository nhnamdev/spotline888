const { pool } = require('../config/db');
const { hashPassword } = require('../utils/hash');

async function initSchema() {
  const connection = await pool.getConnection();
  try {
    console.log('🔄 [DB Migration] Bắt đầu khởi tạo cấu trúc bảng...');

    // 1. fa_admin
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_admin\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`username\` VARCHAR(50) NOT NULL,
        \`nickname\` VARCHAR(50) NOT NULL DEFAULT '',
        \`password\` VARCHAR(100) NOT NULL,
        \`salt\` VARCHAR(30) NOT NULL DEFAULT '',
        \`avatar\` VARCHAR(255) DEFAULT NULL,
        \`email\` VARCHAR(100) DEFAULT NULL,
        \`mobile\` VARCHAR(20) DEFAULT NULL,
        \`room_id\` VARCHAR(50) DEFAULT NULL,
        \`kefu_url\` VARCHAR(255) DEFAULT NULL,
        \`login_failure\` TINYINT UNSIGNED NOT NULL DEFAULT 0,
        \`logintime\` DATETIME DEFAULT NULL,
        \`loginip\` VARCHAR(50) DEFAULT NULL,
        \`status\` ENUM('normal','hidden') NOT NULL DEFAULT 'normal',
        \`memo\` VARCHAR(255) DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_username\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. fa_auth_group
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_auth_group\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`pid\` INT UNSIGNED NOT NULL DEFAULT 0,
        \`name\` VARCHAR(100) NOT NULL,
        \`rules\` TEXT NOT NULL,
        \`status\` ENUM('normal','hidden') NOT NULL DEFAULT 'normal',
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_pid\` (\`pid\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. fa_auth_group_access
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_auth_group_access\` (
        \`uid\` INT UNSIGNED NOT NULL,
        \`group_id\` INT UNSIGNED NOT NULL,
        PRIMARY KEY (\`uid\`, \`group_id\`),
        KEY \`idx_group_id\` (\`group_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. fa_auth_rule
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_auth_rule\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`pid\` INT UNSIGNED NOT NULL DEFAULT 0,
        \`name\` VARCHAR(100) NOT NULL,
        \`title\` VARCHAR(100) NOT NULL,
        \`icon\` VARCHAR(50) DEFAULT NULL,
        \`condition\` VARCHAR(255) DEFAULT NULL,
        \`remark\` VARCHAR(255) DEFAULT NULL,
        \`ismenu\` TINYINT(1) NOT NULL DEFAULT 0,
        \`weigh\` INT NOT NULL DEFAULT 0,
        \`status\` ENUM('normal','hidden') NOT NULL DEFAULT 'normal',
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_name\` (\`name\`),
        KEY \`idx_pid\` (\`pid\`),
        KEY \`idx_weigh\` (\`weigh\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. fa_admin_log
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_admin_log\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`admin_id\` INT UNSIGNED NOT NULL DEFAULT 0,
        \`username\` VARCHAR(50) NOT NULL DEFAULT '',
        \`url\` VARCHAR(1500) NOT NULL DEFAULT '',
        \`title\` VARCHAR(255) NOT NULL DEFAULT '',
        \`content\` LONGTEXT DEFAULT NULL,
        \`ip\` VARCHAR(50) NOT NULL DEFAULT '',
        \`useragent\` VARCHAR(255) NOT NULL DEFAULT '',
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_admin_id\` (\`admin_id\`),
        KEY \`idx_ip\` (\`ip\`),
        KEY \`idx_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. fa_config
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_config\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(50) NOT NULL,
        \`group\` VARCHAR(30) NOT NULL DEFAULT 'basic',
        \`title\` VARCHAR(100) NOT NULL DEFAULT '',
        \`tip\` VARCHAR(255) DEFAULT NULL,
        \`type\` VARCHAR(30) NOT NULL DEFAULT 'string',
        \`value\` LONGTEXT DEFAULT NULL,
        \`content\` TEXT DEFAULT NULL,
        \`rule\` VARCHAR(100) DEFAULT NULL,
        \`extend\` VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_name\` (\`name\`),
        KEY \`idx_group\` (\`group\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. fa_user
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_user\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`account\` VARCHAR(50) NOT NULL,
        \`username\` VARCHAR(50) NOT NULL DEFAULT '',
        \`real_name\` VARCHAR(100) DEFAULT NULL,
        \`password\` VARCHAR(100) NOT NULL,
        \`mpassword\` VARCHAR(100) DEFAULT NULL,
        \`salt\` VARCHAR(30) NOT NULL DEFAULT '',
        \`phone\` VARCHAR(30) DEFAULT NULL,
        \`email\` VARCHAR(100) DEFAULT NULL,
        \`avatar\` VARCHAR(255) DEFAULT '/assets/img/2.png',
        \`money\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`usdt\` DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
        \`freeze_funds\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`yuebao_balance\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`credit_score\` INT NOT NULL DEFAULT 100,
        \`level\` TINYINT UNSIGNED NOT NULL DEFAULT 1,
        \`invite_code\` VARCHAR(20) NOT NULL,
        \`agent_id\` INT UNSIGNED NOT NULL DEFAULT 0,
        \`is_agent\` TINYINT(1) NOT NULL DEFAULT 0,
        \`is_real\` TINYINT(1) NOT NULL DEFAULT 1,
        \`kong_style\` TINYINT NOT NULL DEFAULT 0,
        \`is_auth\` TINYINT NOT NULL DEFAULT 0,
        \`fund_status\` TINYINT(1) NOT NULL DEFAULT 0,
        \`say_limit\` TINYINT(1) NOT NULL DEFAULT 0,
        \`status\` TINYINT(1) NOT NULL DEFAULT 1,
        \`login_token\` VARCHAR(255) DEFAULT NULL,
        \`reg_ip\` VARCHAR(50) DEFAULT NULL,
        \`reg_time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`last_login_ip\` VARCHAR(50) DEFAULT NULL,
        \`last_login_time\` DATETIME DEFAULT NULL,
        \`remark\` VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_account\` (\`account\`),
        UNIQUE KEY \`idx_invite_code\` (\`invite_code\`),
        KEY \`idx_phone\` (\`phone\`),
        KEY \`idx_real_name\` (\`real_name\`),
        KEY \`idx_agent_id\` (\`agent_id\`),
        KEY \`idx_is_auth\` (\`is_auth\`),
        KEY \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. fa_user_verify
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_user_verify\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`real_name\` VARCHAR(100) NOT NULL,
        \`id_card\` VARCHAR(50) NOT NULL,
        \`id_img_front\` VARCHAR(255) NOT NULL,
        \`id_img_back\` VARCHAR(255) NOT NULL,
        \`id_img_hand\` VARCHAR(255) DEFAULT NULL,
        \`profession\` VARCHAR(100) DEFAULT NULL,
        \`status\` TINYINT NOT NULL DEFAULT 1,
        \`error_reason\` VARCHAR(255) DEFAULT NULL,
        \`audit_admin_id\` INT UNSIGNED DEFAULT NULL,
        \`audit_time\` DATETIME DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 9. fa_user_bank
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_user_bank\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`type\` ENUM('bank','usdt_trc20','usdt_erc20') NOT NULL DEFAULT 'bank',
        \`bank_name\` VARCHAR(100) DEFAULT NULL,
        \`bank_branch\` VARCHAR(100) DEFAULT NULL,
        \`card_number\` VARCHAR(100) NOT NULL,
        \`account_holder\` VARCHAR(100) NOT NULL,
        \`nationality\` VARCHAR(50) DEFAULT NULL,
        \`is_default\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 10. fa_user_money_log
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_user_money_log\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`currency\` VARCHAR(10) NOT NULL DEFAULT 'MYR',
        \`type\` VARCHAR(30) NOT NULL,
        \`money\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`before_balance\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`after_balance\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`memo\` VARCHAR(255) NOT NULL,
        \`ext_id\` INT UNSIGNED DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_type\` (\`type\`),
        KEY \`idx_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 11. fa_upmark
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_upmark\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`order_sn\` VARCHAR(50) NOT NULL,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`money\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`balance\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`pay_type\` VARCHAR(50) NOT NULL DEFAULT 'bank',
        \`voucher_img\` VARCHAR(255) DEFAULT NULL,
        \`member_note\` VARCHAR(255) DEFAULT NULL,
        \`source_ip\` VARCHAR(50) DEFAULT NULL,
        \`status\` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        \`check_account\` VARCHAR(50) DEFAULT NULL,
        \`check_time\` DATETIME DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_order_sn\` (\`order_sn\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 12. fa_downmark
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_downmark\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`order_sn\` VARCHAR(50) NOT NULL,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`amount\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`fee\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`actual_amount\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`convert_amount\` VARCHAR(50) DEFAULT NULL,
        \`withdraw_type\` ENUM('bank_card','usdt') NOT NULL DEFAULT 'bank_card',
        \`real_name\` VARCHAR(100) NOT NULL,
        \`bank_name\` VARCHAR(100) NOT NULL,
        \`card_number\` VARCHAR(100) NOT NULL,
        \`bank_branch\` VARCHAR(100) DEFAULT NULL,
        \`balance_before\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`balance_after\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`status\` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        \`note\` VARCHAR(255) DEFAULT NULL,
        \`source_ip\` VARCHAR(50) DEFAULT NULL,
        \`check_admin_id\` INT UNSIGNED DEFAULT NULL,
        \`check_time\` DATETIME DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`idx_order_sn\` (\`order_sn\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 13. fa_product_type & fa_product & fa_order
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_product_type\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(50) NOT NULL,
        \`rank\` INT NOT NULL DEFAULT 1000,
        \`status\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_product\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`type_id\` INT UNSIGNED NOT NULL,
        \`code\` VARCHAR(30) NOT NULL,
        \`title\` VARCHAR(50) NOT NULL,
        \`image\` VARCHAR(255) DEFAULT NULL,
        \`price\` DECIMAL(18, 8) NOT NULL DEFAULT 0.00000000,
        \`is_open\` TINYINT(1) NOT NULL DEFAULT 1,
        \`status\` TINYINT(1) NOT NULL DEFAULT 1,
        \`weigh\` INT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_type_id\` (\`type_id\`),
        KEY \`idx_code\` (\`code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_order\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`product_id\` INT UNSIGNED NOT NULL,
        \`product_title\` VARCHAR(50) NOT NULL,
        \`ostyle\` ENUM('buy_up','buy_down') NOT NULL,
        \`buy_money\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`balance_after\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`buy_price\` DECIMAL(18, 8) NOT NULL,
        \`sell_price\` DECIMAL(18, 8) DEFAULT NULL,
        \`duration\` INT NOT NULL DEFAULT 60,
        \`yield_rate\` DECIMAL(5, 2) NOT NULL DEFAULT 85.00,
        \`type_desc\` VARCHAR(50) DEFAULT NULL,
        \`ploss\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`kong_type\` ENUM('default','win','loss','closed') NOT NULL DEFAULT 'default',
        \`status\` ENUM('holding','settled') NOT NULL DEFAULT 'holding',
        \`buy_time\` DATETIME NOT NULL,
        \`sell_time\` DATETIME NOT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_product_id\` (\`product_id\`),
        KEY \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 14. fa_category & fa_notice & fa_message
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_category\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`pid\` INT UNSIGNED NOT NULL DEFAULT 0,
        \`type\` VARCHAR(30) NOT NULL DEFAULT 'banner',
        \`name\` VARCHAR(100) NOT NULL,
        \`image\` VARCHAR(255) DEFAULT NULL,
        \`url\` VARCHAR(255) DEFAULT NULL,
        \`weigh\` INT NOT NULL DEFAULT 0,
        \`status\` ENUM('normal','hidden') NOT NULL DEFAULT 'normal',
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_type\` (\`type\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_notice\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`type\` TINYINT NOT NULL DEFAULT 1,
        \`title\` VARCHAR(255) NOT NULL,
        \`short_content\` TEXT DEFAULT NULL,
        \`content\` LONGTEXT NOT NULL,
        \`url\` VARCHAR(255) DEFAULT NULL,
        \`rank\` INT NOT NULL DEFAULT 1000,
        \`status\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_type\` (\`type\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_message\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`user_id\` INT UNSIGNED NOT NULL DEFAULT 0,
        \`title\` VARCHAR(255) NOT NULL DEFAULT 'System Notice',
        \`content\` TEXT NOT NULL,
        \`is_read\` TINYINT(1) NOT NULL DEFAULT 0,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 15. fa_yuebao_config & fa_yuebao_order
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_yuebao_config\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`title\` VARCHAR(100) NOT NULL,
        \`day\` INT NOT NULL DEFAULT 1,
        \`radio\` VARCHAR(50) NOT NULL DEFAULT '',
        \`min_rate\` DECIMAL(6, 4) NOT NULL DEFAULT 0.0100,
        \`max_rate\` DECIMAL(6, 4) NOT NULL DEFAULT 0.0121,
        \`min_money\` VARCHAR(100) NOT NULL DEFAULT '',
        \`status\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_yuebao_order\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`config_id\` INT UNSIGNED DEFAULT NULL,
        \`amount\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`type\` TINYINT NOT NULL DEFAULT 1,
        \`tx\` TINYINT NOT NULL DEFAULT 0,
        \`status\` TINYINT NOT NULL DEFAULT 2,
        \`remark\` VARCHAR(255) DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 16. fa_loan_config & fa_loan_record
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_loan_config\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(255) NOT NULL,
        \`days\` INT NOT NULL DEFAULT 5,
        \`daily_rate\` DECIMAL(6, 4) NOT NULL DEFAULT 0.0008,
        \`min_amount\` DECIMAL(18, 2) NOT NULL DEFAULT 2000.00,
        \`max_amount\` DECIMAL(18, 2) NOT NULL DEFAULT 50000.00,
        \`weigh\` INT NOT NULL DEFAULT 1,
        \`status\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_loan_record\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`config_id\` INT UNSIGNED NOT NULL,
        \`amount\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`interest\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`total_repay\` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        \`days\` INT NOT NULL DEFAULT 0,
        \`remaining_days\` INT NOT NULL DEFAULT 0,
        \`status\` TINYINT NOT NULL DEFAULT 0,
        \`borrow_time\` DATETIME DEFAULT NULL,
        \`due_time\` DATETIME DEFAULT NULL,
        \`repay_time\` DATETIME DEFAULT NULL,
        \`audit_admin_id\` INT UNSIGNED DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 17. fa_exchange (Flash Exchange quy đổi ngoại tệ)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_exchange\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`user_id\` INT UNSIGNED NOT NULL,
        \`from_currency\` VARCHAR(20) NOT NULL,
        \`to_currency\` VARCHAR(20) NOT NULL,
        \`from_amount\` DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
        \`to_amount\` DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
        \`rate\` DECIMAL(18, 6) NOT NULL DEFAULT 1.000000,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_user_id\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 18. fa_attachment (Quản lý tệp đính kèm & hình ảnh)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`fa_attachment\` (
        \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`admin_id\` INT UNSIGNED NOT NULL DEFAULT 0,
        \`user_id\` INT UNSIGNED NOT NULL DEFAULT 0,
        \`url\` VARCHAR(255) NOT NULL,
        \`imagewidth\` VARCHAR(30) DEFAULT '',
        \`imageheight\` VARCHAR(30) DEFAULT '',
        \`imagetype\` VARCHAR(30) DEFAULT '',
        \`imageframes\` INT NOT NULL DEFAULT 0,
        \`filesize\` BIGINT NOT NULL DEFAULT 0,
        \`mimetype\` VARCHAR(100) DEFAULT '',
        \`extparam\` TEXT DEFAULT NULL,
        \`storage\` VARCHAR(50) NOT NULL DEFAULT 'local',
        \`sha1\` VARCHAR(50) DEFAULT '',
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_admin_id\` (\`admin_id\`),
        KEY \`idx_mimetype\` (\`mimetype\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed các gói vay mẫu fa_loan_config nếu chưa có
    const [existingLoans] = await connection.query('SELECT id FROM fa_loan_config LIMIT 1');
    if (existingLoans.length === 0) {
      await connection.query(`
        INSERT INTO fa_loan_config (id, name, days, daily_rate, min_amount, max_amount, weigh, status) VALUES 
        (1, 'Gói vay nhanh 5 ngày, hạn mức 2.000 - 50.000', 5, 0.0008, 2000.00, 50000.00, 1, 1),
        (2, 'Gói vay nhanh 7 ngày, hạn mức 20.000 - 100.000', 7, 0.0010, 20000.00, 100000.00, 1, 1),
        (3, 'Gói vay tiêu dùng 15 ngày, hạn mức 200.000 - 500.000', 15, 0.0015, 200000.00, 500000.00, 2, 1),
        (4, 'Gói vay doanh nghiệp 30 ngày, hạn mức 500.000 - 1.000.000', 30, 0.0020, 500000.00, 1000000.00, 4, 1)
      `);
      console.log('💰 [Seed] Đã tạo các gói vay tín chấp fa_loan_config');
    }

    // Seed Admin mặc định nếu chưa có
    const [existingAdmins] = await connection.query('SELECT id FROM fa_admin WHERE username = ?', ['admin']);
    if (existingAdmins.length === 0) {
      const adminPassHash = await hashPassword('admin888');
      await connection.query(`
        INSERT INTO fa_admin (username, nickname, password, status, memo)
        VALUES (?, ?, ?, 'normal', 'Tài khoản Super Admin khởi tạo mặc định')
      `, ['admin', 'Spotline Admin', adminPassHash]);
      console.log('👑 [Seed] Đã tạo tài khoản admin mặc định: admin / admin888');
    }

    // Seed Demo User 'Ak111' nếu chưa có
    const [existingUsers] = await connection.query('SELECT id FROM fa_user WHERE account = ?', ['Ak111']);
    if (existingUsers.length === 0) {
      const userPassHash = await hashPassword('123456');
      const userMpassHash = await hashPassword('123456');
      await connection.query(`
        INSERT INTO fa_user (account, username, real_name, password, mpassword, phone, money, usdt, invite_code, status, is_auth)
        VALUES (?, ?, ?, ?, ?, '0987654321', 2429.00, 100.0000, 'YH100VF', 1, 2)
      `, ['Ak111', 'Ak111', 'Demo User', userPassHash, userMpassHash]);
      console.log('👤 [Seed] Đã tạo tài khoản hội viên demo: Ak111 / 123456 (Số dư: RM2,429.00)');
    }

    console.log('✅ [DB Migration] Toàn bộ bảng đã sẵn sàng!');
  } catch (err) {
    console.error('❌ [DB Migration] Lỗi khởi tạo bảng:', err);
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  initSchema,
};
