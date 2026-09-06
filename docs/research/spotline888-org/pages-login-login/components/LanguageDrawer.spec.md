# LanguageDrawer Specification

## Overview
- **Target file:** `src/components/sites/spotline888-org/pages-login-login/LanguageDrawer.tsx`
- **Screenshot:** `docs/design-references/spotline888-org/pages-login-login/lang-drawer.png`
- **Interaction model:** Bottom-sheet modal drawer with fade backdrop and slide-up transition

## DOM Structure
- `.lang-modal-mask` (backdrop overlay)
- `.lang-drawer`
  - `.lang-header`
    - `.lang-title` ("语言设置" / "Language Settings" / "Cài đặt ngôn ngữ")
    - `.lang-cancel` ("取消" / "Cancel" / "Hủy")
  - `.lang-list`
    - `.lang-item` (name, active check state)

## Computed Styles
- Backdrop: `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); z-index: 999;`
- Container:
  - `position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 24px 24px 0 0; padding-top: 48rpx; z-index: 1000; box-shadow: 0 -4px 20px rgba(0,0,0,0.1);`
- Header:
  - `display: flex; justify-content: space-between; align-items: center; padding: 0 32rpx;`
  - `.lang-title`: `font-size: 32rpx (16px); font-weight: 800; color: #222222;`
  - `.lang-cancel`: `font-size: 28rpx (14px); color: #a8a9ac; cursor: pointer;`
- List:
  - `margin-top: 40rpx; padding-bottom: 60rpx; max-height: 60vh; overflow-y: auto;`
- Item:
  - `height: 100rpx (50px); display: flex; align-items: center; padding: 0 32rpx; font-size: 28rpx (14px); color: #222222; cursor: pointer; transition: background 0.15s;`
  - **Active State**:
    - `background-color: #f3f5f6; color: #1150c2; font-weight: 600;`
