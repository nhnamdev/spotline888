# Behaviors Specification: Spotline888 Login

## 1. Page Background & Container
- **Gradient**: `linear-gradient(180deg, #eef2ff, #f8fafc 40%, #fff)`
- **Min Height**: `100vh`
- **Bottom Padding**: `60rpx` (~30px)
- **Viewport adaptation**: Full width mobile-first layout. On desktop viewports, clean centered/fluid presentation matching source responsive behavior.

## 2. Header & Language Switcher
- **Positioning**: Top row with flex space-between
- **Language Button**:
  - `72rpx x 72rpx` (36px x 36px circular button)
  - `background: hsla(0,0%,100%,.8)` with `backdrop-filter: blur(10px)`
  - `box-shadow: 0 2rpx 12rpx rgba(0,0,0,.06)`
  - Icon: Globe icon `36rpx x 36rpx`
  - Action: Clicking opens the bottom-sheet language selection drawer.

## 3. Logo & Typography
- **Logo**:
  - Exact brand image: `fa32c0b93665cd9e8cb8c9d97f24beba.png` ("SPOT" with orange accent dot)
  - Display size: `180rpx x 64rpx` (90px x 32px), `object-fit: contain`
  - Padding: `24rpx 40rpx 0`
- **Title**:
  - Text: `login.zhdl` (Default: "账号登录" or "Đăng nhập tài khoản" in Vietnamese, "Account Login" in English)
  - `font-size: 56rpx` (28px)
  - `font-weight: 800`
  - `color: #111827`
  - `letter-spacing: 1rpx`
  - Padding: `48rpx 40rpx 0`
- **Subtitle**:
  - `padding: 8rpx 40rpx 0; font-size: 26rpx; color: #9ca3af;`

## 4. Form Fields & Interaction
- **Container**:
  - White card: `background: #fff; border-radius: 28rpx; padding: 40rpx 32rpx 44rpx; margin: 48rpx 32rpx 0;`
  - Shadow: `0 8rpx 40rpx rgba(15,23,42,.07)`
- **Input Fields**:
  - Background: `#f9fafb`
  - Border: `2rpx solid #e5e7eb` (1px)
  - Radius: `20rpx` (10px)
  - Height: `100rpx` (50px)
  - Focus state: `border-color: #3b82f6`, `box-shadow: 0 0 0 4rpx rgba(59,130,246,.1)`, `background: #fff`
  - Spaces auto-stripped on input and blur
- **Password Visibility**:
  - Eye button toggles between password type and text type.
  - Outlined eye icon with 0.5 opacity.
- **Submit Button**:
  - Disabled state (when account or password empty):
    - `background: linear-gradient(135deg, #cbd5e1, #94a3b8); box-shadow: none; cursor: not-allowed;`
  - Active state (both filled):
    - `background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 8rpx 24rpx rgba(37,99,235,.35); cursor: pointer;`
  - Active press feedback: `transform: scale(0.98); opacity: 0.92;`
- **Submit Action**:
  - Calls live login API `https://spotline888.org/api/login/login` or simulated auth.
  - Shows feedback toast with exact error code / status.

## 5. Footer Links
- **Layout**: Centered flex with `gap: 24rpx`, padding: `60rpx 40rpx 0`
- **Register Link**: `color: #3b82f6; font-weight: 600; font-size: 27rpx;` (Default: "立即注册" / "Đăng ký ngay")
- **Divider**: `width: 2rpx; height: 28rpx; background: #d1d5db;`
- **Online Service Link**: `color: #3b82f6; font-weight: 600; font-size: 27rpx;` (Default: "在线客服" / "Dịch vụ khách hàng trực tuyến")
  - Clicking opens WhatsApp support link: `https://wa.me/6287844562370?name=&id=0`

## 6. Language Drawer Modal
- Bottom sheet slide-up animation with dimmed backdrop overlay (`rgba(0,0,0,0.4)`).
- Top header: "语言设置" (Cài đặt ngôn ngữ) on left, "取消" (Hủy) on right.
- Language options with highlight for active language (`background: #f3f5f6; color: #1150c2`).
- Clicking changes active language and instantaneously re-renders the whole page with authentic translations.
