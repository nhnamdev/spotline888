# LoginForm Specification

## Overview
- **Target file:** `src/components/sites/spotline888-org/pages-login-login/LoginForm.tsx`
- **Screenshot:** `docs/design-references/spotline888-org/pages-login-login/mobile-default.png`
- **Interaction model:** click-driven & input-driven form validation

## DOM Structure
- `.form-wrap` (card container)
  - `.field` (account)
    - `.field-label`
    - `.field-input-wrap`
      - `.field-input`
  - `.field` (password)
    - `.field-label`
    - `.field-input-wrap`
      - `.field-input`
      - `.eye-btn` -> `.eye-icon`
  - `.submit-btn`

## Computed Styles (Exact Uni-App rpx & px)
### Container (`.form-wrap`)
- margin: `48rpx 32rpx 0` (24px 16px 0)
- background: `#ffffff`
- borderRadius: `28rpx` (14px)
- padding: `40rpx 32rpx 44rpx` (20px 16px 22px)
- boxShadow: `0 8rpx 40rpx rgba(15, 23, 42, 0.07)`

### Field & Labels
- `.field`: marginBottom: `32rpx` (16px)
- `.field-label`: fontSize: `24rpx` (12px), color: `#6b7280`, fontWeight: `600`, marginBottom: `12rpx` (6px), paddingLeft: `4rpx` (2px)

### Input Wrapper (`.field-input-wrap`)
- display: flex, alignItems: center
- background: `#f9fafb`
- border: `2rpx solid #e5e7eb` (1px solid #e5e7eb)
- borderRadius: `20rpx` (10px)
- padding: `0 24rpx` (0 12px)
- height: `100rpx` (50px)
- transition: border-color 0.2s, box-shadow 0.2s
- Focus-within: borderColor: `#3b82f6`, boxShadow: `0 0 0 4rpx rgba(59, 130, 246, 0.1)`, background: `#ffffff`

### Input Element (`.field-input`)
- flex: 1
- height: `100%`
- fontSize: `30rpx` (15px)
- color: `#111827`
- background: transparent
- placeholder color: `#c4c9d4`
- placeholder fontSize: `28rpx` (14px)

### Eye Button (`.eye-btn`)
- padding: `12rpx`
- marginLeft: `8rpx`
- cursor: pointer
- icon: outlined eye SVG with 0.5 opacity

### Submit Button (`.submit-btn`)
- marginTop: `40rpx` (20px)
- height: `100rpx` (50px)
- borderRadius: `20rpx` (10px)
- display: flex, alignItems: center, justifyContent: center
- fontSize: `34rpx` (17px)
- fontWeight: 700
- color: `#ffffff`
- letterSpacing: `4rpx` (2px)
- **Disabled State** (empty inputs):
  - background: `linear-gradient(135deg, #cbd5e1, #94a3b8)`
  - boxShadow: none
  - cursor: not-allowed
- **Active State** (account & password non-empty):
  - background: `linear-gradient(135deg, #3b82f6, #2563eb)`
  - boxShadow: `0 8rpx 24rpx rgba(37, 99, 235, 0.35)`
  - cursor: pointer
- **Active Press**:
  - transform: scale(0.98)
  - opacity: 0.92
