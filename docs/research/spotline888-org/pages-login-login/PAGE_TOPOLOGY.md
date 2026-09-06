# Page Topology: Spotline888 Login

## Target
- URL: `https://spotline888.org/#/pages/login/login`
- Route: `/` and `/pages/login/login`

## Component Breakdown & Layering

1. **Root Page Container (`.pg`)**
   - Background: `linear-gradient(180deg, #eef2ff, #f8fafc 40%, #fff)`
   - Full height `min-h-screen`, responsive width constraint for comfortable desktop/tablet display while maintaining 100% native mobile fidelity.

2. **Top Bar (`.top-bar`)**
   - `top-bar-placeholder`: Balances the right-aligned action button.
   - `lang-btn`: Floating blurred circular pill button triggering the language drawer.

3. **Brand Logo Wrap (`.logo-wrap`)**
   - Renders exact high-resolution brand logo (`logo.png`).

4. **Page Heading (`.pg-title` & `.pg-subtitle`)**
   - Bold title "账号登录" / "Đăng nhập tài khoản" / "Account Login" with 800 font-weight.

5. **Form Container (`.form-wrap`)**
   - Elevated card with subtle shadow and 14px border radius.
   - **Account Field (`.field`)**:
     - Label: "账号" / "Tài khoản" / "Account"
     - Input wrapper with icon/text and auto-whitespace stripping.
   - **Password Field (`.field`)**:
     - Label: "密码" / "Mật khẩu" / "Password"
     - Input with toggleable password mask and eye button.
   - **Submit Button (`.submit-btn`)**:
     - Dual states: Disabled slate gradient vs active blue gradient with glowing shadow.

6. **Page Footer (`.pg-footer`)**
   - Action links: "立即注册" (Register now) and "在线客服" (Online customer service).
   - WhatsApp redirect for customer service.

7. **Interactive Language Drawer (`langChange`)**
   - Modal drawer overlay with smooth slide-up animation.
   - 11 languages supported with instant reactive i18n switching.
