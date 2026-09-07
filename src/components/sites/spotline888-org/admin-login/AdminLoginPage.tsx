"use client";

import React from "react";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="admin-login-page-root">
      <div className="container">
        <div className="login-wrapper">
          <AdminLoginForm />
        </div>
      </div>

      <style jsx global>{`
        /* Reset any conflicting inherited styles for the admin login route */
        .admin-login-page-root {
          min-height: 100vh;
          width: 100%;
          color: #999999;
          background: url("/sites/spotline888-org/admin-login/loginbg.jpg") no-repeat center center fixed;
          background-size: cover;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
            Arial, sans-serif;
          font-size: 13px;
          line-height: 1.42857143;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .admin-login-page-root *,
        .admin-login-page-root *::before,
        .admin-login-page-root *::after {
          box-sizing: border-box;
        }

        .admin-login-page-root a {
          color: #ffffff;
        }

        .admin-login-page-root .container {
          width: 100%;
          margin-right: auto;
          margin-left: auto;
          padding-left: 15px;
          padding-right: 15px;
          flex: 1;
        }

        @media (min-width: 768px) {
          .admin-login-page-root .container {
            width: 750px;
          }
        }
        @media (min-width: 992px) {
          .admin-login-page-root .container {
            width: 970px;
          }
        }
        @media (min-width: 1200px) {
          .admin-login-page-root .container {
            width: 1170px;
          }
        }

        .admin-login-page-root .login-wrapper {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
