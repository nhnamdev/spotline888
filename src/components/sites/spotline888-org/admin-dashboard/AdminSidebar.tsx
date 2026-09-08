"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface AdminSidebarProps {
  isCollapsed: boolean;
  activePath?: string;
}

export default function AdminSidebar({ isCollapsed, activePath }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = activePath || pathname || "";

  const isProductActive = currentPath.includes("product");
  const isProductListActive = currentPath.includes("product/product") || currentPath === "/product";
  const isProductTypeActive = currentPath.includes("product/type");
  const isLoanActive = currentPath.includes("loan");
  const isLoanConfigActive = currentPath.includes("loan_config");
  const isLoanRecordActive = currentPath.includes("loan_record");
  const isSystemActive = currentPath.includes("general");
  const isGeneralConfigActive = currentPath.includes("general/config");
  const isDownmarkActive = currentPath.includes("downmark");
  const isUpmarkActive = currentPath.includes("upmark");
  const isUserActive = currentPath.includes("user");
  const isOrderActive = currentPath.includes("order");
  const isDashboardActive =
    !isOrderActive && !isUserActive && !isUpmarkActive && !isDownmarkActive && !isProductActive && !isLoanActive && !isSystemActive;

  // State for treeview toggling
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    product: isProductActive,
    loan: isLoanActive,
    system: isSystemActive,
    auth: false,
    yuebao: false,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <aside className={`main-sidebar ${isCollapsed ? "sidebar-collapse" : ""}`}>
      <section className="sidebar">
        {/* 管理员信息 */}
        <div className="user-panel hidden-xs">
          <div className="pull-left image">
            <a href="general/profile" className="addtabsit" onClick={(e) => e.preventDefault()}>
              <Image
                src="/uploads/20251210/c3daf0015559501fb836681ca784c977.jpg"
                className="img-circle"
                alt="Spot"
                width={45}
                height={45}
                priority
              />
            </a>
          </div>
          <div className="pull-left info">
            <p>Spot</p>
            <span className="status-indicator">
              <i className="fa fa-circle text-success"></i> Online
            </span>
          </div>
        </div>

        {/* 菜单搜索 */}
        <form
          action=""
          method="get"
          className="sidebar-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="input-group">
            <input
              type="text"
              name="q"
              className="form-control"
              placeholder="Search menu"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            <span className="input-group-btn">
              <button
                type="submit"
                name="search"
                id="search-btn"
                className="btn btn-flat"
              >
                <i className="fa fa-search"></i>
              </button>
            </span>
          </div>
        </form>

        {/* 移动端一级菜单 */}
        <div className="mobilenav visible-xs"></div>

        {/* 如果想始终显示子菜单,则给ul加上show-submenu类即可,当multiplenav开启的情况下默认为展开 */}
        <ul className="sidebar-menu">
          {/* 菜单可以在 后台管理->权限管理->菜单规则 中进行增删改排序 */}

          {/* 1. 控制台 */}
          <li className={isDashboardActive ? "active" : ""}>
            <a
              href="/admin/dashboard"
              addtabs="1"
              url="/coinht.php/dashboard"
              py="kzt"
              pinyin="kongzhitai"
              onClick={(e) => {
                e.preventDefault();
                router.push("/admin/dashboard");
              }}
            >
              <i className="fa fa-dashboard fa-fw"></i>
              <span>控制台</span>
              <span className="pull-right-container"> </span>
            </a>
          </li>

          {/* 2. 订单管理 */}
          <li className={isOrderActive ? "active" : ""}>
            <a
              href="/coinht.php/order?ref=addtabs"
              addtabs="96"
              url="/coinht.php/order"
              py="ddgl"
              pinyin="dingdanguanli"
              onClick={(e) => {
                e.preventDefault();
                router.push("/order");
              }}
            >
              <i className="fa fa-list-ol fa-fw"></i>
              <span>订单管理</span>
              <span className="pull-right-container"> </span>
            </a>
          </li>

          {/* 3. 会员管理 */}
          <li className={isUserActive ? "active" : ""}>
            <a
              href="/coinht.php/user?ref=addtabs"
              addtabs="66"
              url="/coinht.php/user"
              py="hygl"
              pinyin="huiyuanguanli"
              onClick={(e) => {
                e.preventDefault();
                router.push("/user");
              }}
            >
              <i className="fa fa-users fa-fw"></i>
              <span>会员管理</span>
              <span className="pull-right-container"> </span>
            </a>
          </li>

          {/* 4. 充值管理 */}
          <li className={isUpmarkActive ? "active" : ""}>
            <a
              href="/coinht.php/upmark?ref=addtabs"
              addtabs="97"
              url="/coinht.php/upmark"
              py="czgl"
              pinyin="chongzhiguanli"
              onClick={(e) => {
                e.preventDefault();
                router.push("/upmark");
              }}
            >
              <i className="fa fa-hand-o-up fa-fw"></i>
              <span>充值管理</span>
              <span className="pull-right-container">
                <small className="label pull-right bg-orange">
                  <span id="upmark">0</span>
                </small>
              </span>
            </a>
          </li>

          {/* 5. 提现管理 */}
          <li className={isDownmarkActive ? "active" : ""}>
            <a
              href="/coinht.php/downmark?ref=addtabs"
              addtabs="98"
              url="/coinht.php/downmark"
              py="txgl"
              pinyin="tixianguanli"
              onClick={(e) => {
                e.preventDefault();
                router.push("/downmark");
              }}
            >
              <i className="fa fa-hand-o-down fa-fw"></i>
              <span>提现管理</span>
              <span className="pull-right-container">
                <small className="label pull-right bg-red">
                  <span id="downmark">373</span>
                </small>
              </span>
            </a>
          </li>

          {/* 6. 产品管理 (Treeview) */}
          <li
            className={`treeview ${
              openMenus.product || isProductActive ? "menu-open" : ""
            }`}
          >
            <a
              href="javascript:;"
              addtabs="203"
              url="javascript:;"
              py="cpgl"
              pinyin="chanpinguanli"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu("product");
              }}
            >
              <i className="fa fa-shopping-bag fa-fw"></i>
              <span>产品管理</span>
              <span className="pull-right-container">
                <i
                  className={`fa fa-angle-left ${
                    openMenus.product || isProductActive ? "rotate-arrow" : ""
                  }`}
                ></i>
              </span>
            </a>
            {(openMenus.product || isProductActive) && (
              <ul className="treeview-menu">
                <li className={isProductListActive ? "active" : ""}>
                  <a
                    href="/coinht.php/product/product?ref=addtabs"
                    addtabs="204"
                    url="/coinht.php/product/product"
                    py="cplb"
                    pinyin="chanpinliebiao"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/product/product");
                    }}
                  >
                    <i className="fa fa-shopping-bag fa-fw"></i>
                    <span>产品列表</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
                <li className={isProductTypeActive ? "active" : ""}>
                  <a
                    href="/coinht.php/product/type?ref=addtabs"
                    addtabs="205"
                    url="/coinht.php/product/type"
                    py="cpfl"
                    pinyin="chanpinfenlei"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/product/type");
                    }}
                  >
                    <i className="fa fa-list-alt fa-fw"></i>
                    <span>产品分类</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* 7. 贷款管理 (Treeview) */}
          <li
            className={`treeview ${
              openMenus.loan || isLoanActive ? "menu-open" : ""
            }`}
          >
            <a
              href="javascript:;"
              addtabs="233"
              url="javascript:;"
              py="dkgl"
              pinyin="daikuanguanli"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu("loan");
              }}
            >
              <i className="fa fa-credit-card fa-fw"></i>
              <span>贷款管理</span>
              <span className="pull-right-container">
                <i
                  className={`fa fa-angle-left ${
                    openMenus.loan || isLoanActive ? "rotate-arrow" : ""
                  }`}
                ></i>
              </span>
            </a>
            {(openMenus.loan || isLoanActive) && (
              <ul className="treeview-menu">
                <li className={isLoanConfigActive ? "active" : ""}>
                  <a
                    href="/coinht.php/loan_config?ref=addtabs"
                    addtabs="234"
                    url="/coinht.php/loan_config"
                    py="dkpzgl"
                    pinyin="daikuanpeizhiguanli"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/loan_config");
                    }}
                  >
                    <i className="fa fa-cog fa-fw"></i>
                    <span>贷款配置管理</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
                <li className={isLoanRecordActive ? "active" : ""}>
                  <a
                    href="/coinht.php/loan_record?ref=addtabs"
                    addtabs="239"
                    url="/coinht.php/loan_record"
                    py="dkjlgl"
                    pinyin="daikuanjiluguanli"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/loan_record");
                    }}
                  >
                    <i className="fa fa-list fa-fw"></i>
                    <span>贷款记录管理</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* 8. 系统设置 (Treeview with nested submenus) */}
          <li
            className={`treeview ${
              openMenus.system || isSystemActive ? "menu-open" : ""
            }`}
          >
            <a
              href="javascript:;"
              addtabs="2"
              url="javascript:;"
              py="xtsz"
              pinyin="xitongshezhi"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu("system");
              }}
            >
              <i className="fa fa-cogs fa-fw"></i>
              <span>系统设置</span>
              <span className="pull-right-container">
                <i
                  className={`fa fa-angle-left ${
                    openMenus.system || isSystemActive ? "rotate-arrow" : ""
                  }`}
                ></i>
              </span>
            </a>
            {(openMenus.system || isSystemActive) && (
              <ul className="treeview-menu">
                <li className={isGeneralConfigActive ? "active" : ""}>
                  <a
                    href="/coinht.php/general/config?ref=addtabs"
                    addtabs="6"
                    url="/coinht.php/general/config"
                    py="wzpz"
                    pinyin="wangzhanpeizhi"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/general/config");
                    }}
                  >
                    <i className="fa fa-cog fa-fw"></i>
                    <span>网站配置</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
                {/* 嵌套 权限管理 */}
                <li className={`treeview ${openMenus.auth ? "menu-open" : ""}`}>
                  <a
                    href="javascript:;"
                    addtabs="5"
                    url="javascript:;"
                    py="qxgl"
                    pinyin="quanxianguanli"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu("auth");
                    }}
                  >
                    <i className="fa fa-group fa-fw"></i>
                    <span>权限管理</span>
                    <span className="pull-right-container">
                      <i
                        className={`fa fa-angle-left ${
                          openMenus.auth ? "rotate-arrow" : ""
                        }`}
                      ></i>
                    </span>
                  </a>
                  {openMenus.auth && (
                    <ul className="treeview-menu level-2">
                      <li className="">
                        <a
                          href="/coinht.php/auth/admin?ref=addtabs"
                          addtabs="9"
                          url="/coinht.php/auth/admin"
                          py="A"
                          pinyin="Admin"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fa fa-user fa-fw"></i>
                          <span>Admin</span>
                          <span className="pull-right-container"> </span>
                        </a>
                      </li>
                      <li className="">
                        <a
                          href="/coinht.php/auth/adminlog?ref=addtabs"
                          addtabs="10"
                          url="/coinht.php/auth/adminlog"
                          py="Al"
                          pinyin="Adminlog"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fa fa-list-alt fa-fw"></i>
                          <span>Admin log</span>
                          <span className="pull-right-container"> </span>
                        </a>
                      </li>
                      <li className="">
                        <a
                          href="/coinht.php/auth/group?ref=addtabs"
                          addtabs="11"
                          url="/coinht.php/auth/group"
                          py="G"
                          pinyin="Group"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fa fa-group fa-fw"></i>
                          <span>Group</span>
                          <span className="pull-right-container"> </span>
                        </a>
                      </li>
                      <li className="">
                        <a
                          href="/coinht.php/auth/rule?ref=addtabs"
                          addtabs="12"
                          url="/coinht.php/auth/rule"
                          py="cdgz"
                          pinyin="caidanguize"
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fa fa-bars fa-fw"></i>
                          <span>菜单规则</span>
                          <span className="pull-right-container">
                            <small className="label pull-right bg-teal">
                              Menu
                            </small>
                          </span>
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
                <li className="">
                  <a
                    href="/coinht.php/category?ref=addtabs"
                    addtabs="3"
                    url="/coinht.php/category"
                    py="twgl"
                    pinyin="tuwenguanli"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-leaf fa-fw"></i>
                    <span>图文管理</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
                <li className="">
                  <a
                    href="/coinht.php/general/attachment?ref=addtabs"
                    addtabs="7"
                    url="/coinht.php/general/attachment"
                    py="A"
                    pinyin="Attachment"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-file-image-o fa-fw"></i>
                    <span>Attachment</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
                <li className="">
                  <a
                    href="/coinht.php/general/profile?ref=addtabs"
                    addtabs="8"
                    url="/coinht.php/general/profile"
                    py="P"
                    pinyin="Profile"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-user fa-fw"></i>
                    <span>Profile</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* 9. 新闻公告 */}
          <li className="">
            <a
              href="/coinht.php/notice?ref=addtabs"
              addtabs="206"
              url="/coinht.php/notice"
              py="xwgg"
              pinyin="xinwengonggao"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fa fa-newspaper-o fa-fw"></i>
              <span>新闻公告</span>
              <span className="pull-right-container"> </span>
            </a>
          </li>

          {/* 10. 实名认证 */}
          <li className="">
            <a
              href="/coinht.php/verify?ref=addtabs"
              addtabs="229"
              url="/coinht.php/verify"
              py="smrz"
              pinyin="shimingrenzheng"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fa fa-circle-o fa-fw"></i>
              <span>实名认证</span>
              <span className="pull-right-container">
                <small className="label pull-right bg-yellow">
                  <span id="verifymark">1</span>
                </small>
              </span>
            </a>
          </li>

          {/* 11. 余额宝管理 (Treeview) */}
          <li className={`treeview ${openMenus.yuebao ? "menu-open" : ""}`}>
            <a
              href="javascript:;"
              addtabs="230"
              url="javascript:;"
              py="yebgl"
              pinyin="yuebaoguanli"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu("yuebao");
              }}
            >
              <i className="fa fa-circle-o fa-fw"></i>
              <span>余额宝管理</span>
              <span className="pull-right-container">
                <i
                  className={`fa fa-angle-left ${
                    openMenus.yuebao ? "rotate-arrow" : ""
                  }`}
                ></i>
              </span>
            </a>
            {openMenus.yuebao && (
              <ul className="treeview-menu">
                <li className="">
                  <a
                    href="/coinht.php/yuebao_order/index?ref=addtabs"
                    addtabs="231"
                    url="/coinht.php/yuebao_order/index"
                    py="yebdd"
                    pinyin="yuebaodingdan"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-circle-o fa-fw"></i>
                    <span>余额宝订单</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
                <li className="">
                  <a
                    href="/coinht.php/yuebao_config?ref=addtabs"
                    addtabs="232"
                    url="/coinht.php/yuebao_config"
                    py="yebpz"
                    pinyin="yuebaopeizhi"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-circle-o fa-fw"></i>
                    <span>余额宝配置</span>
                    <span className="pull-right-container"> </span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* 12. 后台IP白名单 */}
          <li className="">
            <a
              href="/coinht.php/index/ipwhitelist?ref=addtabs"
              addtabs="241"
              url="/coinht.php/index/ipwhitelist"
              py="htIbmd"
              pinyin="houtaiIPbaimingdan"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fa fa-shield fa-fw"></i>
              <span>后台IP白名单</span>
              <span className="pull-right-container"> </span>
            </a>
          </li>
        </ul>
      </section>

      <style jsx>{`
        .main-sidebar {
          position: fixed;
          top: 50px;
          left: 0;
          bottom: 0;
          width: 230px;
          z-index: 820;
          background-color: #222d32;
          overflow-y: auto;
          overflow-x: hidden;
          transition: width 0.3s ease-in-out;
          font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
            "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
          user-select: none;
        }

        .main-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .main-sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .main-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .main-sidebar.sidebar-collapse {
          width: 50px;
        }

        .main-sidebar.sidebar-collapse .user-panel,
        .main-sidebar.sidebar-collapse .sidebar-form,
        .main-sidebar.sidebar-collapse .sidebar-menu > li > a > span,
        .main-sidebar.sidebar-collapse .sidebar-menu > li > a > .pull-right-container {
          display: none !important;
        }

        .main-sidebar.sidebar-collapse .sidebar-menu > li > a {
          padding: 12px 15px;
          text-align: center;
        }

        .main-sidebar.sidebar-collapse .sidebar-menu > li > a > .fa-fw {
          margin-right: 0;
        }

        .sidebar {
          padding-bottom: 20px;
          width: 230px;
        }

        /* 管理员信息 User Panel */
        .user-panel {
          position: relative;
          width: 100%;
          padding: 10px 10px 10px 15px;
          overflow: hidden;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }

        .user-panel .image {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
        }

        .user-panel :global(.img-circle) {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .user-panel .info {
          padding: 4px 5px 5px 12px;
          line-height: 1;
        }

        .user-panel .info p {
          font-weight: 600;
          margin: 0 0 6px 0;
          color: #ffffff;
          font-size: 14px;
          line-height: 1.2;
        }

        .status-indicator {
          font-size: 11px;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
        }

        :global(.text-success) {
          color: #18bc9c !important;
          font-size: 9px;
          margin-right: 4px;
        }

        /* 菜单搜索 Sidebar Form */
        .sidebar-form {
          border-radius: 3px;
          border: 1px solid transparent;
          margin: 10px 10px 10px 10px;
          overflow: hidden;
          background-color: #374850;
        }

        .sidebar-form .input-group {
          display: flex;
          width: 100%;
          height: 35px;
          align-items: center;
        }

        .sidebar-form input[type="text"] {
          background-color: #374850;
          border: none;
          height: 35px;
          padding: 6px 10px 6px 12px;
          font-size: 13px;
          color: #ffffff;
          width: 100%;
          flex: 1;
          outline: none;
          box-sizing: border-box;
        }

        .sidebar-form input::placeholder {
          color: #8aa4af;
          font-size: 13px;
        }

        .sidebar-form .btn {
          color: #8aa4af;
          background-color: #374850;
          border: none;
          height: 35px;
          padding: 0 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          outline: none;
        }

        .sidebar-form .btn:hover {
          color: #ffffff;
        }

        /* 菜单列表 Sidebar Menu */
        .sidebar-menu {
          list-style: none;
          margin: 0;
          padding: 0;
          white-space: nowrap;
        }

        .sidebar-menu > li {
          position: relative;
          margin: 0;
          padding: 0;
        }

        .sidebar-menu > li > a {
          padding: 12px 5px 12px 15px;
          display: block;
          border-left: 3px solid transparent;
          color: #b8c7ce;
          text-decoration: none;
          font-size: 14px;
          line-height: 20px;
          position: relative;
          transition: background-color 0.15s ease, color 0.15s ease;
          box-sizing: border-box;
        }

        .sidebar-menu > li:hover > a {
          color: #ffffff;
          background-color: #1e282c;
          border-left-color: #18bc9c;
        }

        .sidebar-menu > li.active > a {
          color: #ffffff;
          background-color: #1e282c;
          border-left-color: #18bc9c;
        }

        :global(.sidebar-menu .fa-fw) {
          width: 20px;
          text-align: center;
          margin-right: 6px;
          font-size: 14px;
          display: inline-block;
          vertical-align: middle;
        }

        .sidebar-menu > li.active > a > :global(.fa-fw) {
          color: #ffffff;
        }

        .sidebar-menu > li > a > span {
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
        }

        .pull-right-container {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .label {
          display: inline-block;
          padding: 2px 7px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.1;
          color: #ffffff;
          text-align: center;
          white-space: nowrap;
          border-radius: 3px;
        }

        .bg-orange {
          background-color: #ff851b !important;
        }

        .bg-red {
          background-color: #dd4b39 !important;
        }

        .bg-yellow {
          background-color: #f39c12 !important;
        }

        .bg-teal {
          background-color: #39cccc !important;
        }

        .rotate-arrow {
          transform: rotate(-90deg);
        }

        :global(.sidebar-menu .fa-angle-left) {
          font-size: 14px;
          color: #b8c7ce;
          transition: transform 0.2s ease-in-out;
          display: inline-block;
        }

        /* Treeview Submenu */
        .treeview-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          background-color: #2c3b41;
        }

        .treeview-menu > li {
          position: relative;
        }

        .treeview-menu > li > a {
          padding: 8px 5px 8px 25px;
          display: block;
          font-size: 13px;
          color: #8aa4af;
          text-decoration: none;
          line-height: 20px;
          border-left: 3px solid transparent;
          transition: color 0.15s ease;
        }

        .treeview-menu > li > a:hover,
        .treeview-menu > li.active > a {
          color: #ffffff;
        }

        .treeview-menu > li > a > :global(.fa) {
          width: 20px;
          margin-right: 6px;
          font-size: 13px;
          text-align: center;
          display: inline-block;
        }

        .treeview-menu.level-2 > li > a {
          padding-left: 38px;
          background-color: #263339;
        }
      `}</style>
    </aside>
  );
}
