const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { pool } = require('../config/db');
const { hashPassword } = require('../utils/hash');

// 30 Hồ sơ xác minh KYC và User gốc
const verifyItemsData = [
  {
    id: 197,
    username: "LeeChiewHo",
    real_name: "Lee Chiew Ho",
    id_card: "123312",
    profession: "231123",
    id_img_1: "/uploads/20260908/178883474941402.jpeg",
    id_img_2: "/uploads/20260908/178883475343904.jpeg",
    gj: "id_card",
    is_auth: 1,
    id_auth_error: "",
    verify_time: "2026-09-08 10:32:15",
    reg_time: "2026-09-08 10:32:15",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 196,
    username: "WongLeeChu",
    real_name: "Wong Lee Chu",
    id_card: "12332",
    profession: "123213",
    id_img_1: "/uploads/20260906/178866474690400.jpeg",
    id_img_2: "/uploads/20260906/178866475125034.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-06 11:18:41",
    reg_time: "2026-09-06 11:18:41",
    money: "479256.73",
    credit_score: 100
  },
  {
    id: 195,
    username: "simyeekun",
    real_name: "sim yee kun",
    id_card: "222",
    profession: "零",
    id_img_1: "/uploads/20260905/178859726913744.jpg",
    id_img_2: "/uploads/20260905/178859727373288.jpg",
    gj: "passport",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-05 16:33:22",
    reg_time: "2026-09-05 16:33:22",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 194,
    username: "CHOOILAIMEI",
    real_name: "CHOOI LAI MEI",
    id_card: "222",
    profession: "退休",
    id_img_1: "/uploads/20260904/178852597972201.jpg",
    id_img_2: "/uploads/20260904/178852598324057.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-04 20:45:57",
    reg_time: "2026-09-04 20:45:57",
    money: "165300.00",
    credit_score: 90
  },
  {
    id: 193,
    username: "PONGCHOONYONG",
    real_name: "PONG CHOON YONG",
    id_card: "222",
    profession: "退休",
    id_img_1: "/uploads/20260904/178852229536748.jpg",
    id_img_2: "/uploads/20260904/178852229841230.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-04 19:44:08",
    reg_time: "2026-09-04 19:44:08",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 192,
    username: "KHORHANKIONG",
    real_name: "KHOR HAN KIONG",
    id_card: "3112323",
    profession: "123123",
    id_img_1: "/uploads/20260904/178849603722650.jpeg",
    id_img_2: "/uploads/20260904/178849604343310.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-04 12:26:05",
    reg_time: "2026-09-04 12:26:05",
    money: "72566.73",
    credit_score: 90
  },
  {
    id: 191,
    username: "LimVuiShing",
    real_name: "Lim Vui Shing",
    id_card: "222",
    profession: "退休",
    id_img_1: "/uploads/20260903/178842104213641.jpg",
    id_img_2: "/uploads/20260903/178842104671445.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-03 15:37:04",
    reg_time: "2026-09-03 15:37:04",
    money: "120369.00",
    credit_score: 100
  },
  {
    id: 190,
    username: "LimChengYong",
    real_name: "Lim Cheng Yong",
    id_card: "222",
    profession: "安装闭路电视",
    id_img_1: "/uploads/20260903/178841911553631.jpg",
    id_img_2: "/uploads/20260903/178841911913239.jpg",
    gj: "passport",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-03 15:04:23",
    reg_time: "2026-09-03 15:04:23",
    money: "44010.28",
    credit_score: 90
  },
  {
    id: 189,
    username: "wongchawfung",
    real_name: "wong chaw fung",
    id_card: "123321",
    profession: "123312",
    id_img_1: "/uploads/20260902/178834692073749.jpeg",
    id_img_2: "/uploads/20260902/178834692445795.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-02 19:01:46",
    reg_time: "2026-09-02 19:01:46",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 188,
    username: "JACQUELINEONGMEIYIAN",
    real_name: "JACQUELINE ONG MEI YIAN",
    id_card: "123132",
    profession: "213132",
    id_img_1: "/uploads/20260902/178833163331773.jpeg",
    id_img_2: "/uploads/20260902/178833163786731.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-02 14:46:59",
    reg_time: "2026-09-02 14:46:59",
    money: "316283.73",
    credit_score: 100
  },
  {
    id: 187,
    username: "EOSIEWHONG",
    real_name: "EO SIEW HONG",
    id_card: "123132",
    profession: "123132",
    id_img_1: "/uploads/20260902/178833018743983.jpeg",
    id_img_2: "/uploads/20260902/178833019183204.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-02 14:22:49",
    reg_time: "2026-09-02 14:22:49",
    money: "16539.89",
    credit_score: 100
  },
  {
    id: 186,
    username: "SIMONLEECHEESEONG",
    real_name: "SIMON LEE CHEE SEONG",
    id_card: "222",
    profession: "销售员",
    id_img_1: "/uploads/20260901/178827089573672.jpg",
    id_img_2: "/uploads/20260901/178827089881667.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-01 21:53:57",
    reg_time: "2026-09-01 21:53:57",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 185,
    username: "GOHPETLEONG",
    real_name: "GOH PET LEONG",
    id_card: "123321",
    profession: "21132",
    id_img_1: "/uploads/20260901/178823102153411.jpeg",
    id_img_2: "/uploads/20260901/178823102690591.jpeg",
    gj: "passport",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-09-01 10:49:55",
    reg_time: "2026-09-01 10:49:55",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 184,
    username: "TaiGeokTin",
    real_name: "Tai Geok Tin",
    id_card: "222",
    profession: "藥房助理",
    id_img_1: "/uploads/20260831/178815013936836.jpg",
    id_img_2: "/uploads/20260831/178815014435102.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-31 12:21:53",
    reg_time: "2026-08-31 12:21:53",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 183,
    username: "LauSekNai",
    real_name: "Lau Sek Nai",
    id_card: "690112-07-5076",
    profession: "家庭保姆",
    id_img_1: "/uploads/20260830/178808562099957.jpg",
    id_img_2: "/uploads/20260830/178808562384131.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-30 18:23:38",
    reg_time: "2026-08-30 18:23:38",
    money: "210881.00",
    credit_score: 90
  },
  {
    id: 182,
    username: "LeeAuWang",
    real_name: "Lee Au Wang",
    id_card: "213123",
    profession: "213132",
    id_img_1: "/uploads/20260830/178806509350606.jpeg",
    id_img_2: "/uploads/20260830/178806509762237.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-30 12:44:34",
    reg_time: "2026-08-30 12:44:34",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 181,
    username: "KongOoikim",
    real_name: "Kong Ooi kim",
    id_card: "222",
    profession: "家庭主妇",
    id_img_1: "/uploads/20260828/178791514648266.jpg",
    id_img_2: "/uploads/20260828/178791515074065.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-28 19:04:42",
    reg_time: "2026-08-28 19:04:42",
    money: "16873.50",
    credit_score: 90
  },
  {
    id: 180,
    username: "LeongSauKeun",
    real_name: "Leong Sau Keun",
    id_card: "231321",
    profession: "213213",
    id_img_1: "/uploads/20260826/178775129315644.jpeg",
    id_img_2: "/uploads/20260826/178775129728122.jpeg",
    gj: "passport",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-26 21:34:37",
    reg_time: "2026-08-26 21:34:37",
    money: "12129.48",
    credit_score: 90
  },
  {
    id: 179,
    username: "TeohSiewCheng",
    real_name: "Teoh Siew Cheng",
    id_card: "222",
    profession: "坊子工人",
    id_img_1: "/uploads/20260826/178775043129259.jpg",
    id_img_2: "/uploads/20260826/178775043533382.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-26 21:19:50",
    reg_time: "2026-08-26 21:19:50",
    money: "76170.00",
    credit_score: 100
  },
  {
    id: 178,
    username: "PUBLICBANK",
    real_name: "PUBLIC BANK",
    id_card: "222",
    profession: "工厂",
    id_img_1: "/uploads/20260826/178774936752044.jpg",
    id_img_2: "/uploads/20260826/178774937227810.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-26 21:01:25",
    reg_time: "2026-08-26 21:01:25",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 177,
    username: "yapkhoonloong",
    real_name: "yap khoon loong",
    id_card: "222",
    profession: "退休",
    id_img_1: "/uploads/20260824/178757316293524.jpg",
    id_img_2: "/uploads/20260824/178757316785565.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-24 20:05:41",
    reg_time: "2026-08-24 20:05:41",
    money: "15170.00",
    credit_score: 100
  },
  {
    id: 176,
    username: "YAPLINWAN",
    real_name: "YAP LIN WAN",
    id_card: "132132",
    profession: "213132",
    id_img_1: "/uploads/20260824/178756931618784.jpeg",
    id_img_2: "/uploads/20260824/178756932037881.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-24 19:01:43",
    reg_time: "2026-08-24 19:01:43",
    money: "16283.24",
    credit_score: 100
  },
  {
    id: 175,
    username: "KONGHOUNG",
    real_name: "KONG HOUNG",
    id_card: "2222",
    profession: "家庭主妇",
    id_img_1: "/uploads/20260824/178756105160871.jpg",
    id_img_2: "/uploads/20260824/178756105552642.jpg",
    gj: "passport",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-24 16:43:26",
    reg_time: "2026-08-24 16:43:26",
    money: "45401.28",
    credit_score: 90
  },
  {
    id: 174,
    username: "Ongyongchang",
    real_name: "Ong yong chang",
    id_card: "12312332",
    profession: "213132",
    id_img_1: "/uploads/20260824/178755070322930.jpeg",
    id_img_2: "/uploads/20260824/178755070814852.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-24 13:51:27",
    reg_time: "2026-08-24 13:51:27",
    money: "26283.24",
    credit_score: 100
  },
  {
    id: 173,
    username: "ONGPEIJIUN",
    real_name: "ONG PEIJIUN",
    id_card: "222",
    profession: "家庭主妇",
    id_img_1: "/uploads/20260822/178740560230719.jpg",
    id_img_2: "/uploads/20260822/178740560737159.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-22 21:32:56",
    reg_time: "2026-08-22 21:32:56",
    money: "198611.00",
    credit_score: 100
  },
  {
    id: 172,
    username: "KuokHockWoong",
    real_name: "Kuok Hock Woong",
    id_card: "222",
    profession: "退休",
    id_img_1: "/uploads/20260822/178739981273693.jpg",
    id_img_2: "/uploads/20260822/178739981542727.jpg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-22 19:56:33",
    reg_time: "2026-08-22 19:56:33",
    money: "37670.00",
    credit_score: 100
  },
  {
    id: 171,
    username: "LEEKOKLAN",
    real_name: "LEE KOK LAN",
    id_card: "21321",
    profession: "123132",
    id_img_1: "/uploads/20260822/178738696348020.jpeg",
    id_img_2: "/uploads/20260822/178738696742005.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-22 16:22:19",
    reg_time: "2026-08-22 16:22:19",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 170,
    username: "TAYSHIHMINGFEN",
    real_name: "TAY SHIH MING FEN",
    id_card: "213321",
    profession: "213132",
    id_img_1: "/uploads/20260821/178728951622573.jpeg",
    id_img_2: "/uploads/20260821/178728952092598.jpeg",
    gj: "passport",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-21 13:18:22",
    reg_time: "2026-08-21 13:18:22",
    money: "0.00",
    credit_score: 80
  },
  {
    id: 169,
    username: "TeeChoonBeng",
    real_name: "Tee Choon Beng",
    id_card: "12312",
    profession: "12213",
    id_img_1: "/uploads/20260821/178728077629441.jpeg",
    id_img_2: "/uploads/20260821/178728078053094.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-21 10:52:41",
    reg_time: "2026-08-21 10:52:41",
    money: "0.00",
    credit_score: 100
  },
  {
    id: 168,
    username: "HANLIEGUAN",
    real_name: "HAN LIE GUAN",
    id_card: "123312",
    profession: "23123",
    id_img_1: "/uploads/20260820/178723090796722.jpeg",
    id_img_2: "/uploads/20260820/178723093456498.jpeg",
    gj: "id_card",
    is_auth: 2,
    id_auth_error: "",
    verify_time: "2026-08-20 21:00:00",
    reg_time: "2026-08-20 21:00:00",
    money: "0.00",
    credit_score: 100
  }
];

