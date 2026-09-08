"use client";

import { LanguageCode } from "../pages-login-login/i18n";

export interface SystemMessageTranslations {
  title: string;
  markAllRead: string;
  refresh: string;
  unread: string;
  read: string;
  allReadSuccess: string;
  refreshSuccess: string;
  emptyMessages: string;
}

export const SYSTEM_MESSAGE_TRANSLATIONS: Record<
  LanguageCode,
  SystemMessageTranslations
> = {
  "zh-CN": {
    title: "系统消息",
    markAllRead: "全部已读",
    refresh: "刷新",
    unread: "未读",
    read: "已读",
    allReadSuccess: "已将所有消息标记为已读",
    refreshSuccess: "刷新成功",
    emptyMessages: "暂无系统消息",
  },
  "vi-VN": {
    title: "Tin nhắn hệ thống",
    markAllRead: "Đọc tất cả",
    refresh: "Làm mới",
    unread: "Chưa đọc",
    read: "Đã đọc",
    allReadSuccess: "Đã đánh dấu tất cả tin nhắn là đã đọc",
    refreshSuccess: "Làm mới thành công",
    emptyMessages: "Không có tin nhắn hệ thống nào",
  },
  "en-US": {
    title: "System Messages",
    markAllRead: "Mark all read",
    refresh: "Refresh",
    unread: "Unread",
    read: "Read",
    allReadSuccess: "All messages marked as read",
    refreshSuccess: "Refreshed successfully",
    emptyMessages: "No system messages",
  },
  "hk-TW": {
    title: "系統消息",
    markAllRead: "全部已讀",
    refresh: "刷新",
    unread: "未讀",
    read: "已讀",
    allReadSuccess: "已將所有消息標記為已讀",
    refreshSuccess: "刷新成功",
    emptyMessages: "暫無系統消息",
  },
  "id-ID": {
    title: "Pesan Sistem",
    markAllRead: "Tandai Semua Dibaca",
    refresh: "Segarkan",
    unread: "Belum Dibaca",
    read: "Sudah Dibaca",
    allReadSuccess: "Semua pesan ditandai telah dibaca",
    refreshSuccess: "Berhasil menyegarkan",
    emptyMessages: "Tidak ada pesan sistem",
  },
  "ms-MY": {
    title: "Mesej Sistem",
    markAllRead: "Tanda Semua Telah Dibaca",
    refresh: "Muat Semula",
    unread: "Belum Dibaca",
    read: "Telah Dibaca",
    allReadSuccess: "Semua mesej ditandakan sebagai telah dibaca",
    refreshSuccess: "Berjaya dimuat semula",
    emptyMessages: "Tiada mesej sistem",
  },
  "ja-JP": {
    title: "システムメッセージ",
    markAllRead: "すべて既読にする",
    refresh: "更新",
    unread: "未読",
    read: "既読",
    allReadSuccess: "すべてのメッセージを既読にしました",
    refreshSuccess: "更新しました",
    emptyMessages: "システムメッセージはありません",
  },
  "th-TH": {
    title: "ข้อความระบบ",
    markAllRead: "อ่านทั้งหมด",
    refresh: "รีเฟรช",
    unread: "ยังไม่อ่าน",
    read: "อ่านแล้ว",
    allReadSuccess: "ทำเครื่องหมายข้อความทั้งหมดว่าอ่านแล้ว",
    refreshSuccess: "รีเฟรชสำเร็จ",
    emptyMessages: "ไม่มีข้อความระบบ",
  },
  "ko-KR": {
    title: "시스템 메시지",
    markAllRead: "모두 읽음 표시",
    refresh: "새로고침",
    unread: "읽지 않음",
    read: "읽음",
    allReadSuccess: "모든 메시지를 읽음으로 표시했습니다",
    refreshSuccess: "새로고침 완료",
    emptyMessages: "시스템 메시지가 없습니다",
  },
  "fr-FR": {
    title: "Messages Système",
    markAllRead: "Tout marquer comme lu",
    refresh: "Actualiser",
    unread: "Non lu",
    read: "Lu",
    allReadSuccess: "Tous les messages sont marqués comme lus",
    refreshSuccess: "Actualisation réussie",
    emptyMessages: "Aucun message système",
  },
  "de-DE": {
    title: "Systemnachrichten",
    markAllRead: "Alle als gelesen markieren",
    refresh: "Aktualisieren",
    unread: "Ungelesen",
    read: "Gelesen",
    allReadSuccess: "Alle Nachrichten als gelesen markiert",
    refreshSuccess: "Erfolgreich aktualisiert",
    emptyMessages: "Keine Systemnachrichten",
  },
};
