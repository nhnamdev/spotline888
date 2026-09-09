const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Lấy danh sách sản phẩm giao dịch
 * Route: GET /api/products
 */
async function getProducts(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.code, p.title, p.image, p.price, p.is_open, p.status, p.weigh, t.name as type_name
       FROM fa_product p
       LEFT JOIN fa_product_type t ON p.type_id = t.id
       WHERE p.status = 1
       ORDER BY p.weigh DESC, p.id DESC`
    );

    // Nếu chưa có sản phẩm nào, tự động seed các cặp cơ bản
    if (rows.length === 0) {
      const defaultProducts = [
        ['BTC', 'BTC/USDT', 1, 66343.07, '/uploads/20251103/e4063309d0783b20b4a4f229b9aeccb2.png', 220],
        ['ETH', 'ETH/USDT', 1, 3480.50, '/uploads/20251103/6ac533157fb3f3367859793cf2bbabf0.png', 215],
        ['TRX', 'TRX/USDT', 1, 0.2815, '/uploads/20251103/eb48feb407a9617a4723f44265c14f96.png', 208],
        ['DOT', 'DOT/USDT', 1, 1.5163, '/uploads/20251103/6c57613336dc4a7cb082d8267aacf0a1.png', 207],
        ['LINK', 'LINK/USDT', 1, 8.7000, '/uploads/20251103/e7b47802446b12cea02cff2b5aee1ee3.png', 206],
        ['GOLD', 'GOLD/USDT', 3, 2340.50, '/uploads/20251103/3725ccbba9f6da3ba9cba3fbb4b6434f.jpg', 200],
      ];

      for (const p of defaultProducts) {
        await pool.query(
          `INSERT INTO fa_product (code, title, type_id, price, image, weigh, is_open, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, 1, NOW())`,
          p
        );
      }

      const [newRows] = await pool.query('SELECT * FROM fa_product WHERE status = 1 ORDER BY weigh DESC');
      return success(res, 'Lấy danh sách sản phẩm thành công', newRows);
    }

    return success(res, 'Lấy danh sách sản phẩm thành công', rows);
  } catch (err) {
    return error(res, 'Lỗi lấy sản phẩm: ' + err.message);
  }
}

/**
 * Lấy nến K-line theo khung thời gian
 * Route: GET /api/products/:code/kline
 */
async function getKlineData(req, res) {
  try {
    const { code } = req.params;
    const { timeframe = '5m' } = req.query;

    const [products] = await pool.query('SELECT price FROM fa_product WHERE code = ? LIMIT 1', [code.toUpperCase()]);
    let basePrice = products.length > 0 ? parseFloat(products[0].price) : 66000;
    if (!basePrice || basePrice <= 0) basePrice = 66000;

    // Sinh 32 nến K-line dao động thực tế quanh mức giá hiện tại
    const count = 32;
    const candles = [];
    let current = basePrice;
    const now = Date.now();

    for (let i = count; i >= 0; i--) {
      const timeStr = new Date(now - i * 5 * 60 * 1000).toTimeString().slice(0, 5);
      const change = (Math.random() - 0.48) * (basePrice * 0.0035);
      const open = current;
      const close = Math.max(10, open + change);
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.0018);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.0018);
      const volume = Math.floor(20 + Math.random() * 80);

      candles.push({
        time: timeStr,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
      });
      current = close;
    }

    return success(res, 'Lấy nến K-line thành công', {
      symbol: code.toUpperCase(),
      current_price: basePrice,
      candles,
    });
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Đặt lệnh giao dịch Quyền chọn nhị phân (Buy Up / Buy Down)
 * Route: POST /api/order/create
 */
async function createOrder(req, res) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const rawAmount = req.body.amount || req.body.money;
    const rawDirection = req.body.direction || req.body.orderType || req.body.type || '';
    const rawDuration = req.body.duration || req.body.second || 60;
    const rawSymbol = req.body.symbol || req.body.productCode || 'BTC/USDT';
    const product_id = req.body.product_id || req.body.productId;
    const yield_rate = req.body.yield_rate || 85;

    const numAmount = parseFloat(rawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      connection.release();
      return error(res, 'Số tiền đầu tư không hợp lệ');
    }

    const ostyle = (rawDirection === 'buy_up' || rawDirection === 'long' || rawDirection === 'buy' || rawDirection === 'call') ? 'buy_up' : 'buy_down';
    const numDuration = Math.max(30, Number(rawDuration));
    const numYield = parseFloat(yield_rate) || 85.0;
    const symbol = rawSymbol;

    // 1. Kiểm tra số dư người dùng
    const [users] = await connection.query(
      'SELECT id, money, kong_style FROM fa_user WHERE id = ? FOR UPDATE',
      [userId]
    );

    if (users.length === 0) {
      await connection.rollback();
      connection.release();
      return error(res, 'Người dùng không tồn tại');
    }

    const currentBalance = parseFloat(users[0].money);
    if (currentBalance < numAmount) {
      await connection.rollback();
      connection.release();
      return error(res, `Số dư không đủ để đặt lệnh (Hiện có: ${currentBalance.toFixed(2)})`);
    }

    // 2. Lấy giá vào lệnh
    let entryPrice = 66343.07;
    if (product_id) {
      const [prod] = await connection.query('SELECT price FROM fa_product WHERE id = ?', [product_id]);
      if (prod.length > 0) entryPrice = parseFloat(prod[0].price);
    }

    // 3. Trừ số dư
    const newBalance = currentBalance - numAmount;
    await connection.query('UPDATE fa_user SET money = ? WHERE id = ?', [newBalance, userId]);

    // 4. Ghi sổ cái fa_user_money_log
    await connection.query(
      `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, created_at)
       VALUES (?, 'MYR', 'trade_buy', ?, ?, ?, ?, NOW())`,
      [userId, -numAmount, currentBalance, newBalance, `Đặt lệnh ${ostyle === 'buy_up' ? 'Mua lên' : 'Mua xuống'} ${symbol}`]
    );

    // 5. Lưu lệnh vào fa_order
    const [orderResult] = await connection.query(
      `INSERT INTO fa_order (
        user_id, product_id, product_title, ostyle, buy_money, balance_after,
        buy_price, duration, yield_rate, type_desc, kong_type, status,
        buy_time, sell_time, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'default', 'holding', NOW(), DATE_ADD(NOW(), INTERVAL ? SECOND), NOW())`,
      [
        userId,
        product_id || 1,
        symbol,
        ostyle,
        numAmount,
        newBalance,
        entryPrice,
        numDuration,
        numYield,
        `${numDuration}/${numYield}`,
        numDuration,
      ]
    );

    await connection.commit();
    connection.release();

    return success(res, 'Đặt lệnh thành công', {
      order_id: orderResult.insertId,
      symbol,
      ostyle,
      buy_money: numAmount,
      entry_price: entryPrice,
      duration: numDuration,
      balance_after: newBalance,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    return error(res, 'Đặt lệnh thất bại: ' + err.message);
  }
}

/**
 * Lấy danh sách lệnh của tôi (Holding và Settled)
 * Route: GET /api/order/my-orders
 */
async function getMyOrders(req, res) {
  try {
    const userId = req.user.id;
    const { status = 'holding' } = req.query; // 'holding' hoặc 'settled'

    // Trước khi trả về, tự động kích hoạt chốt các lệnh đã hết hạn
    await settleExpiredOrders();

    const [rows] = await pool.query(
      `SELECT id, product_title, ostyle, buy_money, buy_price, sell_price, 
              duration, yield_rate, ploss, kong_type, status, buy_time, sell_time,
              TIMESTAMPDIFF(SECOND, NOW(), sell_time) as remaining_seconds
       FROM fa_order 
       WHERE user_id = ? AND status = ? 
       ORDER BY id DESC 
       LIMIT 50`,
      [userId, status]
    );

    return success(res, 'Lấy danh sách lệnh thành công', rows);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * Hàm thanh toán / chốt các lệnh cược đã hết thời gian đếm ngược
 */
async function settleExpiredOrders() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Tìm các lệnh holding đã hết hạn (sell_time <= NOW())
    const [expiredOrders] = await connection.query(
      `SELECT o.*, u.kong_style, u.money as user_money
       FROM fa_order o
       JOIN fa_user u ON o.user_id = u.id
       WHERE o.status = 'holding' AND o.sell_time <= NOW()
       FOR UPDATE`
    );

    for (const ord of expiredOrders) {
      const buyPrice = parseFloat(ord.buy_price);
      const buyMoney = parseFloat(ord.buy_money);
      const yieldRate = parseFloat(ord.yield_rate) || 85.0;

      // Xác định kết quả Thắng hay Thua
      let isWin = false;

      // Ưu tiên 1: Can thiệp trực tiếp từ Admin trên lệnh
      if (ord.kong_type === 'win') {
        isWin = true;
      } else if (ord.kong_type === 'loss') {
        isWin = false;
      }
      // Ưu tiên 2: Can thiệp theo thiết lập người dùng (fa_user.kong_style)
      else if (ord.kong_style === 1) {
        isWin = true;
      } else if (ord.kong_style === 2) {
        isWin = false;
      }
      // Mặc định: Giả lập giá đóng lệnh
      else {
        // Tỷ lệ thắng ngẫu nhiên 50/50 nếu không can thiệp
        isWin = Math.random() >= 0.5;
      }

      // Tính giá đóng lệnh giả định hợp lý
      const priceDelta = buyPrice * 0.0005;
      let closePrice = buyPrice;
      if (ord.ostyle === 'buy_up') {
        closePrice = isWin ? buyPrice + priceDelta : buyPrice - priceDelta;
      } else {
        closePrice = isWin ? buyPrice - priceDelta : buyPrice + priceDelta;
      }

      let profit = 0;
      if (isWin) {
        // Tiền hoàn lại = tiền cược gốc + tiền thắng
        const winProfit = (buyMoney * yieldRate) / 100;
        const totalReturn = buyMoney + winProfit;
        profit = winProfit;

        // Cộng tiền vào tài khoản user
        const currentMoney = parseFloat(ord.user_money);
        const newMoney = currentMoney + totalReturn;

        await connection.query('UPDATE fa_user SET money = ? WHERE id = ?', [newMoney, ord.user_id]);

        // Ghi sổ cái
        await connection.query(
          `INSERT INTO fa_user_money_log (user_id, currency, type, money, before_balance, after_balance, memo, ext_id, created_at)
           VALUES (?, 'MYR', 'trade_win', ?, ?, ?, ?, ?, NOW())`,
          [ord.user_id, totalReturn, currentMoney, newMoney, `Thắng cược ${ord.product_title} (+${winProfit.toFixed(2)})`, ord.id]
        );
      }

      // Cập nhật trạng thái lệnh sang settled
      await connection.query(
        `UPDATE fa_order 
         SET status = 'settled', sell_price = ?, ploss = ? 
         WHERE id = ?`,
        [closePrice, profit, ord.id]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.error('Lỗi settle orders:', err);
  } finally {
    connection.release();
  }
}

module.exports = {
  getProducts,
  getKlineData,
  createOrder,
  getMyOrders,
  settleExpiredOrders,
};