// Danh sách các lệnh quyền chọn nhị phân gốc
const initialOrdersData = [
  {
    id: 277,
    userId: 87,
    userAccount: "TheLoonChing",
    realName: "The Loon Ching",
    productTitle: "BTC/USDT",
    oStyle: "buy_down",
    buyMoney: 225890.00,
    balanceBuyAfter: 0.00,
    buyPrice: 66343.07,
    sellPrice: 0,
    buyTime: "2026-07-17 01:08:25",
    sellTime: "2026-07-17 01:28:25",
    type: "1200/7.43",
    ploss: 0.00,
    kongType: "default",
    status: "holding"
  },
  {
    id: 276,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "BTC/USDT",
    oStyle: "buy_up",
    buyMoney: 10000.00,
    balanceBuyAfter: 1302877.51,
    buyPrice: 66219.54027102,
    sellPrice: 0,
    buyTime: "2026-03-02 20:06:29",
    sellTime: "2026-03-02 20:09:29",
    type: "180/3",
    ploss: 0.00,
    kongType: "win",
    status: "holding"
  },
  {
    id: 275,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "BTC/USDT",
    oStyle: "buy_down",
    buyMoney: 10000.00,
    balanceBuyAfter: 1289338.51,
    buyPrice: 66288.08888781,
    sellPrice: 66288.09,
    buyTime: "2026-03-02 20:03:54",
    sellTime: "2026-03-02 20:06:54",
    type: "180/3.1",
    ploss: 10310.00,
    kongType: "closed",
    status: "settled"
  },
  {
    id: 274,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "DOGE/USDT",
    oStyle: "buy_up",
    buyMoney: 10000.00,
    balanceBuyAfter: 1299338.51,
    buyPrice: 0.091883,
    sellPrice: 0.091911,
    buyTime: "2026-03-02 20:03:21",
    sellTime: "2026-03-02 20:04:21",
    type: "60/19.42",
    ploss: 11942.00,
    kongType: "closed",
    status: "settled"
  },
  {
    id: 273,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    buyMoney: 10000.00,
    balanceBuyAfter: 1309338.51,
    buyPrice: 0.09187,
    sellPrice: 0.09137,
    buyTime: "2026-03-02 20:03:17",
    sellTime: "2026-03-02 20:04:17",
    type: "60/15.97",
    ploss: 11597.00,
    kongType: "closed",
    status: "settled"
  },
  {
    id: 272,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "DOGE/USDT",
    oStyle: "buy_up",
    buyMoney: 10000.00,
    balanceBuyAfter: 1295960.51,
    buyPrice: 0.09178711,
    sellPrice: 0.09179,
    buyTime: "2026-03-02 20:02:09",
    sellTime: "2026-03-02 20:03:09",
    type: "60/14.72",
    ploss: 11472.00,
    kongType: "closed",
    status: "settled"
  },
  {
    id: 271,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    buyMoney: 10000.00,
    balanceBuyAfter: 1305960.51,
    buyPrice: 0.091801,
    sellPrice: 0.091774,
    buyTime: "2026-03-02 20:02:06",
    sellTime: "2026-03-02 20:03:06",
    type: "60/19.06",
    ploss: 11906.00,
    kongType: "closed",
    status: "settled"
  },
  {
    id: 270,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    buyMoney: 10000.00,
    balanceBuyAfter: 1271052.51,
    buyPrice: 0.09177615,
    sellPrice: 0.091801,
    buyTime: "2026-03-02 20:01:02",
    sellTime: "2026-03-02 20:02:02",
    type: "60/14.57",
    ploss: 11457.00,
    kongType: "closed",
    status: "settled"
  },
  {
    id: 269,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    buyMoney: 10000.00,
    balanceBuyAfter: 1281052.51,
    buyPrice: 0.09180344,
    sellPrice: 0.091801,
    buyTime: "2026-03-02 20:00:50",
    sellTime: "2026-03-02 20:01:50",
    type: "60/11",
    ploss: 11100.00,
    kongType: "closed",
    status: "settled"
  },
  {
    id: 268,
    userId: 4,
    userAccount: "124123124124",
    realName: "124",
    productTitle: "DOGE/USDT",
    oStyle: "buy_down",
    buyMoney: 10000.00,
    balanceBuyAfter: 1291052.51,
    buyPrice: 0.09178,
    sellPrice: 0.0918,
    buyTime: "2026-03-02 20:00:09",
    sellTime: "2026-03-02 20:01:09",
    type: "60/12",
    ploss: 11200.00,
    kongType: "closed",
    status: "settled"
  }
];

