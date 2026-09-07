# ProductPage Specification

## Overview
- **Target Route:** `src/app/pages/product/product/page.tsx`
- **Target Component:** `src/components/sites/spotline888-org/pages-product-product/SpotlineProductPage.tsx`
- **Interaction model:** Click-driven tab selection + dynamic list rendering

## DOM Structure
```html
<div class="product-page-container">
  <!-- Top Tabs -->
  <div class="tui-tabs">
    <div class="v-tabs">
      <div class="v-tabs__container">
        <div class="v-tabs__container-item active">
          <span>{tabTitle}</span>
          <div class="v-tabs__container-line"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Variety List -->
  <div class="tui-variety">
    <div class="section-title">{t.futureProducts}</div>
    <div class="tui-classify">
      <span class="col-name">{t.name}</span>
      <span class="col-price">{t.latestPrice}</span>
      <span class="col-change">{t.change24h}</span>
    </div>
    <div class="tui-varietyContent">
      <!-- Item -->
      <div class="tui-varietyContentItem">
        <div class="col-left">
          <img class="coin-icon" src="{image}" />
          <span class="coin-name">{title}</span>
        </div>
        <div class="col-mid">
          <span class="coin-price">{price}</span>
        </div>
        <div class="col-right">
          <span class="change-badge up|down">{change}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Fixed Bottom Tab Bar -->
  <div class="tab-bar">...</div>
</div>
```

## Computed Styles (exact values from uni-app d0fd)
- **Container**: `background-color: #f6f7fb; min-height: 100vh;`
- **Top Tabs**: `padding: 5px 10px 0; box-sizing: border-box; background: #fff;`
- **Active Tab text**: `font-size: 16px; font-weight: 700; color: #222;`
- **Active Tab underline**: `width: 32px; height: 3px; background: #1150c2; border-radius: 3px;`
- **Section Title**: `font-size: 15px; font-weight: 700; color: #1e2329; padding: 10px 15px 3px; background: #fff;`
- **Classify Header**: `color: #707a8a; font-size: 11px; display: flex; align-items: center; padding: 8px 15px;`
- **Item Row**: `padding: 12px 15px; display: flex; align-items: center; border-bottom: 1px solid #f2f2f2;`
- **Coin Icon**: `width: 26px; height: 26px; border-radius: 50%;`
- **Coin Name**: `font-size: 14px; font-weight: 600; color: #1e2329;`
- **Coin Price**: `font-size: 14px; font-weight: 500; color: #1e2329;`
- **Change Badge**: `font-size: 12px; font-weight: 600; color: #fff; padding: 4px 10px; border-radius: 4px; min-width: 70px; text-align: center;`
  - Up: `#0ecb81`
  - Down: `#f6465d`
- **Bottom Tabbar**: `height: 50px; background: #fff; border-top: 1px solid rgba(243, 244, 246, 0.8);`
  - Active Tab 1 (Products): active icon `chanpin_active.png`, text `#f8b83d`
