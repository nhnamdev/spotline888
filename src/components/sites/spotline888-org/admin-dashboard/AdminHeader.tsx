"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getR2Url } from "@/lib/r2";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  activeTab?: "dashboard" | "order" | "user" | "upmark" | "downmark" | "product" | "productType" | "loanConfig" | "loanRecord" | "generalConfig" | "authAdmin" | "authAdminLog" | "authGroup" | "authRule" | "category" | "attachment" | "profile" | "notice" | "verify" | "yuebaoOrder" | "yuebaoConfig" | "ipwhitelist";
}

export default function AdminHeader({ onToggleSidebar, activeTab = "dashboard" }: AdminHeaderProps) {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCacheMenuOpen, setIsCacheMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // End date matching live site countdown
    const targetDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 0); // 0 days remaining on live site
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_keep_login");
    document.cookie = "admin_token=; path=/; max-age=0";
    window.location.href = "/admin/login";
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSidebarToggle = () => {
    window.dispatchEvent(new CustomEvent("admin-sidebar-toggle"));
    onToggleSidebar();
  };

  return (
    <header className="main-header">
      {/* Brand Logo */}
      <a href="/admin/dashboard" className="logo">
        <span className="logo-lg">
          <b>Abbott</b>
        </span>
      </a>

      {/* Header Navbar */}
      <nav className="navbar navbar-static-top">
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          className="sidebar-toggle"
          onClick={handleSidebarToggle}
          title="折叠菜单"
        >
          <i className="fa fa-bars"></i>
        </button>

        {/* Top Active Tabs */}
        <div className="header-tab-container">
          <div
            className={`header-tab ${activeTab === "dashboard" ? "active" : "inactive"}`}
            onClick={() => router.push("/admin/dashboard")}
          >
            <i className="fa fa-dashboard fa-fw"></i>
            <span>控制台</span>
          </div>
          {activeTab === "order" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/admin/order")}
            >
              <i className="fa fa-list-ol fa-fw"></i>
              <span>订单管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "user" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/admin/user")}
            >
              <i className="fa fa-users fa-fw"></i>
              <span>会员管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "upmark" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/admin/upmark")}
            >
              <i className="fa fa-hand-o-up fa-fw"></i>
              <span>充值管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "downmark" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/admin/downmark")}
            >
              <i className="fa fa-hand-o-down fa-fw"></i>
              <span>提现管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "product" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/admin/product")}
            >
              <i className="fa fa-shopping-bag fa-fw"></i>
              <span>产品列表</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "productType" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/product/type")}
            >
              <i className="fa fa-list-alt fa-fw"></i>
              <span>产品分类</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "loanConfig" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/loan_config")}
            >
              <i className="fa fa-cog fa-fw"></i>
              <span>贷款配置管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "loanRecord" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/loan_record")}
            >
              <i className="fa fa-list fa-fw"></i>
              <span>贷款记录管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "generalConfig" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/general/config")}
            >
              <i className="fa fa-cog fa-fw"></i>
              <span>网站配置</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "authAdmin" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/general/auth/admin")}
            >
              <i className="fa fa-user fa-fw"></i>
              <span>管理员管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "authAdminLog" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/general/auth/adminlog")}
            >
              <i className="fa fa-list-alt fa-fw"></i>
              <span>管理员日志</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "authGroup" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/general/auth/group")}
            >
              <i className="fa fa-group fa-fw"></i>
              <span>角色组</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "authRule" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/general/auth/rule")}
            >
              <i className="fa fa-bars fa-fw"></i>
              <span>菜单规则</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "category" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/general/category")}
            >
              <i className="fa fa-leaf fa-fw"></i>
              <span>图文管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "attachment" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/general/attachment")}
            >
              <i className="fa fa-file-image-o fa-fw"></i>
              <span>附件管理</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "profile" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/general/profile")}
            >
              <i className="fa fa-user fa-fw"></i>
              <span>个人资料</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "notice" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/notice")}
            >
              <i className="fa fa-newspaper-o fa-fw"></i>
              <span>新闻公告</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "verify" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/verify")}
            >
              <i className="fa fa-circle-o fa-fw"></i>
              <span>实名认证</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "yuebaoOrder" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/yuebao_order")}
            >
              <i className="fa fa-circle-o fa-fw"></i>
              <span>余额宝订单</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "yuebaoConfig" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/yuebao_config")}
            >
              <i className="fa fa-circle-o fa-fw"></i>
              <span>余额宝配置</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
          {activeTab === "ipwhitelist" && (
            <div
              className="header-tab active"
              onClick={() => router.push("/ipwhitelist")}
            >
              <i className="fa fa-shield fa-fw"></i>
              <span>后台IP白名单</span>
              <span
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/dashboard");
                }}
                title="关闭标签"
              >
                <i className="fa fa-times"></i>
              </span>
            </div>
          )}
        </div>

        {/* Expiration Countdown */}
        <div className="countdown-container">
          <div className="countdown-timer">
            <span className="countdown-label">到期时间:</span>
            <span className="countdown-days">{countdown.days}</span>
            <span className="countdown-unit">天</span>
            <span className="countdown-hours">{countdown.hours}</span>
            <span className="countdown-unit">时</span>
            <span className="countdown-minutes">{countdown.minutes}</span>
            <span className="countdown-unit">分</span>
            <span className="countdown-seconds">{countdown.seconds}</span>
            <span className="countdown-unit">秒</span>
          </div>
        </div>

        {/* Right Nav Menu */}
        <div className="navbar-custom-menu">
          <ul className="nav navbar-nav">
            {/* Home link */}
            <li>
              <a href="/" target="_blank" className="nav-btn-link" title="前台首页">
                <i className="fa fa-home"></i>
              </a>
            </li>

            {/* Clear cache */}
            <li className={`dropdown ${isCacheMenuOpen ? "open" : ""}`}>
              <button
                type="button"
                className="nav-btn"
                onClick={() => {
                  setIsCacheMenuOpen(!isCacheMenuOpen);
                  setIsUserMenuOpen(false);
                }}
                title="清除缓存"
              >
                <i className="fa fa-trash"></i>
              </button>
              {isCacheMenuOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <button type="button" onClick={() => setIsCacheMenuOpen(false)}>
                      <i className="fa fa-trash"></i> 一键清除缓存
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => setIsCacheMenuOpen(false)}>
                      <i className="fa fa-file-text"></i> 清除内容缓存
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => setIsCacheMenuOpen(false)}>
                      <i className="fa fa-file-image-o"></i> 清除模板缓存
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => setIsCacheMenuOpen(false)}>
                      <i className="fa fa-rocket"></i> 清除插件缓存
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Fullscreen */}
            <li className="hidden-xs">
              <button
                type="button"
                className="nav-btn"
                onClick={toggleFullscreen}
                title="全屏"
              >
                <i className="fa fa-arrows-alt"></i>
              </button>
            </li>

            {/* User Dropdown */}
            <li className={`dropdown user user-menu ${isUserMenuOpen ? "open" : ""}`}>
              <button
                type="button"
                className="dropdown-toggle user-btn"
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsCacheMenuOpen(false);
                }}
              >
                <Image
                  src={getR2Url("/sites/spotline888-org/admin-dashboard/admin_avatar.jpg")}
                  className="user-image"
                  alt="Spot"
                  width={24}
                  height={24}
                />
                <span className="hidden-xs user-name">Spot</span>
              </button>

              {isUserMenuOpen && (
                <ul className="dropdown-menu user-dropdown">
                  <li className="user-header">
                    <Image
                      src={getR2Url("/sites/spotline888-org/admin-dashboard/admin_avatar.jpg")}
                      className="img-circle"
                      alt="Spot"
                      width={80}
                      height={80}
                    />
                    <p>
                      Spot <small>2026-09-07 16:58:21</small>
                    </p>
                  </li>
                  <li className="user-footer">
                    <div className="pull-left">
                      <button
                        type="button"
                        className="btn btn-primary btn-flat"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          router.push("/general/profile");
                        }}
                      >
                        个人资料
                      </button>
                    </div>
                    <div className="pull-right">
                      <button
                        type="button"
                        className="btn btn-danger btn-flat"
                        onClick={handleLogout}
                      >
                        退出登录
                      </button>
                    </div>
                  </li>
                </ul>
              )}
            </li>

            {/* Control Sidebar Gears */}
            <li className="hidden-xs">
              <button type="button" className="nav-btn" title="系统设置">
                <i className="fa fa-gears"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 50px;
          z-index: 1030;
          display: flex;
          background-color: #18bc9c;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }

        .main-header .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 230px;
          height: 50px;
          background-color: #18bc9c;
          color: #ffffff;
          font-size: 20px;
          line-height: 50px;
          text-align: center;
          text-decoration: none;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        @media (max-width: 767px) {
          .main-header .logo {
            width: 75px;
            font-size: 15px;
            padding: 0 4px;
          }
        }

        .navbar {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #18bc9c;
          height: 50px;
          padding: 0 15px;
          position: relative;
          min-width: 0;
          overflow: hidden;
        }

        .sidebar-toggle {
          background: transparent;
          border: none;
          color: #ffffff;
          padding: 0 15px;
          height: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .sidebar-toggle:hover {
          background-color: rgba(0, 0, 0, 0.08);
        }

        .header-tab-container {
          display: flex;
          align-items: center;
          height: 50px;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          flex: 1;
          min-width: 0;
        }

        .header-tab-container::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 767px) {
          .navbar {
            padding: 0 4px;
          }

          .sidebar-toggle {
            padding: 0 8px;
          }

          .header-tab {
            padding: 0 8px !important;
            font-size: 12px !important;
            gap: 4px !important;
          }

          .nav-btn,
          .nav-btn-link,
          .user-btn {
            padding: 0 8px !important;
          }

          .dropdown-menu {
            max-width: 90vw !important;
            right: 0 !important;
          }

          .user-dropdown {
            max-width: 250px !important;
          }
        }

        .header-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.85);
          height: 50px;
          padding: 0 16px;
          font-size: 13px;
          cursor: pointer;
          user-select: none;
          background-color: transparent;
          transition: background-color 0.15s ease;
        }

        .header-tab:hover {
          background-color: rgba(0, 0, 0, 0.08);
          color: #ffffff;
        }

        .header-tab.active {
          background-color: rgba(0, 0, 0, 0.15);
          color: #ffffff;
        }

        .header-tab.inactive {
          background-color: rgba(0, 0, 0, 0.05);
          color: rgba(255, 255, 255, 0.75);
        }

        .close-tab {
          margin-left: 6px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          padding: 2px 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-tab:hover {
          color: #ffffff;
          background-color: rgba(0, 0, 0, 0.2);
        }

        .countdown-container {
          margin-left: auto;
          margin-right: 20px;
          display: flex;
          align-items: center;
        }

        .countdown-timer {
          color: #333333;
          font-size: 13px;
          font-weight: bold;
          white-space: nowrap;
        }

        .countdown-label {
          color: #333333;
          margin-right: 4px;
        }

        .countdown-days,
        .countdown-hours,
        .countdown-minutes,
        .countdown-seconds {
          color: #ff4444;
          font-weight: bold;
          margin: 0 2px;
        }

        .countdown-unit {
          color: #333333;
          margin-right: 6px;
        }

        @media (max-width: 991px) {
          .countdown-container {
            display: none;
          }
        }

        .navbar-custom-menu {
          display: flex;
          align-items: center;
        }

        .navbar-nav {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .navbar-nav > li {
          position: relative;
        }

        .nav-btn,
        .nav-btn-link {
          background: transparent;
          border: none;
          color: #ffffff;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          height: 50px;
          font-size: 15px;
          text-decoration: none;
        }

        .nav-btn:hover,
        .nav-btn-link:hover {
          background-color: rgba(0, 0, 0, 0.08);
        }

        .user-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          padding: 0 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          height: 50px;
        }

        .user-btn:hover {
          background-color: rgba(0, 0, 0, 0.08);
        }

        .user-image {
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .user-name {
          font-size: 14px;
          color: #ffffff;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          min-width: 180px;
          padding: 5px 0;
          margin: 2px 0 0;
          font-size: 13px;
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
          list-style: none;
        }

        .dropdown-menu button {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 20px;
          clear: both;
          font-weight: 400;
          color: #333333;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 13px;
        }

        .dropdown-menu button:hover {
          background-color: #f5f5f5;
          color: #18bc9c;
        }

        .user-dropdown {
          width: 260px;
          padding: 0;
          border-radius: 4px;
          overflow: hidden;
        }

        .user-header {
          padding: 20px;
          text-align: center;
          background-color: #18bc9c;
          color: #ffffff;
        }

        .user-header .img-circle {
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.3);
          object-fit: cover;
        }

        .user-header p {
          margin: 10px 0 0;
          font-size: 16px;
        }

        .user-header small {
          display: block;
          font-size: 12px;
          opacity: 0.85;
          margin-top: 4px;
        }

        .user-footer {
          background-color: #f9f9f9;
          padding: 10px;
          display: flex;
          justify-content: space-between;
        }

        .btn-flat {
          border-radius: 2px;
          padding: 6px 14px;
          font-size: 12px;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background-color: #2c3e50;
          color: #ffffff;
        }

        .btn-danger {
          background-color: #e74c3c;
          color: #ffffff;
        }
      `}</style>
    </header>
  );
}