// 4 Lệnh Quỹ Yu'e Bao gốc
const yuebaoOrdersData = [
  {
    id: 4,
    user_id: 12,
    username: "ak111",
    amount: 23.00,
    type: 1,
    status: 2,
    created_at: "2026-09-05 08:28:00"
  },
  {
    id: 3,
    user_id: 196,
    username: "WongLeeChu",
    amount: 5000.00,
    type: 1,
    status: 2,
    created_at: "2026-09-04 14:15:30"
  },
  {
    id: 2,
    user_id: 194,
    username: "CHOOILAIMEI",
    amount: 12000.00,
    type: 1,
    status: 2,
    created_at: "2026-09-03 11:20:15"
  },
  {
    id: 1,
    user_id: 192,
    username: "KHORHANKIONG",
    amount: 800.00,
    type: 1,
    status: 2,
    created_at: "2026-09-01 09:10:00"
  }
];

async function seedData() {
  const connection = await pool.getConnection();
  try {
    console.log('🚀 Đang bắt đầu đồng bộ toàn bộ dữ liệu hardcode vào CSDL MySQL (fortrade_db)...');

    // 1. Seed Banners vào fa_category
    console.log('📸 1. Đang seed Banners trang chủ...');
    const banners = [
      { name: 'Banner 1', image: '/sites/spotline888-org/pages-index-index/banner_0.jpg', weigh: 6 },
      { name: 'Banner 2', image: '/sites/spotline888-org/pages-index-index/banner_1.jpg', weigh: 5 },
      { name: 'Banner 3', image: '/sites/spotline888-org/pages-index-index/banner_2.jpg', weigh: 4 },
      { name: 'Banner 4', image: '/sites/spotline888-org/pages-index-index/banner_3.jpg', weigh: 3 },
      { name: 'Banner 5', image: '/sites/spotline888-org/pages-index-index/banner_4.jpg', weigh: 2 },
      { name: 'Banner 6', image: '/sites/spotline888-org/pages-index-index/banner_5.jpg', weigh: 1 },
    ];

    for (const b of banners) {
      const [ex] = await connection.query("SELECT id FROM fa_category WHERE type = 'banner' AND name = ?", [b.name]);
      if (ex.length === 0) {
        await connection.query(
          `INSERT INTO fa_category (type, name, image, weigh, status, created_at)
           VALUES ('banner', ?, ?, ?, 'normal', NOW())`,
          [b.name, b.image, b.weigh]
        );
      }
    }
    console.log(`   -> Đã kiểm tra và đồng bộ Banners.`);

    // 2. Seed Danh sách sản phẩm Crypto vào fa_product
    console.log('📈 2. Đang seed danh sách sản phẩm giao dịch (Crypto & Forex)...');
    const products = [
      { code: 'BTC/USDT', title: 'Bitcoin', price: 66343.07, change: '-0.76%', image: '/sites/spotline888-org/pages-index-index/coin_btc.png', weigh: 100 },
      { code: 'TRX/USDT', title: 'TRON', price: 0.2815, change: '-0.02%', image: '/sites/spotline888-org/pages-index-index/coin_trx.png', weigh: 95 },
      { code: 'DOT/USDT', title: 'Polkadot', price: 1.5163, change: '-2.26%', image: '/sites/spotline888-org/pages-index-index/coin_dot.png', weigh: 90 },
      { code: 'LINK/USDT', title: 'Chainlink', price: 8.7000, change: '-2.44%', image: '/sites/spotline888-org/pages-index-index/coin_link.png', weigh: 85 },
      { code: 'BCH/USDT', title: 'Bitcoin Cash', price: 438.43, change: '-2.06%', image: '/sites/spotline888-org/pages-index-index/coin_bch.png', weigh: 80 },
      { code: 'ETC/USDT', title: 'Ethereum Classic', price: 8.5479, change: '-1.00%', image: '/sites/spotline888-org/pages-index-index/coin_etc.png', weigh: 75 },
      { code: 'DOGE/USDT', title: 'Dogecoin', price: 0.0919, change: '-2.03%', image: '/sites/spotline888-org/pages-index-index/coin_doge.png', weigh: 70 },
      { code: 'ETH/USDT', title: 'Ethereum', price: 1947.37, change: '-2.31%', image: '/sites/spotline888-org/pages-index-index/coin_eth.png', weigh: 65 },
      { code: 'ADA/USDT', title: 'Cardano', price: 0.2720, change: '-2.96%', image: '/sites/spotline888-org/pages-index-index/coin_ada.png', weigh: 60 },
      { code: 'FIL/USDT', title: 'Filecoin', price: 0.9750, change: '-0.29%', image: '/sites/spotline888-org/pages-index-index/coin_fil.png', weigh: 55 },
      { code: 'LTC/USDT', title: 'Litecoin', price: 53.3800, change: '-1.64%', image: '/sites/spotline888-org/pages-index-index/coin_ltc.png', weigh: 50 },
      { code: 'DCR/USDT', title: 'Decred', price: 26.5510, change: '-6.05%', image: '/sites/spotline888-org/pages-index-index/coin_dcr.png', weigh: 45 },
      { code: 'IOTA/USDT', title: 'IOTA', price: 0.0660, change: '-1.64%', image: '/sites/spotline888-org/pages-index-index/coin_iota.png', weigh: 40 },
    ];

    for (const p of products) {
      const [existing] = await connection.query('SELECT id FROM fa_product WHERE code = ?', [p.code]);
      if (existing.length === 0) {
        await connection.query(
          `INSERT INTO fa_product (code, title, type_id, price, image, weigh, is_open, status, created_at)
           VALUES (?, ?, 1, ?, ?, ?, 1, 1, NOW())`,
          [p.code, p.title, p.price, p.image, p.weigh]
        );
      } else {
        await connection.query(
          `UPDATE fa_product SET price = ?, image = ?, weigh = ? WHERE code = ?`,
          [p.price, p.image, p.weigh, p.code]
        );
      }
    }
    console.log(`   -> Đã đồng bộ ${products.length} sản phẩm giao dịch.`);

    // 3. Seed Cấu hình các gói Quỹ Tiết Kiệm Yu'e Bao
    console.log('💰 3. Đang seed cấu hình Quỹ Yu\'e Bao...');
    const yuebaoConfigs = [
      { id: 1, title: 'Gói Tiết Kiệm Linh Hoạt 1 Ngày', day: 1, min_rate: 0.0100, max_rate: 0.0120, radio: '1.0% - 1.2%' },
      { id: 2, title: 'Gói Tiết Kiệm Tăng Trưởng 7 Ngày', day: 7, min_rate: 0.0120, max_rate: 0.0150, radio: '1.2% - 1.5%' },
      { id: 3, title: 'Gói Tiết Kiệm Kỳ Hạn 15 Ngày', day: 15, min_rate: 0.0140, max_rate: 0.0180, radio: '1.4% - 1.8%' },
      { id: 4, title: 'Gói Tiết Kiệm Tối Ưu 30 Ngày', day: 30, min_rate: 0.0160, max_rate: 0.0210, radio: '1.6% - 2.1%' },
    ];

    for (const y of yuebaoConfigs) {
      const [exY] = await connection.query('SELECT id FROM fa_yuebao_config WHERE id = ? OR day = ?', [y.id, y.day]);
      if (exY.length === 0) {
        await connection.query(
          `INSERT INTO fa_yuebao_config (id, title, day, min_rate, max_rate, radio, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, NOW())`,
          [y.id, y.title, y.day, y.min_rate, y.max_rate, y.radio]
        );
      }
    }
    console.log(`   -> Đã hoàn thành cấu hình Quỹ Yu'e Bao.`);

    // 4. Seed các Hội viên phụ (User 4, User 87, User 12)
    console.log('👥 4. Đang seed các tài khoản Hội viên bổ sung...');
    const defaultPasswordHash = await hashPassword('123456');
    const extraUsers = [
      { id: 4, account: '124123124124', username: '124123124124', real_name: '124', phone: '0123456784', money: 1291052.51, credit_score: 100 },
      { id: 87, account: 'TheLoonChing', username: 'TheLoonChing', real_name: 'The Loon Ching', phone: '0123456787', money: 225890.00, credit_score: 100 },
      { id: 12, account: 'ak111', username: 'ak111', real_name: 'Demo User 12', phone: '0123456712', money: 2429.00, credit_score: 100 },
    ];

    for (const u of extraUsers) {
      await connection.query(`
        INSERT INTO fa_user (id, account, username, real_name, password, mpassword, phone, money, credit_score, invite_code, status, is_auth, reg_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 2, NOW())
        ON DUPLICATE KEY UPDATE 
          real_name = VALUES(real_name),
          money = VALUES(money),
          credit_score = VALUES(credit_score)
      `, [u.id, u.account, u.username, u.real_name, defaultPasswordHash, defaultPasswordHash, u.phone, u.money, u.credit_score, 'SP00' + u.id]);
    }

    // 5. Seed 30 Hội viên KYC từ INITIAL_VERIFY_ITEMS vào fa_user & fa_user_verify
    console.log('📑 5. Đang seed 30 hồ sơ KYC và Hội viên từ INITIAL_VERIFY_ITEMS...');
    for (const item of verifyItemsData) {
      const dbStatus = item.is_auth === -1 ? 3 : (item.is_auth === 1 ? 1 : 2); // 1: chờ duyệt, 2: đã duyệt, 3: từ chối
      const userMoney = parseFloat(item.money || '0') || 0;
      const userCreditScore = item.credit_score || 100;
      const userPhone = item.id_card && item.id_card.length >= 6 ? item.id_card : `098${item.id}888`;
      const inviteCode = `SP${item.id}${Math.floor(10 + Math.random() * 90)}`;

      // 5.1 Seed fa_user
      await connection.query(`
        INSERT INTO fa_user (id, account, username, real_name, password, mpassword, phone, money, credit_score, is_auth, invite_code, status, remark, reg_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        ON DUPLICATE KEY UPDATE
          real_name = VALUES(real_name),
          money = VALUES(money),
          credit_score = VALUES(credit_score),
          is_auth = VALUES(is_auth),
          remark = VALUES(remark)
      `, [
        item.id,
        item.username,
        item.username,
        item.real_name,
        defaultPasswordHash,
        defaultPasswordHash,
        userPhone,
        userMoney,
        userCreditScore,
        dbStatus,
        inviteCode,
        item.profession || '',
        item.reg_time || '2026-09-01 00:00:00',
      ]);

      // 5.2 Seed fa_user_verify
      await connection.query(`
        INSERT INTO fa_user_verify (id, user_id, real_name, id_card, id_img_front, id_img_back, profession, status, error_reason, audit_time, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          real_name = VALUES(real_name),
          id_card = VALUES(id_card),
          id_img_front = VALUES(id_img_front),
          id_img_back = VALUES(id_img_back),
          profession = VALUES(profession),
          status = VALUES(status),
          error_reason = VALUES(error_reason),
          audit_time = VALUES(audit_time)
      `, [
        item.id,
        item.id,
        item.real_name,
        item.id_card,
        item.id_img_1,
        item.id_img_2,
        item.profession || '',
        dbStatus,
        item.id_auth_error || null,
        item.verify_time || null,
        item.reg_time || '2026-09-01 00:00:00',
      ]);
    }
    console.log(`   -> Đã hoàn thành lưu ${verifyItemsData.length} hồ sơ KYC vào CSDL!`);

    // 6. Seed 10 Đơn cược ban đầu vào fa_order
    console.log('📊 6. Đang seed các đơn cược quyền chọn vào fa_order...');
    for (const ord of initialOrdersData) {
      await connection.query(`
        INSERT INTO fa_order (id, user_id, product_id, product_title, ostyle, buy_money, balance_after, buy_price, sell_price, duration, yield_rate, type_desc, ploss, kong_type, status, buy_time, sell_time, created_at)
        VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, 60, 85.00, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          buy_money = VALUES(buy_money),
          balance_after = VALUES(balance_after),
          buy_price = VALUES(buy_price),
          sell_price = VALUES(sell_price),
          ploss = VALUES(ploss),
          kong_type = VALUES(kong_type),
          status = VALUES(status)
      `, [
        ord.id,
        ord.userId,
        ord.productTitle,
        ord.oStyle,
        ord.buyMoney,
        ord.balanceBuyAfter,
        ord.buyPrice,
        ord.sellPrice || 0,
        ord.type,
        ord.ploss || 0,
        ord.kongType || 'default',
        ord.status || 'holding',
        ord.buyTime,
        ord.sellTime,
        ord.buyTime
      ]);
    }
    console.log(`   -> Đã hoàn thành lưu ${initialOrdersData.length} đơn cược vào fa_order!`);

    // 7. Seed 4 Đơn gửi Quỹ Yu'e Bao vào fa_yuebao_order
    console.log('🏦 7. Đang seed các đơn gửi Quỹ Yu\'e Bao vào fa_yuebao_order...');
    for (const yb of yuebaoOrdersData) {
      await connection.query(`
        INSERT INTO fa_yuebao_order (id, user_id, config_id, amount, type, tx, status, remark, created_at)
        VALUES (?, ?, 1, ?, ?, 0, ?, 'Đơn tiết kiệm mẫu', ?)
        ON DUPLICATE KEY UPDATE
          amount = VALUES(amount),
          status = VALUES(status)
      `, [
        yb.id,
        yb.user_id,
        yb.amount,
        yb.type,
        yb.status,
        yb.created_at
      ]);
    }
    console.log(`   -> Đã hoàn thành lưu ${yuebaoOrdersData.length} đơn Quỹ Yu'e Bao vào fa_yuebao_order!`);

    console.log('\n🌟 ĐÃ HOÀN THÀNH TOÀN BỘ VIỆC ĐẨY DATA VÀO DATABASE THÀNH CÔNG!');
  } catch (err) {
    console.error('❌ Lỗi khi seed dữ liệu:', err);
    throw err;
  } finally {
    connection.release();
  }
}

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedData };
