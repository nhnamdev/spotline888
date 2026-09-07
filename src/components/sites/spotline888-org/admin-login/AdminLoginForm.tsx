"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GlyphiconUser, GlyphiconLock, GlyphiconEllipsis } from "./AdminIcons";
import AdminCaptcha from "./AdminCaptcha";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [activeFocus, setActiveFocus] = useState<"username" | "password" | "captcha" | null>(null);

  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim()) {
      setErrorMessage("Username cannot be empty");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Password cannot be empty");
      return;
    }
    if (!captcha.trim()) {
      setErrorMessage("Captcha cannot be empty");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Validate credentials against temporary admin account
      if (username.trim() === "admin" && password.trim() === "admin888") {
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_user", "admin");
          if (keepLogin) {
            localStorage.setItem("admin_keep_login", "1");
          }
        }
        setToastMessage({ type: "success", text: "Sign in successful" });
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 800);
      } else {
        const errorText = "Invalid username or password";
        setErrorMessage(errorText);
        setToastMessage({ type: "error", text: errorText });
        setTimeout(() => {
          setToastMessage(null);
        }, 3000);
      }
    }, 500);
  };

  return (
    <div className="login-screen">
      {toastMessage && (
        <div className={`admin-toastr toast-${toastMessage.type}`} role="status">
          <div className="toast-icon">
            {toastMessage.type === "success" ? "✓" : "!"}
          </div>
          <div className="toast-message">{toastMessage.text}</div>
        </div>
      )}
      <div className="well">
        <div className="login-form">
          <Image
            id="profile-img"
            className="profile-img-card"
            src="/sites/spotline888-org/admin-login/avatar.png"
            alt="Profile Avatar"
            width={100}
            height={100}
            priority
          />
          <p id="profile-name" className="profile-name-card"></p>

          <form action="" method="post" id="login-form" onSubmit={handleSubmit}>
            {errorMessage ? (
              <div id="errtips" className="admin-errtips" role="alert">
                {errorMessage}
              </div>
            ) : (
              <div id="errtips" className="hide" />
            )}

            <input
              type="hidden"
              name="__token__"
              value="f7ada3cc0956c533b5de235967523142"
            />

            {/* Username Input Group */}
            <div className="input-group">
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-user" aria-hidden="true">
                  <GlyphiconUser />
                </span>
              </div>
              <input
                type="text"
                className={`form-control ${activeFocus === "username" ? "is-focused" : ""}`}
                id="pd-form-username"
                placeholder="Username"
                name="username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setActiveFocus("username")}
                onBlur={() => setActiveFocus(null)}
              />
            </div>

            {/* Password Input Group */}
            <div className="input-group">
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-lock" aria-hidden="true">
                  <GlyphiconLock />
                </span>
              </div>
              <input
                type="password"
                className={`form-control ${activeFocus === "password" ? "is-focused" : ""}`}
                id="pd-form-password"
                placeholder="Password"
                name="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveFocus("password")}
                onBlur={() => setActiveFocus(null)}
              />
            </div>

            {/* Captcha Input Group */}
            <div className="input-group captcha-group">
              <div className="input-group-addon">
                <span className="glyphicon glyphicon-option-horizontal" aria-hidden="true">
                  <GlyphiconEllipsis />
                </span>
              </div>
              <input
                type="text"
                name="captcha"
                className={`form-control captcha-control ${
                  activeFocus === "captcha" ? "is-focused" : ""
                }`}
                placeholder="Captcha"
                autoComplete="off"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                onFocus={() => setActiveFocus("captcha")}
                onBlur={() => setActiveFocus(null)}
              />
              <span
                className="input-group-addon captcha-addon"
                style={{ padding: 0, border: "none", cursor: "pointer" }}
              >
                <AdminCaptcha />
              </span>
            </div>

            {/* Keep Login Checkbox */}
            <div className="form-group keep-login-group">
              <label className="inline" htmlFor="keeplogin">
                <input
                  type="checkbox"
                  name="keeplogin"
                  id="keeplogin"
                  value="1"
                  checked={keepLogin}
                  onChange={(e) => setKeepLogin(e.target.checked)}
                />
                Keep login
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-success btn-lg btn-block"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-screen {
          max-width: 400px;
          padding: 0;
          margin: 100px auto 0 auto;
          width: 100%;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
            Arial, sans-serif;
        }

        .login-screen .well {
          border-radius: 3px;
          -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.2);
          min-height: 20px;
          padding: 19px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-sizing: border-box;
        }

        @media (max-width: 767px) {
          .login-screen {
            padding: 0 20px;
            margin: 60px auto 0 auto;
          }
        }

        .profile-img-card {
          width: 100px;
          height: 100px;
          margin: 10px auto;
          display: block;
          -moz-border-radius: 50%;
          -webkit-border-radius: 50%;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-name-card {
          text-align: center;
          margin: 0;
          min-height: 10px;
        }

        #login-form {
          margin-top: 20px;
        }

        .admin-errtips {
          background-color: #f2dede;
          border: 1px solid #ebccd1;
          color: #a94442;
          padding: 8px 12px;
          margin-bottom: 15px;
          border-radius: 3px;
          font-size: 12px;
          line-height: 1.4;
          text-align: left;
        }

        .hide {
          display: none;
        }

        .input-group {
          margin-bottom: 15px;
          position: relative;
          display: table;
          border-collapse: separate;
          width: 100%;
          box-sizing: border-box;
        }

        .input-group-addon {
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 400;
          line-height: 1;
          color: #555555;
          text-align: center;
          background-color: #eeeeee;
          border: 1px solid #cccccc;
          border-radius: 3px;
          width: 1%;
          white-space: nowrap;
          vertical-align: middle;
          display: table-cell;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: 0;
          box-sizing: border-box;
        }

        .input-group-addon.captcha-addon {
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          width: 100px;
          height: 30px;
          background: transparent;
        }

        .form-control {
          display: table-cell;
          position: relative;
          z-index: 2;
          float: left;
          width: 100%;
          height: 31px;
          padding: 6px 12px;
          font-size: 12px;
          line-height: 1.42857143;
          color: #555555;
          background-color: #ffffff;
          background-image: none;
          border: 1px solid #cccccc;
          border-radius: 3px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
          transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
          outline: none;
          box-sizing: border-box;
        }

        .form-control.captcha-control {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: 0;
        }

        .form-control.is-focused {
          border-color: #66afe9;
          outline: 0;
          -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
            0 0 8px rgba(102, 175, 233, 0.6);
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
          z-index: 3;
        }

        .form-control::placeholder {
          color: #999999;
          opacity: 1;
        }

        .form-group {
          margin-bottom: 15px;
          box-sizing: border-box;
        }

        .keep-login-group {
          margin-bottom: 15px;
          text-align: left;
        }

        label.inline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          max-width: 100%;
          margin-bottom: 0;
          font-weight: 400;
          color: #999999;
          font-size: 13px;
          cursor: pointer;
          user-select: none;
        }

        label.inline input[type="checkbox"] {
          margin: 0;
          cursor: pointer;
          width: 13px;
          height: 13px;
          accent-color: #18bc9c;
        }

        .btn {
          display: inline-block;
          margin-bottom: 0;
          font-weight: 400;
          text-align: center;
          vertical-align: middle;
          touch-action: manipulation;
          cursor: pointer;
          background-image: none;
          border: 1px solid transparent;
          white-space: nowrap;
          user-select: none;
          box-sizing: border-box;
        }

        .btn-success {
          color: #ffffff;
          background-color: #18bc9c;
          border-color: #18bc9c;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }

        .btn-success:hover {
          color: #ffffff;
          background-color: #128f76;
          border-color: #11866f;
        }

        .btn-success:focus,
        .btn-success:active {
          color: #ffffff;
          background-color: #128f76;
          border-color: #0a4b3e;
          -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
          box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
          outline: none;
        }

        .btn-lg {
          padding: 10px 16px;
          font-size: 15px;
          line-height: 1.3333333;
          border-radius: 5px;
        }

        .btn-block {
          display: block;
          width: 100%;
        }

        .btn[disabled] {
          cursor: not-allowed;
          opacity: 0.65;
          box-shadow: none;
        }

        .admin-toastr {
          position: fixed;
          top: 15px;
          right: 15px;
          z-index: 999999;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: 3px;
          color: #ffffff;
          font-size: 13px;
          font-family: inherit;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
          animation: toastrSlideIn 0.25s ease-out;
          max-width: 320px;
        }

        .admin-toastr.toast-success {
          background-color: #51a351;
        }

        .admin-toastr.toast-error {
          background-color: #bd362f;
        }

        .toast-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          flex-shrink: 0;
        }

        @keyframes toastrSlideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
