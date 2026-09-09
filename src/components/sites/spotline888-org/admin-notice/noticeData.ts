export interface NoticeItem {
  id: number;
  type: number; // 1: 公告, 2: 帮助中心, 3: 隐私政策, 4: 合同简介
  title: string;
  url: string | null;
  short_content: string;
  content: string;
  rank: number;
  status: number; // 1: 启用, 0: 禁用
  ctime: string;
  rtime: string;
}

export const INITIAL_NOTICES: NoticeItem[] = [];

