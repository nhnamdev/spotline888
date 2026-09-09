"use client";

import React from "react";
import AdminLoginForm from "./AdminLoginForm";
import { getR2Url } from "@/lib/r2";

export default function AdminLoginPage() {
  const bgUrl = getR2Url("/sites/spotline888-org/admin-login/loginbg.jpg");

  return (
    <div
      className="admin-login-page-root"
      style={{
        backgroundImage: `url("${bgUrl}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
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
