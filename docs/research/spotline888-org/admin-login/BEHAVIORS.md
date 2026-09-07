# Behaviors: Spotline888 FastAdmin Login (`/coinht.php/index/login`)

## 1. Interaction Model
- **Interaction Model:** Form-based interaction with click, keyboard focus, checkbox toggle, captcha refresh, and submission handling.
- **Scroll:** Static layout. Fixed / centered viewport; background image pinned to viewport with `background-size: cover`.

## 2. Interactive Elements & Behaviors

### 2.1 Username & Password Inputs
- **Initial State:**
  - Border: `1px solid #ccc`
  - Background: `#fff`
  - Font size: `12px`
  - Color: `#555`
  - Box shadow: `inset 0 1px 1px rgba(0, 0, 0, 0.075)`
- **Focus State:**
  - Border color: `#66afe9`
  - Box shadow: `inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)`
  - Transition: `border-color ease-in-out .15s, box-shadow ease-in-out .15s`
- **Addon icon:**
  - Background: `#eee`
  - Border: `1px solid #ccc`
  - Width: `1%` (table-cell, `min-width: 38px`)
  - Color: `#555`

### 2.2 Captcha Box
- **Image:** Dimension `100px x 30px`
- **Cursor:** Pointer
- **Click Behavior:** `onclick="this.src = '/index.php?s=/captcha&r=' + Math.random();"`
- **Reload:** Generates a new randomized 4-character captcha code with distortion curves and colored noise dots.

### 2.3 Keep Login Checkbox
- Standard checkbox with label `Keep login`
- Checked toggle state modifies form data `keeplogin=1`.

### 2.4 Sign In Button (`.btn.btn-success.btn-lg.btn-block`)
- **Default State:**
  - Background: `#18bc9c`
  - Border: `1px solid #18bc9c`
  - Color: `#ffffff`
  - Font size: `15px`
  - Line height: `1.3333333`
  - Padding: `10px 16px`
  - Border radius: `5px`
  - Text align: center
  - Width: `100%`
- **Hover State:**
  - Background: `#128f76`
  - Border color: `#11866f`
  - Color: `#ffffff`
- **Active / Focus State:**
  - Background: `#128f76`
  - Border color: `#0a4b3e`
  - Box shadow: `inset 0 3px 5px rgba(0, 0, 0, 0.125)`

### 2.5 Form Validation / Error Tip
- If required fields (Username, Password, Captcha) are empty or invalid upon submit:
  - An error tip banner `#errtips` is displayed above the inputs with message and alert styling.

## 3. Responsive Sweep
- **Desktop (>= 768px):**
  - `.login-screen`: `max-width: 400px; margin: 100px auto 0 auto; padding: 0;`
- **Mobile (< 768px):**
  - `.login-screen`: `margin: 50px auto 0 auto; padding: 0 20px; width: 100%;`
  - Well scales down to fit viewport cleanly with side margins.
