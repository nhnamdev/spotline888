import { LanguageCode } from "../pages-login-login/i18n";

export interface ProductTranslations {
  productTitle: string;
  futureProducts: string;
  name: string;
  latestPrice: string;
  change24h: string;
  tabHome: string;
  tabProducts: string;
  tabBalance: string;
  tabMine: string;
}

export const PRODUCT_TRANSLATIONS: Record<LanguageCode, ProductTranslations> = {
  "zh-CN": {
    productTitle: "产品",
    futureProducts: "未来产品",
    name: "名称",
    latestPrice: "最新价格",
    change24h: "24小时涨幅",
    tabHome: "首页",
    tabProducts: "产品",
    tabBalance: "余额宝",
    tabMine: "我的",
  },
  "vi-VN": {
    productTitle: "Sản phẩm",
    futureProducts: "Sản phẩm tương lai",
    name: "Tên",
    latestPrice: "Giá mới nhất",
    change24h: "Biên độ 24h",
    tabHome: "Trang chủ",
    tabProducts: "Sản phẩm",
    tabBalance: "Số dư",
    tabMine: "Cá nhân",
  },
  "en-US": {
    productTitle: "Products",
    futureProducts: "Future Products",
    name: "Name",
    latestPrice: "Last Price",
    change24h: "24h Chg%",
    tabHome: "Home",
    tabProducts: "Products",
    tabBalance: "Balance",
    tabMine: "Mine",
  },
  "id-ID": {
    productTitle: "Produk",
    futureProducts: "Produk Masa Depan",
    name: "Nama",
    latestPrice: "Harga Terbaru",
    change24h: "Perubahan 24 Jam",
    tabHome: "Beranda",
    tabProducts: "Produk",
    tabBalance: "Saldo",
    tabMine: "Profil",
  },
  "ms-MY": {
    productTitle: "Produk",
    futureProducts: "Produk Masa Depan",
    name: "Nama",
    latestPrice: "Harga Terkini",
    change24h: "Perubahan 24 Jam",
    tabHome: "Laman Utama",
    tabProducts: "Produk",
    tabBalance: "Baki",
    tabMine: "Saya",
  },
  "hk-TW": {
    productTitle: "產品",
    futureProducts: "未來產品",
    name: "名稱",
    latestPrice: "最新價格",
    change24h: "24小時漲幅",
    tabHome: "首頁",
    tabProducts: "產品",
    tabBalance: "餘額寶",
    tabMine: "我的",
  },
  "ja-JP": {
    productTitle: "製品",
    futureProducts: "先物商品",
    name: "名称",
    latestPrice: "最新価格",
    change24h: "24時間変動",
    tabHome: "ホーム",
    tabProducts: "製品",
    tabBalance: "残高",
    tabMine: "マイページ",
  },
  "th-TH": {
    productTitle: "ผลิตภัณฑ์",
    futureProducts: "ผลิตภัณฑ์ในอนาคต",
    name: "ชื่อ",
    latestPrice: "ราคาล่าสุด",
    change24h: "เปลี่ยนแปลง 24 ชม.",
    tabHome: "หน้าแรก",
    tabProducts: "ผลิตภัณฑ์",
    tabBalance: "ยอดคงเหลือ",
    tabMine: "ของฉัน",
  },
  "ko-KR": {
    productTitle: "제품",
    futureProducts: "선물 상품",
    name: "이름",
    latestPrice: "현재가",
    change24h: "24시간 변동",
    tabHome: "홈",
    tabProducts: "제품",
    tabBalance: "잔액",
    tabMine: "마이페이지",
  },
  "fr-FR": {
    productTitle: "Produits",
    futureProducts: "Produits Futures",
    name: "Nom",
    latestPrice: "Dernier Prix",
    change24h: "Variation 24h",
    tabHome: "Accueil",
    tabProducts: "Produits",
    tabBalance: "Solde",
    tabMine: "Moi",
  },
  "de-DE": {
    productTitle: "Produkte",
    futureProducts: "Future-Produkte",
    name: "Name",
    latestPrice: "Letzter Preis",
    change24h: "24h Änderung",
    tabHome: "Startseite",
    tabProducts: "Produkte",
    tabBalance: "Guthaben",
    tabMine: "Mein",
  },
};
