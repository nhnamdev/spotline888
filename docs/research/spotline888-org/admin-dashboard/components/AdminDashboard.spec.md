# AdminDashboard Specification

## Overview
- **Target files:**
  - `src/components/sites/spotline888-org/admin-dashboard/AdminHeader.tsx`
  - `src/components/sites/spotline888-org/admin-dashboard/AdminSidebar.tsx`
  - `src/components/sites/spotline888-org/admin-dashboard/AdminDashboardCharts.tsx`
  - `src/components/sites/spotline888-org/admin-dashboard/AdminDashboardContent.tsx`
  - `src/components/sites/spotline888-org/admin-dashboard/AdminDashboardPage.tsx`
- **Interaction model:** dynamic dashboard with responsive collapsible navigation, countdown timer, interactive 7-day trend charts, tab navigation, and live polling simulation.

## Design Tokens & Computed Values

### Colors
- Header background: `#18bc9c` (FastAdmin skin-green)
- Header hover: `#149b82`
- Sidebar background: `#222d32`
- Sidebar active item: `#1e282c` with left border `#18bc9c` (3px)
- Sidebar text: `#b8c7ce`
- Sidebar hover text: `#ffffff`
- Content background: `#f1f4f6`
- Card background: `#ffffff`
- Primary gradient (Banner & Query): `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Stat Card Themes
- Blue (`ci-blue`): `linear-gradient(135deg, #667eea, #5a67d8)`, deco `#667eea`
- Green (`ci-green`): `linear-gradient(135deg, #48bb78, #38a169)`, deco `#48bb78`
- Amber (`ci-amber`): `linear-gradient(135deg, #f6ad55, #ed8936)`, deco `#f6ad55`
- Purple (`ci-purple`): `linear-gradient(135deg, #9f7aea, #805ad5)`, deco `#9f7aea`
- Cyan (`ci-cyan`): `linear-gradient(135deg, #4fd1c5, #38b2ac)`, deco `#4fd1c5`
- Rose (`ci-rose`): `linear-gradient(135deg, #fc8181, #e53e3e)`, deco `#e53e3e`

### Live Data Values
- Total users: `195`
- Total balance: `9808432.41`
- Live online: `0` (with 1.5s pulse animation)
- Today registration: `0`
- Today profit: `0`
- Today recharge: `CNY: 15933.03` / `USDT: 0`
- Today withdraw: `CNY: 388200.05` / `USDT: 0`
- 7-Day Chart Days: `["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06", "2026-09-07"]`
