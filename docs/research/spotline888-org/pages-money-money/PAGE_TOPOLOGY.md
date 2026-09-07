# Page Topology: /pages/money/money (Yu'ebao / Money Vault)

## Visual Hierarchy & Section Order
1. **Header Navigation (Sticky Top)**
   - Left: Back chevron (`<`) -> navigates back to index `#/pages/index/index`
   - Center: Page Title (`page.yuebao`: "Yu'ebao" / "余额宝" / "Số dư")
   - Right: Detail History Action (`product.mx`: "Chi tiết" / "明细" / "Details") -> opens slide-up transaction modal

2. **Hero Balance Card (Liquid Wave Wealth Vault)**
   - Top Bar: Label (`money.yebze`: "Tổng Yu'ebao" / "Total Yuebao Balance") + Eye show/hide toggle + Yield Rate badge (`4.85% - 8.20%`)
   - Center Number: Large balance value in USDT + daily earnings indicator (`product.sy`)
   - Bottom Stats Row:
     - Confirmed Shares (`product.yqrfe`: "Cổ phần đã xác nhận")
     - Pending Shares (`product.dqrfe`: "Cổ phần đang chờ xử lý")
   - Visual Effects: Dynamic dual SVG undulating wave animation simulating fluid wealth growth and glowing amber ambient light.

3. **Action Toggle Buttons (Nạp vào / Rút ra)**
   - "Nạp vào" (`product.cr`: Deposit) with remaining quota today (`product.jrsyrjcs`)
   - "Rút ra" (`product.zc`: Withdraw) with remaining quota today (`product.jrsycjcs`)

4. **Transfer Interactive Panel**
   - Direction Switcher: Bi-directional swap between Available Balance (`money.kyye`) and Yu'ebao (`transfer.to_yuebao` / `transfer.to_balance`) with 180° rotation animation.
   - Transfer Amount Input: Numeric input with USDT denomination, "Tất cả" (All) button, and quick percentage pills (`25%`, `50%`, `75%`, `100%`).
   - Transfer Confirmation Button: Full-width blue gradient button with active press scale and loading/toast feedback.

5. **Transfer Rules & Information Section**
   - Accrual rules (`transfer.info_to_yuebao`: Interest starts calculating after transfer)
   - Liquidity terms (`transfer.info_to_balance`: Free use after transfer to balance)
   - Instant execution (`transfer.info_instant`: Transfer arrives instantly)
   - Zero fees (`transfer.info_fee`: No transfer fee)

6. **Transaction History Modal (Slide-up Drawer)**
   - Filter Tabs: All (`product.qb`), Deposit (`product.cr`), Withdraw (`product.zc`), Earnings (`product.sy`)
   - Transaction list with status badges and timestamped entries.

7. **Fixed Bottom Navigation Bar (Tab 3 Active)**
   - Home (`#/pages/index/index`)
   - Products (`#/pages/product/product`)
   - Balance (`#/pages/money/money`) - **Active** with `/static/tabbar/yue_active.png` and `#f8b83d`
   - Mine (`#/pages/user/user`)
