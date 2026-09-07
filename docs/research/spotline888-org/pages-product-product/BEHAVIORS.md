# Behaviors: pages/product/product

## Navigation & Routing
- **Source URL:** `https://spotline888.org/#/pages/product/product`
- **Hash change detection:** Clicking `Products` tab in bottom tab bar switches hash to `#/pages/product/product`.
- **Back to Home:** Clicking `Home` in bottom tab bar switches hash to `#/pages/index/index` or `/`.

## Top Tabs Interaction
- Tab list: `["Sản phẩm"]` / `["Products"]` / `["产品"]` (localized via `i18n`).
- Active tab has bold text, color `#222`, and blue underline `#1150c2` with smooth transition.

## Product List Interaction
- Clicking any product item triggers `onClickDetail` to navigate to `/pages/Detail/Detail?id={id}&codename={codename}&title={title}`.
- Hover/active row state: background changes to `#f8f8f8`.

## Polling & Auto-Refresh
- Original uni-app polls `(0, r.goods)({ hideLoading: true })` every 5 seconds.
- Prices and change percentages are maintained dynamically or mock refreshed.
