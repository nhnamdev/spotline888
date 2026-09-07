# Page Topology: Spotline888 FastAdmin Dashboard

## Route Mapping
- **Source URL:** `https://spotline888.org/coinht.php/dashboard?ref=addtabs`
- **Destination Route:** `/admin/dashboard` (`src/app/admin/dashboard/page.tsx`)
- **Site Key:** `spotline888-org`
- **Page Key:** `admin-dashboard`

## Structural Hierarchy
```text
.wrapper.skin-green
├── header.main-header
│   ├── .logo ("Abbott")
│   └── nav.navbar.navbar-static-top
│       ├── a.sidebar-toggle (fa-bars)
│       ├── .countdown-container (到期时间: X天 X时 X分 X秒)
│       └── .navbar-custom-menu
│           ├── li.dropdown.cache-menu (Wipe cache)
│           ├── li (Fullscreen button)
│           └── li.dropdown.user.user-menu (Spot avatar + dropdown menu with Logout)
├── aside.main-sidebar
│   └── section.sidebar
│       ├── .user-panel (Avatar + "Spot" + Online indicator)
│       ├── form.sidebar-form (Search menu input)
│       └── ul.sidebar-menu
│           ├── li.active (控制台)
│           ├── li (订单管理)
│           ├── li (会员管理)
│           ├── li (充值管理 + badge)
│           ├── li (提现管理 + badge)
│           ├── li.treeview (产品管理 -> 产品列表, 产品分类)
│           ├── li.treeview (贷款管理 -> 贷款配置管理, 贷款记录管理)
│           ├── li.treeview (系统设置 -> 网站配置, 权限管理, 图文管理, Attachment, Profile)
│           ├── li (新闻公告)
│           ├── li (实名认证 + badge)
│           ├── li.treeview (余额宝管理 -> 余额宝订单, 余额宝配置)
│           └── li (后台IP白名单)
└── .content-wrapper
    ├── .nav-tabs (Tab bar: [控制台])
    └── .tab-content (Dashboard View)
        ├── #ribbon (Breadcrumb: Dashboard / 控制台)
        └── .content
            └── .dash-wrap
                ├── .dash-summary (Gradient Banner: 总注册用户 195 | 用户总余额 9808432.41)
                ├── .dash-filter (Date Range: 2026-09-07 00:00:00 - 2026-09-07 23:59:59 + 查询)
                ├── .dash-cards (6 Cards: 总注册人数, 实时在线, 今日注册, 今日盈亏, 今日充值, 今日提现)
                └── .dash-charts (2 Chart Boxes: 财务 7 天趋势, 订单 7 天趋势)
```
