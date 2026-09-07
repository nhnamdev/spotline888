# Page Topology: Spotline888 FastAdmin Login

## Route Mapping
- **Source URL:** `https://spotline888.org/coinht.php/index/login`
- **Destination Route:** `/admin/login` (`src/app/admin/login/page.tsx`)
- **Site Key:** `spotline888-org`
- **Page Key:** `admin-login`

## Visual Hierarchy
```text
html, body (height: 100%, background: url('/sites/spotline888-org/admin-login/loginbg.jpg') cover center fixed)
└── .container (margin: 0 auto, max-width: 1170px, min-height: 100vh)
    └── .login-wrapper
        └── .login-screen (max-width: 400px, margin: 100px auto 0 auto, mobile padding: 0 20px)
            └── .well (background: rgba(255,255,255,0.2), box-shadow: 0 0 10px rgba(0,0,0,0.1), border-radius: 3px, padding: 19px)
                └── .login-form
                    ├── #profile-img.profile-img-card (avatar.png, 100x100px, border-radius: 50%, margin: 10px auto)
                    ├── #profile-name.profile-name-card (empty)
                    └── form#login-form (margin-top: 20px)
                        ├── #errtips (hidden by default)
                        ├── input[type=hidden][name=__token__]
                        ├── .input-group (margin-bottom: 15px)
                        │   ├── .input-group-addon (glyphicon-user)
                        │   └── input#pd-form-username.form-control (placeholder="Username")
                        ├── .input-group (margin-bottom: 15px)
                        │   ├── .input-group-addon (glyphicon-lock)
                        │   └── input#pd-form-password.form-control[type=password] (placeholder="Password")
                        ├── .input-group (margin-bottom: 15px)
                        │   ├── .input-group-addon (glyphicon-option-horizontal)
                        │   ├── input.form-control (placeholder="Captcha")
                        │   └── .input-group-addon (captcha image 100x30, click to refresh)
                        ├── .form-group (margin-bottom: 15px)
                        │   └── label.inline[for=keeplogin]
                        │       ├── input#keeplogin[type=checkbox]
                        │       └── "Keep login"
                        └── .form-group
                            └── button[type=submit].btn.btn-success.btn-lg.btn-block ("Sign in")
```
