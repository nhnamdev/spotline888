# Page Topology: pages/product/product

## Target URL
`https://spotline888.org/#/pages/product/product`

## Route
- Next.js route: `src/app/pages/product/product/page.tsx`
- Hash routing fallback: `/#/pages/product/product` in `src/app/page.tsx`

## Layout Hierarchy
```
<SpotlineProductPage> (Root Provider)
  <div min-h-screen bg-[#f6f7fb] flex justify-center>
    <div max-w-[480px] w-full min-h-screen bg-[#f8fafc] flex flex-col pb-[65px]>
      <ProductTopTabs /> (Top Tabs Navigation, active 'Products' / 'Sản phẩm')
      <ProductVarietySection /> (Variety card container with Future Products table)
        <SectionTitle /> ("Future Products" / "未来产品")
        <TableClassifyHeader /> (Name, Latest Price, 24h Change)
        <ProductItemList /> (Full list of crypto products with live price and change)
      <IndexTabBar activeTab="products" /> (Bottom Tab Navigation with Products active)
```

## Section Details
1. **ProductTopTabs**:
   - Fixed or sticky top bar with tabs indicator.
   - Active tab indicator: 14px-16px bold text with a 5px rounded blue bar `#1150c2` underneath.
2. **ProductVarietySection**:
   - Clean white background (`#ffffff`), `box-sizing: border-box`.
   - Title: `home.future_products` (15px bold, `#1e2329`).
   - Classify header: 11px gray `#707a8a`.
   - Items: rows separated by `#f2f2f2` border.
   - Coin icons, symbol titles, live prices, and pill change badges (`#0ecb81` for positive, `#f6465d` for negative).
3. **IndexTabBar**:
   - Fixed bottom navigation bar (`height: 50px`, z-index 9999).
   - "Products" tab active with `/sites/spotline888-org/pages-index-index/chanpin_active.png` and text `#f8b83d`.
