# Behaviors: Spotline888 FastAdmin Dashboard (`/coinht.php/dashboard?ref=addtabs`)

## 1. Interaction Model
- **Layout Model:** Classic AdminLTE master layout with responsive collapsible sidebar, fixed top header, addtabs bar, and fluid scrollable content area.
- **Interactions:**
  - Sidebar toggle button: collapses/expands left sidebar between full width (230px) and mini mode (50px) on desktop, or offcanvas drawer on mobile.
  - Treeview menus: expandable accordions with rotating chevron icon (`fa-angle-left`).
  - Addtabs: active tab state (`active` class), tab switching and close actions.
  - User menu dropdown: click to toggle dropdown showing Spot avatar, join date, Profile button, and Logout.
  - Wipe cache dropdown: click to open cache options (Wipe all, Wipe content, Wipe template, Wipe addons).
  - Fullscreen button: toggles browser fullscreen API.
  - Online user polling: auto-refreshes every 10 seconds via AJAX (mocked with live counter).
  - Stat cards: translateY(-3px) hover animation with soft elevation shadow.
  - Trend charts: interactive SVG charts showing 7-day points and tooltips.
  - Expiration countdown: dynamic countdown timer counting down to expiration date.

## 2. Responsive Sweep
- **Desktop (>= 1400px):** 6-column grid for stat cards (`repeat(6, 1fr)`), 2-column chart grid (`1fr 1fr`), full sidebar (230px).
- **Laptop / Tablet (992px - 1399px):** 3-column grid for stat cards (`repeat(3, 1fr)`), 2-column chart grid, collapsed sidebar option.
- **Tablet / Mobile (768px - 991px):** 2-column grid for stat cards (`repeat(2, 1fr)`), 1-column chart grid.
- **Mobile (< 768px):** Sidebar hidden by default (slides in as mobile drawer), stat cards in 2 columns or stacked, top header compact.
