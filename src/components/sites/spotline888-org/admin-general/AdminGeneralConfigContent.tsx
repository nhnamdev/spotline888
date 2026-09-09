"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { getR2Url } from "@/lib/r2";
import { Loader2, Check } from "lucide-react";

export default function AdminGeneralConfigContent() {
  const [activeTab, setActiveTab] = useState<
    "basic" | "recharge" | "cashout" | "stock" | "message" | "azure" | "other" | "addcfg"
  >("basic");

  const [savedAlert, setSavedAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states for all tabs
  const [basicForm, setBasicForm] = useState<Record<string, any>>({
    default_frontend_lang: "zh-CN",
    currency_code: "MYR",
    currency_short: "RM",
    currency_name: "Malaysian Ringgit",
    enabled_langs: "zh-CN",
    currency_icon: "",
    name: "Spotline",
    invite_code_enable: "0",
    web_icon: getR2Url("/uploads/20251209/fa32c0b93665cd9e8cb8c9d97f24beba.png"),
    need_bind_account: "1",
    chat_setting: "alert_notice",
    web_name: "Spotline",
    user_icon: getR2Url("/uploads/20251209/fa32c0b93665cd9e8cb8c9d97f24beba.png"),
    kefu_script: "https://wa.me/6287713795721",
    alert_notice: "",
    limit_script: "https://www.baidu.com/",
    version: "1.0.65",
    bet_max: "50000000",
    bet_min: "2000",
    company_desc: "",
    kefu_url: "https://wa.me/6287713795721",
    trade_time: "00:00-24:00",
    order_voice: "0",
    withdraw_voice: "0",
    quick_amounts_enable: "1",
    quick_amounts: "100,500,1000,2000,5000,10000",
  });

  const [rechargeForm, setRechargeForm] = useState<Record<string, any>>({
    min_chongzhi: "100",
    max_chongzhi: "1000000",
    web_bank_name: "Maybank Malaysia",
    web_bank_place: "Kuala Lumpur Branch",
    web_bank_user: "SPOTLINE OFFICIAL LTD",
    web_bank_number: "514271829102",
    web_bank_tips:
      "Dear valued users: The self-service balance top-up channel is currently undergoing system maintenance and upgrades. If you need to top up your account balance, please contact our online customer service. Thank you for your understanding and we apologize for any inconvenience this may cause.",
    bank_status: "1",
    usdt_status: "1",
    usdt_address: "TN7s...trc20address",
    usdt_cny_rate: "4.07",
  });

  const [cashoutForm, setCashoutForm] = useState<Record<string, any>>({
    save_bank_info: "1",
    cny_open: "1",
    usdt_open: "1",
    tx_min_tixian: "100",
    tx_max_tixian: "50000000000",
    tx_max_times: "50",
    cashout_start_time: "0",
    cashout_end_time: "24",
    tx_text_tixian: "",
    tx_text_chaoxian_cishu:
      "Dear valued members, due to daily withdrawal limits imposed by the national financial regulatory platform, please submit your withdrawal requests on the following day. If you have any questions, please contact our online customer service. Thank you!",
    tx_text_no_time:
      "Dear valued members, please submit your withdrawal requests during the designated withdrawal hours. The withdrawal hours on this platform are from 09:00 to 20:00. Thank you!",
    tx_rate_limit: "0",
    tx_fee_rate: "0",
  });

  const [stockForm, setStockForm] = useState<Record<string, any>>({
    trade_type: "usdt",
    api_stock_key: "",
    api_stock_code: "",
  });

  const [messageForm, setMessageForm] = useState<Record<string, any>>({
    register_message_enable: "1",
    register_message_content:
      "Welcome to SPOT! Thank you for choosing our platform. If you experience any problems, please feel free to contact us. Thank you!",
  });

  const [azureForm, setAzureForm] = useState<Record<string, any>>({
    azure_connection_string: "",
    azure_container_name: "configs",
    azure_backend_domain: "",
  });

  const [otherForm, setOtherForm] = useState<Record<string, any>>({
    vip_show: "1",
    vip: '{"1":"0","2":"1","3":"2","4":"3","5":"4","6":"5","7":"6","8":"7","9":"8"}',
    mpsswd_show: "1",
    play_type: "1",
    profit_time: "09:00-22:00",
    domain_countdown_endtime: "1762931980",
  });

  const [newConfigForm, setNewConfigForm] = useState({
    type: "string",
    group: "basic",
    name: "",
    title: "",
    value: "",
    rule: "",
    tip: "",
    extend: "",
  });

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getConfigs();
        if (res.code === 1 && res.data?.list) {
          const map: Record<string, string> = {};
          res.data.list.forEach((item: any) => {
            map[item.name] = item.value;
          });
          setBasicForm((prev) => ({ ...prev, ...map }));
          setRechargeForm((prev) => ({ ...prev, ...map }));
          setCashoutForm((prev) => ({ ...prev, ...map }));
          setOtherForm((prev) => ({ ...prev, ...map }));
        }
      } catch (err) {
        console.error("Lỗi lấy cấu hình:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let payload: Record<string, any> = {};
    if (activeTab === "recharge") payload = rechargeForm;
    else if (activeTab === "basic") payload = basicForm;
    else if (activeTab === "cashout") payload = cashoutForm;
    else if (activeTab === "stock") payload = stockForm;
    else if (activeTab === "message") payload = messageForm;
    else if (activeTab === "other") payload = otherForm;

    try {
      const res = await adminApi.updateConfigs(payload);
      if (res.code === 1) {
        setSavedAlert(true);
        setTimeout(() => setSavedAlert(false), 3000);
      }
    } catch (err) {
      console.error("Lỗi cập nhật cấu hình:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="general-config-page-wrapper">
      {/* Ribbon Header */}
      <div className="content-header-ribbon">
        <div className="breadcrumb-left">
          <i className="fa fa-dashboard"></i> Dashboard
        </div>
        <div className="breadcrumb-right">
          <span>系统设置</span>
          <span className="breadcrumb-sep">/</span>
          <span>网站配置</span>
        </div>
      </div>

      <div className="content-body">
        {/* Saved Alert Notification */}
        {savedAlert && (
          <div className="alert alert-success alert-dismissible">
            <button
              type="button"
              className="close"
              onClick={() => setSavedAlert(false)}
            >
              &times;
            </button>
            <i className="fa fa-check"></i> 保存成功！
          </div>
        )}

        <div className="panel panel-default panel-intro">
          <div className="panel-heading">
            <div className="panel-lead">
              <em>网站配置</em>Config tips
            </div>
            <ul className="nav nav-tabs">
              <li className={activeTab === "basic" ? "active" : ""}>
                <a
                  href="#basic"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("basic");
                  }}
                >
                  Basic
                </a>
              </li>
              <li className={activeTab === "recharge" ? "active" : ""}>
                <a
                  href="#recharge"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("recharge");
                  }}
                >
                  充值设置
                </a>
              </li>
              <li className={activeTab === "cashout" ? "active" : ""}>
                <a
                  href="#cashout"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("cashout");
                  }}
                >
                  提现设置
                </a>
              </li>
              <li className={activeTab === "stock" ? "active" : ""}>
                <a
                  href="#stock"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("stock");
                  }}
                >
                  行情配置
                </a>
              </li>
              <li className={activeTab === "message" ? "active" : ""}>
                <a
                  href="#message"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("message");
                  }}
                >
                  消息配置
                </a>
              </li>
              <li className={activeTab === "azure" ? "active" : ""}>
                <a
                  href="#azure"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("azure");
                  }}
                >
                  Azure存储配置
                </a>
              </li>
              <li className={activeTab === "other" ? "active" : ""}>
                <a
                  href="#other"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("other");
                  }}
                >
                  其他设置
                </a>
              </li>
              <li
                className={`addcfg-tab ${
                  activeTab === "addcfg" ? "active" : ""
                }`}
                title="Add new config"
              >
                <a
                  href="#addcfg"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("addcfg");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </a>
              </li>
            </ul>
          </div>

          <div className="panel-body">
            {/* 1. Basic Tab */}
            {activeTab === "basic" && (
              <form
                className="edit-form form-horizontal"
                onSubmit={handleFormSubmit}
              >
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Title</th>
                      <th style={{ width: "68%" }}>Value</th>
                      <th style={{ width: "17%" }}>Variable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* default_frontend_lang */}
                    <tr>
                      <td>前端默认语言</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <select
                              className="form-control"
                              value={basicForm.default_frontend_lang}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  default_frontend_lang: e.target.value,
                                })
                              }
                            >
                              <option value="zh-CN">简体中文</option>
                              <option value="en">English</option>
                              <option value="vi">Tiếng Việt</option>
                              <option value="th">ไทย</option>
                              <option value="id">Bahasa Indonesia</option>
                            </select>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>default_frontend_lang</code>
                      </td>
                    </tr>

                    {/* currency_code */}
                    <tr>
                      <td>货币代码</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.currency_code}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  currency_code: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>currency_code</code>
                      </td>
                    </tr>

                    {/* currency_short */}
                    <tr>
                      <td>货币简称</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.currency_short}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  currency_short: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>currency_short</code>
                      </td>
                    </tr>

                    {/* currency_name */}
                    <tr>
                      <td>货币名称</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.currency_name}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  currency_name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>currency_name</code>
                      </td>
                    </tr>

                    {/* Site name */}
                    <tr>
                      <td>Site name</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.name}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>name</code>
                      </td>
                    </tr>

                    {/* invite_code_enable */}
                    <tr>
                      <td>邀请码开关</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="invite_code_enable"
                                value="1"
                                checked={basicForm.invite_code_enable === "1"}
                                onChange={(e) =>
                                  setBasicForm({
                                    ...basicForm,
                                    invite_code_enable: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="invite_code_enable"
                                value="0"
                                checked={basicForm.invite_code_enable === "0"}
                                onChange={(e) =>
                                  setBasicForm({
                                    ...basicForm,
                                    invite_code_enable: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>invite_code_enable</code>
                      </td>
                    </tr>

                    {/* web_icon */}
                    <tr>
                      <td>网站图标</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                value={basicForm.web_icon}
                                onChange={(e) =>
                                  setBasicForm({
                                    ...basicForm,
                                    web_icon: e.target.value,
                                  })
                                }
                              />
                              <span className="input-group-btn">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                >
                                  <i className="fa fa-upload"></i> Upload
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>web_icon</code>
                      </td>
                    </tr>

                    {/* need_bind_account */}
                    <tr>
                      <td>绑定账号</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="need_bind_account"
                                value="1"
                                checked={basicForm.need_bind_account === "1"}
                                onChange={(e) =>
                                  setBasicForm({
                                    ...basicForm,
                                    need_bind_account: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="need_bind_account"
                                value="0"
                                checked={basicForm.need_bind_account === "0"}
                                onChange={(e) =>
                                  setBasicForm({
                                    ...basicForm,
                                    need_bind_account: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>need_bind_account</code>
                      </td>
                    </tr>

                    {/* web_name */}
                    <tr>
                      <td>网站名称</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.web_name}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  web_name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>web_name</code>
                      </td>
                    </tr>

                    {/* user_icon */}
                    <tr>
                      <td>默认头像</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                value={basicForm.user_icon}
                                onChange={(e) =>
                                  setBasicForm({
                                    ...basicForm,
                                    user_icon: e.target.value,
                                  })
                                }
                              />
                              <span className="input-group-btn">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                >
                                  <i className="fa fa-upload"></i> Upload
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>user_icon</code>
                      </td>
                    </tr>

                    {/* kefu_script */}
                    <tr>
                      <td>外置客服链接</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.kefu_script}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  kefu_script: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>kefu_script</code>
                      </td>
                    </tr>

                    {/* alert_notice */}
                    <tr>
                      <td>弹窗公告</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <textarea
                              className="form-control"
                              rows={3}
                              value={basicForm.alert_notice}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  alert_notice: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>alert_notice</code>
                      </td>
                    </tr>

                    {/* limit_script */}
                    <tr>
                      <td>黑名单跳转链接</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.limit_script}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  limit_script: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>limit_script</code>
                      </td>
                    </tr>

                    {/* version */}
                    <tr>
                      <td>Version</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.version}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  version: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>version</code>
                      </td>
                    </tr>

                    {/* bet_max */}
                    <tr>
                      <td>最大投注额</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="number"
                              className="form-control"
                              value={basicForm.bet_max}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  bet_max: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>bet_max</code>
                      </td>
                    </tr>

                    {/* bet_min */}
                    <tr>
                      <td>最小投注额</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="number"
                              className="form-control"
                              value={basicForm.bet_min}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  bet_min: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>bet_min</code>
                      </td>
                    </tr>

                    {/* company_desc */}
                    <tr>
                      <td>企业简介</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <textarea
                              className="form-control"
                              rows={6}
                              value={basicForm.company_desc}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  company_desc: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>company_desc</code>
                      </td>
                    </tr>

                    {/* kefu_url */}
                    <tr>
                      <td>客服地址</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.kefu_url}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  kefu_url: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>kefu_url</code>
                      </td>
                    </tr>

                    {/* trade_time */}
                    <tr>
                      <td>交易时间</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.trade_time}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  trade_time: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>trade_time</code>
                      </td>
                    </tr>

                    {/* quick_amounts */}
                    <tr>
                      <td>便捷金额列表</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={basicForm.quick_amounts}
                              onChange={(e) =>
                                setBasicForm({
                                  ...basicForm,
                                  quick_amounts: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>quick_amounts</code>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td>
                        <button
                          type="submit"
                          className="btn btn-success btn-embossed"
                        >
                          OK
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default btn-embossed"
                          onClick={() => {}}
                        >
                          Reset
                        </button>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            )}

            {/* 2. Recharge Tab */}
            {activeTab === "recharge" && (
              <form
                className="edit-form form-horizontal"
                onSubmit={handleFormSubmit}
              >
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Title</th>
                      <th style={{ width: "68%" }}>Value</th>
                      <th style={{ width: "17%" }}>Variable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>最低充值金额</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="number"
                              className="form-control"
                              value={rechargeForm.min_chongzhi}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  min_chongzhi: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>min_chongzhi</code>
                      </td>
                    </tr>
                    <tr>
                      <td>最高充值金额</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="number"
                              className="form-control"
                              value={rechargeForm.max_chongzhi}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  max_chongzhi: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>max_chongzhi</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开户银行</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={rechargeForm.web_bank_name}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  web_bank_name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>web_bank_name</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开户分行</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={rechargeForm.web_bank_place}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  web_bank_place: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>web_bank_place</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开户户主</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={rechargeForm.web_bank_user}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  web_bank_user: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>web_bank_user</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开户卡号</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={rechargeForm.web_bank_number}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  web_bank_number: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>web_bank_number</code>
                      </td>
                    </tr>
                    <tr>
                      <td>银行卡上分提示</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <textarea
                              className="form-control"
                              rows={3}
                              value={rechargeForm.web_bank_tips}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  web_bank_tips: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>web_bank_tips</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开启银行充值</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="bank_status"
                                value="1"
                                checked={rechargeForm.bank_status === "1"}
                                onChange={(e) =>
                                  setRechargeForm({
                                    ...rechargeForm,
                                    bank_status: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="bank_status"
                                value="0"
                                checked={rechargeForm.bank_status === "0"}
                                onChange={(e) =>
                                  setRechargeForm({
                                    ...rechargeForm,
                                    bank_status: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>bank_status</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开启USDT充值</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="usdt_status"
                                value="1"
                                checked={rechargeForm.usdt_status === "1"}
                                onChange={(e) =>
                                  setRechargeForm({
                                    ...rechargeForm,
                                    usdt_status: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="usdt_status"
                                value="0"
                                checked={rechargeForm.usdt_status === "0"}
                                onChange={(e) =>
                                  setRechargeForm({
                                    ...rechargeForm,
                                    usdt_status: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>usdt_status</code>
                      </td>
                    </tr>
                    <tr>
                      <td>USDT钱包地址</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <textarea
                              className="form-control"
                              rows={2}
                              value={rechargeForm.usdt_address}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  usdt_address: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>usdt_address</code>
                      </td>
                    </tr>
                    <tr>
                      <td>USDT汇率</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={rechargeForm.usdt_cny_rate}
                              onChange={(e) =>
                                setRechargeForm({
                                  ...rechargeForm,
                                  usdt_cny_rate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>usdt_cny_rate</code>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td>
                        <button
                          type="submit"
                          className="btn btn-success btn-embossed"
                        >
                          OK
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default btn-embossed"
                        >
                          Reset
                        </button>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            )}

            {/* 3. Cashout Tab */}
            {activeTab === "cashout" && (
              <form
                className="edit-form form-horizontal"
                onSubmit={handleFormSubmit}
              >
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Title</th>
                      <th style={{ width: "68%" }}>Value</th>
                      <th style={{ width: "17%" }}>Variable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>保存提现信息</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="save_bank_info"
                                value="1"
                                checked={cashoutForm.save_bank_info === "1"}
                                onChange={(e) =>
                                  setCashoutForm({
                                    ...cashoutForm,
                                    save_bank_info: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="save_bank_info"
                                value="0"
                                checked={cashoutForm.save_bank_info === "0"}
                                onChange={(e) =>
                                  setCashoutForm({
                                    ...cashoutForm,
                                    save_bank_info: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>save_bank_info</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开启银行卡提现</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="cny_open"
                                value="1"
                                checked={cashoutForm.cny_open === "1"}
                                onChange={(e) =>
                                  setCashoutForm({
                                    ...cashoutForm,
                                    cny_open: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="cny_open"
                                value="0"
                                checked={cashoutForm.cny_open === "0"}
                                onChange={(e) =>
                                  setCashoutForm({
                                    ...cashoutForm,
                                    cny_open: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>cny_open</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开启USDT提现</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="usdt_open"
                                value="1"
                                checked={cashoutForm.usdt_open === "1"}
                                onChange={(e) =>
                                  setCashoutForm({
                                    ...cashoutForm,
                                    usdt_open: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="usdt_open"
                                value="0"
                                checked={cashoutForm.usdt_open === "0"}
                                onChange={(e) =>
                                  setCashoutForm({
                                    ...cashoutForm,
                                    usdt_open: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>usdt_open</code>
                      </td>
                    </tr>
                    <tr>
                      <td>最低提现金额</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="number"
                              className="form-control"
                              value={cashoutForm.tx_min_tixian}
                              onChange={(e) =>
                                setCashoutForm({
                                  ...cashoutForm,
                                  tx_min_tixian: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>tx_min_tixian</code>
                      </td>
                    </tr>
                    <tr>
                      <td>最高提现金额</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={cashoutForm.tx_max_tixian}
                              onChange={(e) =>
                                setCashoutForm({
                                  ...cashoutForm,
                                  tx_max_tixian: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>tx_max_tixian</code>
                      </td>
                    </tr>
                    <tr>
                      <td>每日提款次数</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="number"
                              className="form-control"
                              value={cashoutForm.tx_max_times}
                              onChange={(e) =>
                                setCashoutForm({
                                  ...cashoutForm,
                                  tx_max_times: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>tx_max_times</code>
                      </td>
                    </tr>
                    <tr>
                      <td>提现次数超限提示</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <textarea
                              className="form-control"
                              rows={3}
                              value={cashoutForm.tx_text_chaoxian_cishu}
                              onChange={(e) =>
                                setCashoutForm({
                                  ...cashoutForm,
                                  tx_text_chaoxian_cishu: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>tx_text_chaoxian_cishu</code>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td>
                        <button
                          type="submit"
                          className="btn btn-success btn-embossed"
                        >
                          OK
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default btn-embossed"
                        >
                          Reset
                        </button>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            )}

            {/* 4. Stock Tab */}
            {activeTab === "stock" && (
              <form
                className="edit-form form-horizontal"
                onSubmit={handleFormSubmit}
              >
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Title</th>
                      <th style={{ width: "68%" }}>Value</th>
                      <th style={{ width: "17%" }}>Variable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>交易类型</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="trade_type"
                                value="qc"
                                checked={stockForm.trade_type === "qc"}
                                onChange={(e) =>
                                  setStockForm({
                                    ...stockForm,
                                    trade_type: e.target.value,
                                  })
                                }
                              />{" "}
                              法币
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="trade_type"
                                value="usdt"
                                checked={stockForm.trade_type === "usdt"}
                                onChange={(e) =>
                                  setStockForm({
                                    ...stockForm,
                                    trade_type: e.target.value,
                                  })
                                }
                              />{" "}
                              USDT
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>trade_type</code>
                      </td>
                    </tr>
                    <tr>
                      <td>接口KEY</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={stockForm.api_stock_key}
                              onChange={(e) =>
                                setStockForm({
                                  ...stockForm,
                                  api_stock_key: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>api_stock_key</code>
                      </td>
                    </tr>
                    <tr>
                      <td>接口CODE</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={stockForm.api_stock_code}
                              onChange={(e) =>
                                setStockForm({
                                  ...stockForm,
                                  api_stock_code: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>api_stock_code</code>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td>
                        <button
                          type="submit"
                          className="btn btn-success btn-embossed"
                        >
                          OK
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default btn-embossed"
                        >
                          Reset
                        </button>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            )}

            {/* 5. Message Tab */}
            {activeTab === "message" && (
              <form
                className="edit-form form-horizontal"
                onSubmit={handleFormSubmit}
              >
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Title</th>
                      <th style={{ width: "68%" }}>Value</th>
                      <th style={{ width: "17%" }}>Variable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Enable register message</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={messageForm.register_message_enable}
                              onChange={(e) =>
                                setMessageForm({
                                  ...messageForm,
                                  register_message_enable: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>register_message_enable</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Register message content</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <textarea
                              className="form-control"
                              rows={4}
                              value={messageForm.register_message_content}
                              onChange={(e) =>
                                setMessageForm({
                                  ...messageForm,
                                  register_message_content: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>register_message_content</code>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td>
                        <button
                          type="submit"
                          className="btn btn-success btn-embossed"
                        >
                          OK
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default btn-embossed"
                        >
                          Reset
                        </button>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            )}

            {/* 6. Azure Tab */}
            {activeTab === "azure" && (
              <form
                className="edit-form form-horizontal"
                onSubmit={handleFormSubmit}
              >
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Title</th>
                      <th style={{ width: "68%" }}>Value</th>
                      <th style={{ width: "17%" }}>Variable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Azure connection string</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <textarea
                              className="form-control"
                              rows={3}
                              value={azureForm.azure_connection_string}
                              onChange={(e) =>
                                setAzureForm({
                                  ...azureForm,
                                  azure_connection_string: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>azure_connection_string</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Azure container name</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={azureForm.azure_container_name}
                              onChange={(e) =>
                                setAzureForm({
                                  ...azureForm,
                                  azure_container_name: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>azure_container_name</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Azure backend domain</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={azureForm.azure_backend_domain}
                              onChange={(e) =>
                                setAzureForm({
                                  ...azureForm,
                                  azure_backend_domain: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>azure_backend_domain</code>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td>
                        <button
                          type="submit"
                          className="btn btn-success btn-embossed"
                        >
                          OK
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default btn-embossed"
                        >
                          Reset
                        </button>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            )}

            {/* 7. Other Tab */}
            {activeTab === "other" && (
              <form
                className="edit-form form-horizontal"
                onSubmit={handleFormSubmit}
              >
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Title</th>
                      <th style={{ width: "68%" }}>Value</th>
                      <th style={{ width: "17%" }}>Variable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>显示会员等级</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="vip_show"
                                value="1"
                                checked={otherForm.vip_show === "1"}
                                onChange={(e) =>
                                  setOtherForm({
                                    ...otherForm,
                                    vip_show: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="vip_show"
                                value="0"
                                checked={otherForm.vip_show === "0"}
                                onChange={(e) =>
                                  setOtherForm({
                                    ...otherForm,
                                    vip_show: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>vip_show</code>
                      </td>
                    </tr>
                    <tr>
                      <td>会员等级</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <textarea
                              className="form-control"
                              rows={2}
                              value={otherForm.vip}
                              onChange={(e) =>
                                setOtherForm({
                                  ...otherForm,
                                  vip: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>vip</code>
                      </td>
                    </tr>
                    <tr>
                      <td>开启提现密码</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="mpsswd_show"
                                value="1"
                                checked={otherForm.mpsswd_show === "1"}
                                onChange={(e) =>
                                  setOtherForm({
                                    ...otherForm,
                                    mpsswd_show: e.target.value,
                                  })
                                }
                              />{" "}
                              开启
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="mpsswd_show"
                                value="0"
                                checked={otherForm.mpsswd_show === "0"}
                                onChange={(e) =>
                                  setOtherForm({
                                    ...otherForm,
                                    mpsswd_show: e.target.value,
                                  })
                                }
                              />{" "}
                              关闭
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>mpsswd_show</code>
                      </td>
                    </tr>
                    <tr>
                      <td>玩法模式</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="play_type"
                                value="0"
                                checked={otherForm.play_type === "0"}
                                onChange={(e) =>
                                  setOtherForm({
                                    ...otherForm,
                                    play_type: e.target.value,
                                  })
                                }
                              />{" "}
                              默认
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="play_type"
                                value="1"
                                checked={otherForm.play_type === "1"}
                                onChange={(e) =>
                                  setOtherForm({
                                    ...otherForm,
                                    play_type: e.target.value,
                                  })
                                }
                              />{" "}
                              通赢
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="play_type"
                                value="2"
                                checked={otherForm.play_type === "2"}
                                onChange={(e) =>
                                  setOtherForm({
                                    ...otherForm,
                                    play_type: e.target.value,
                                  })
                                }
                              />{" "}
                              通亏
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>play_type</code>
                      </td>
                    </tr>
                    <tr>
                      <td>全员盈利时间</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="text"
                              className="form-control"
                              value={otherForm.profit_time}
                              onChange={(e) =>
                                setOtherForm({
                                  ...otherForm,
                                  profit_time: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>profit_time</code>
                      </td>
                    </tr>
                    <tr>
                      <td>域名倒计时结束时间</td>
                      <td>
                        <div className="row">
                          <div className="col-sm-8 col-xs-12">
                            <input
                              type="number"
                              className="form-control"
                              value={otherForm.domain_countdown_endtime}
                              onChange={(e) =>
                                setOtherForm({
                                  ...otherForm,
                                  domain_countdown_endtime: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <code>domain_countdown_endtime</code>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td>
                        <button
                          type="submit"
                          className="btn btn-success btn-embossed"
                        >
                          OK
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default btn-embossed"
                        >
                          Reset
                        </button>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </form>
            )}

            {/* 8. Add Config Tab */}
            {activeTab === "addcfg" && (
              <form
                className="form-horizontal addcfg-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("添加成功！");
                  setActiveTab("basic");
                }}
              >
                <div className="form-group">
                  <label className="control-label col-xs-12 col-sm-2">Type</label>
                  <div className="col-xs-12 col-sm-6">
                    <select
                      className="form-control"
                      value={newConfigForm.type}
                      onChange={(e) =>
                        setNewConfigForm({ ...newConfigForm, type: e.target.value })
                      }
                    >
                      <option value="string">String</option>
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="datetime">Datetime</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                      <option value="image">Image</option>
                      <option value="images">Images</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-xs-12 col-sm-2">Group</label>
                  <div className="col-xs-12 col-sm-6">
                    <select
                      className="form-control"
                      value={newConfigForm.group}
                      onChange={(e) =>
                        setNewConfigForm({ ...newConfigForm, group: e.target.value })
                      }
                    >
                      <option value="basic">Basic</option>
                      <option value="recharge">充值设置</option>
                      <option value="cashout">提现设置</option>
                      <option value="stock">行情配置</option>
                      <option value="message">消息配置</option>
                      <option value="azure">Azure存储配置</option>
                      <option value="other">其他设置</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-xs-12 col-sm-2">Name</label>
                  <div className="col-xs-12 col-sm-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="变量名 (英文数字下划线)"
                      value={newConfigForm.name}
                      onChange={(e) =>
                        setNewConfigForm({ ...newConfigForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-xs-12 col-sm-2">Title</label>
                  <div className="col-xs-12 col-sm-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="变量标题"
                      value={newConfigForm.title}
                      onChange={(e) =>
                        setNewConfigForm({ ...newConfigForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-xs-12 col-sm-2">Value</label>
                  <div className="col-xs-12 col-sm-6">
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="变量值"
                      value={newConfigForm.value}
                      onChange={(e) =>
                        setNewConfigForm({ ...newConfigForm, value: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-xs-12 col-sm-2">Tip</label>
                  <div className="col-xs-12 col-sm-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="提示信息"
                      value={newConfigForm.tip}
                      onChange={(e) =>
                        setNewConfigForm({ ...newConfigForm, tip: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-xs-12 col-sm-6 col-sm-offset-2">
                    <button type="submit" className="btn btn-success btn-embossed">
                      OK
                    </button>
                    <button
                      type="reset"
                      className="btn btn-default btn-embossed"
                      onClick={() =>
                        setNewConfigForm({
                          type: "string",
                          group: "basic",
                          name: "",
                          title: "",
                          value: "",
                          rule: "",
                          tip: "",
                          extend: "",
                        })
                      }
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .general-config-page-wrapper {
          min-height: calc(100vh - 50px);
          background-color: #f1f4f6;
          font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei",
            "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
          color: #333333;
        }

        /* Ribbon Header */
        .content-header-ribbon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
          padding: 8px 15px;
          border-bottom: 1px solid #e7eaec;
          font-size: 12px;
        }

        .breadcrumb-left {
          color: #777777;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .breadcrumb-left :global(.fa-dashboard) {
          font-size: 13px;
        }

        .breadcrumb-right {
          color: #777777;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .breadcrumb-sep {
          color: #cccccc;
        }

        .content-body {
          padding: 15px;
        }

        .alert-success {
          background-color: #dff0d8;
          border-color: #d6e9c6;
          color: #3c763d;
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 15px;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .alert-success .close {
          border: none;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
          color: #3c763d;
        }

        .panel-default {
          background-color: #ffffff;
          border: 1px solid #e7eaec;
          border-radius: 4px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .panel-heading {
          padding: 12px 15px 0 15px;
          border-bottom: 1px solid #e7eaec;
          background-color: #ffffff;
        }

        .panel-lead {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #333;
        }

        .panel-lead em {
          font-style: normal;
          color: #18bc9c;
          margin-right: 8px;
        }

        .nav-tabs {
          display: flex;
          flex-wrap: wrap;
          padding-left: 0;
          margin-bottom: -1px;
          list-style: none;
          border-bottom: 1px solid #ddd;
        }

        .nav-tabs > li {
          float: left;
          margin-bottom: -1px;
        }

        .nav-tabs > li > a {
          margin-right: 2px;
          line-height: 1.42857143;
          border: 1px solid transparent;
          border-radius: 4px 4px 0 0;
          color: #555555;
          padding: 10px 15px;
          display: block;
          text-decoration: none;
          font-size: 13px;
        }

        .nav-tabs > li > a:hover {
          border-color: #eeeeee #eeeeee #ddd;
          background-color: #eeeeee;
        }

        .nav-tabs > li.active > a,
        .nav-tabs > li.active > a:focus,
        .nav-tabs > li.active > a:hover {
          color: #555555;
          cursor: default;
          background-color: #ffffff;
          border: 1px solid #ddd;
          border-bottom-color: transparent;
          font-weight: bold;
        }

        .addcfg-tab > a {
          padding: 10px 12px !important;
          color: #18bc9c !important;
        }

        .panel-body {
          padding: 20px 15px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .table {
          width: 100%;
          max-width: 100%;
          min-width: 650px;
          margin-bottom: 20px;
          border-collapse: collapse;
          font-size: 12px;
        }

        .table > thead > tr > th {
          vertical-align: bottom;
          border-bottom: 2px solid #ddd;
          padding: 8px;
          text-align: left;
          font-weight: 600;
          color: #333333;
        }

        .table > tbody > tr > td,
        .table > tfoot > tr > td {
          padding: 8px;
          line-height: 1.42857143;
          vertical-align: middle;
          border-top: 1px solid #f4f4f4;
          color: #555555;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: #f9f9f9;
        }

        .table code {
          padding: 2px 4px;
          font-size: 90%;
          color: #c7254e;
          background-color: #f9f2f4;
          border-radius: 4px;
          font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        }

        .form-control {
          display: block;
          width: 100%;
          height: 31px;
          padding: 4px 8px;
          font-size: 12px;
          line-height: 1.42857143;
          color: #555555;
          background-color: #ffffff;
          background-image: none;
          border: 1px solid #d2d6de;
          border-radius: 3px;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          box-sizing: border-box;
          outline: none;
        }

        textarea.form-control {
          height: auto;
        }

        .form-control:focus {
          border-color: #18bc9c;
        }

        .radio-inline {
          position: relative;
          display: inline-block;
          padding-left: 20px;
          margin-bottom: 0;
          font-weight: 400;
          vertical-align: middle;
          cursor: pointer;
          font-size: 12px;
          margin-right: 15px;
        }

        .radio-inline input[type="radio"] {
          position: absolute;
          margin-top: 2px;
          margin-left: -20px;
        }

        .input-group {
          position: relative;
          display: table;
          border-collapse: separate;
          width: 100%;
        }

        .input-group .form-control {
          position: relative;
          z-index: 2;
          float: left;
          width: 100%;
          margin-bottom: 0;
          display: table-cell;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .input-group-btn {
          position: relative;
          font-size: 0;
          white-space: nowrap;
          width: 1%;
          vertical-align: middle;
          display: table-cell;
        }

        .input-group-btn > .btn {
          position: relative;
          margin-left: -1px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .btn {
          display: inline-block;
          padding: 6px 12px;
          margin-bottom: 0;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.42857143;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 3px;
          box-sizing: border-box;
        }

        .btn-embossed {
          box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.15);
          margin-right: 8px;
        }

        .btn-success {
          color: #ffffff;
          background-color: #18bc9c;
          border-color: #18bc9c;
        }

        .btn-success:hover {
          background-color: #15a589;
          border-color: #15a589;
        }

        .btn-danger {
          color: #ffffff;
          background-color: #e74c3c;
          border-color: #e74c3c;
        }

        .btn-danger:hover {
          background-color: #d62c1a;
          border-color: #cd2a19;
        }

        .btn-default {
          color: #333333;
          background-color: #ffffff;
          border-color: #cccccc;
        }

        .btn-default:hover {
          background-color: #e6e6e6;
          border-color: #adadad;
        }

        .row {
          margin-right: -15px;
          margin-left: -15px;
        }

        .col-sm-8 {
          position: relative;
          min-height: 1px;
          padding-right: 15px;
          padding-left: 15px;
          width: 100%;
          max-width: 550px;
        }

        .col-sm-2 {
          width: 16.66666667%;
          float: left;
        }

        .col-sm-6 {
          width: 50%;
          float: left;
        }

        .col-sm-offset-2 {
          margin-left: 16.66666667%;
        }

        .addcfg-form .form-group {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .addcfg-form label.control-label {
          padding-top: 7px;
          margin-bottom: 0;
          text-align: right;
          font-weight: 700;
          font-size: 12px;
          padding-right: 15px;
        }

        @media (max-width: 768px) {
          .col-sm-2,
          .col-sm-6,
          .col-sm-offset-2 {
            width: 100%;
            float: none;
            margin-left: 0;
          }

          .addcfg-form .form-group {
            flex-direction: column;
            align-items: flex-start;
          }

          .addcfg-form label.control-label {
            text-align: left;
            padding-right: 0;
            margin-bottom: 5px;
          }
        }
      `}</style>
    </div>
  );
}
