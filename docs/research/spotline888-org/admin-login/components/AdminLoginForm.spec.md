# AdminLoginForm Specification

## Overview
- **Target file:** `src/components/sites/spotline888-org/admin-login/AdminLoginForm.tsx`
- **Interaction model:** click-driven form with instant validation feedback and captcha refresh
- **Assets used:**
  - `/sites/spotline888-org/admin-login/avatar.png` (100x100 profile image)
  - `/sites/spotline888-org/admin-login/captcha.png` (100x30 default captcha image)
  - Bootstrap 3 glyphicons: `glyphicon-user`, `glyphicon-lock`, `glyphicon-option-horizontal`

## DOM Structure
```html
<div class="login-wrapper">
  <div class="login-screen">
    <div class="well">
      <div class="login-form">
        <img id="profile-img" class="profile-img-card" src="/sites/spotline888-org/admin-login/avatar.png" alt="Avatar" />
        <p id="profile-name" class="profile-name-card"></p>
        <form id="login-form" method="post">
          <div id="errtips" class="hide"></div>
          <div class="input-group">
            <div class="input-group-addon"><span class="glyphicon glyphicon-user"></span></div>
            <input type="text" class="form-control" id="pd-form-username" placeholder="Username" name="username" />
          </div>
          <div class="input-group">
            <div class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></div>
            <input type="password" class="form-control" id="pd-form-password" placeholder="Password" name="password" />
          </div>
          <div class="input-group">
            <div class="input-group-addon"><span class="glyphicon glyphicon-option-horizontal"></span></div>
            <input type="text" name="captcha" class="form-control" placeholder="Captcha" />
            <span class="input-group-addon captcha-addon">
              <img src="/sites/spotline888-org/admin-login/captcha.png" width="100" height="30" />
            </span>
          </div>
          <div class="form-group">
            <label class="inline" for="keeplogin">
              <input type="checkbox" name="keeplogin" id="keeplogin" value="1" />
              Keep login
            </label>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-success btn-lg btn-block">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
```

## Computed Styles (Exact Values)

### `.login-screen`
- maxWidth: `400px`
- margin: `100px auto 0 auto`
- padding: `0` (desktop), `0 20px` (mobile `<= 767px`)

### `.well`
- border-radius: `3px`
- box-shadow: `0 0 10px rgba(0, 0, 0, 0.1)`
- background: `rgba(255, 255, 255, 0.2)`
- border: `none`
- padding: `19px`
- margin-bottom: `20px`

### `.profile-img-card`
- width: `100px`
- height: `100px`
- margin: `10px auto`
- display: `block`
- border-radius: `50%`

### `#login-form`
- marginTop: `20px`

### `.input-group`
- position: `relative`
- display: `table`
- borderCollapse: `separate`
- width: `100%`
- marginBottom: `15px`

### `.input-group-addon`
- padding: `6px 12px`
- fontSize: `12px`
- fontWeight: `400`
- lineHeight: `1`
- color: `#555555`
- textAlign: `center`
- backgroundColor: `#eeeeee`
- border: `1px solid #cccccc`
- borderRadius: `3px`
- width: `1%`
- whiteSpace: `nowrap`
- verticalAlign: `middle`
- display: `table-cell`

### `.form-control`
- display: `table-cell` (inside input-group)
- width: `100%`
- height: `31px`
- padding: `6px 12px`
- fontSize: `12px`
- lineHeight: `1.42857143`
- color: `#555555`
- backgroundColor: `#ffffff`
- border: `1px solid #cccccc`
- borderRadius: `3px`
- boxShadow: `inset 0 1px 1px rgba(0, 0, 0, 0.075)`

### `.btn-success.btn-lg.btn-block`
- display: `block`
- width: `100%`
- padding: `10px 16px`
- fontSize: `15px`
- lineHeight: `1.3333333`
- borderRadius: `5px`
- color: `#ffffff`
- backgroundColor: `#18bc9c`
- borderColor: `#18bc9c`
- hover: `backgroundColor: #128f76; borderColor: #11866f;`

### `label.inline`
- display: `inline-block`
- color: `#999999`
- fontSize: `13px`
- cursor: `pointer`
- fontWeight: `normal`
