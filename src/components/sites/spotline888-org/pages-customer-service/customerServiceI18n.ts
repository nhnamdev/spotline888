"use client";

import { LanguageCode } from "../pages-login-login/i18n";

export interface CustomerServiceTranslations {
  title: string;
  channel1: string;
  onlineNotice: string;
  clickToChat: string;
  workingHours: string;
}

export const CUSTOMER_SERVICE_TRANSLATIONS: Record<
  LanguageCode,
  CustomerServiceTranslations
> = {
  "zh-CN": {
    title: "在线客服",
    channel1: "在线客服①",
    onlineNotice: "专业客服团队为您提供7x24小时全天候贴心咨询服务",
    clickToChat: "点击进入咨询",
    workingHours: "服务时间：7x24小时全天候在线",
  },
  "vi-VN": {
    title: "Dịch vụ khách hàng trực tuyến",
    channel1: "Dịch vụ khách hàng ①",
    onlineNotice: "Đội ngũ chăm sóc khách hàng 24/7 sẵn sàng giải đáp mọi thắc mắc",
    clickToChat: "Nhấp để bắt đầu trò chuyện",
    workingHours: "Thời gian phục vụ: Trực tuyến 24/7",
  },
  "en-US": {
    title: "Online Support",
    channel1: "Customer Service ①",
    onlineNotice: "Professional support team available 24/7 for your assistance",
    clickToChat: "Click to start chat",
    workingHours: "Service Hours: 24/7 Online",
  },
  "hk-TW": {
    title: "在線客服",
    channel1: "在線客服①",
    onlineNotice: "專業客服團隊為您提供7x24小時全天候貼心諮詢服務",
    clickToChat: "點擊進入諮詢",
    workingHours: "服務時間：7x24小時全天候在線",
  },
  "id-ID": {
    title: "Layanan Pelanggan Online",
    channel1: "Layanan Pelanggan ①",
    onlineNotice: "Tim layanan pelanggan siap membantu Anda 24/7",
    clickToChat: "Klik untuk mulai percakapan",
    workingHours: "Jam Layanan: 24/7 Online",
  },
  "ms-MY": {
    title: "Khidmat Pelanggan Dalam Talian",
    channel1: "Khidmat Pelanggan ①",
    onlineNotice: "Pasukan khidmat pelanggan bersedia membantu anda 24/7",
    clickToChat: "Klik untuk berbual",
    workingHours: "Waktu Perkhidmatan: 24/7 Dalam Talian",
  },
  "ja-JP": {
    title: "オンラインカスタマーサービス",
    channel1: "オンラインサポート ①",
    onlineNotice: "24時間年中無休でサポートチームが対応いたします",
    clickToChat: "クリックして相談を開始",
    workingHours: "営業時間：年中無休24時間",
  },
  "th-TH": {
    title: "ฝ่ายบริการลูกค้าออนไลน์",
    channel1: "ฝ่ายบริการลูกค้า ①",
    onlineNotice: "ทีมบริการลูกค้าพร้อมให้บริการตลอด 24 ชั่วโมงทุกวัน",
    clickToChat: "คลิกเพื่อเริ่มแชท",
    workingHours: "เวลาทำการ: ออนไลน์ 24/7",
  },
  "ko-KR": {
    title: "온라인 고객센터",
    channel1: "온라인 고객센터 ①",
    onlineNotice: "연중무휴 24시간 전문 고객지원 서비스를 제공합니다",
    clickToChat: "상담 시작하기",
    workingHours: "운영 시간: 24시간 연중무휴",
  },
  "fr-FR": {
    title: "Service Client en Ligne",
    channel1: "Service Client ①",
    onlineNotice: "Notre équipe est à votre disposition 24h/24 et 7j/7",
    clickToChat: "Cliquez pour démarrer la discussion",
    workingHours: "Horaires: 24h/24 et 7j/7 en ligne",
  },
  "de-DE": {
    title: "Online-Kundenservice",
    channel1: "Kundenservice ①",
    onlineNotice: "Unser Support-Team ist rund um die Uhr für Sie da",
    clickToChat: "Klicken Sie hier, um den Chat zu starten",
    workingHours: "Servicezeiten: 24/7 Online",
  },
};
