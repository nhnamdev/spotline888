import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scripts/notice_data.json', 'utf8'));
const rows = raw.rows || [];

const tsContent = `export interface NoticeItem {
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

export const INITIAL_NOTICES: NoticeItem[] = ${JSON.stringify(rows, null, 2)};
`;

fs.mkdirSync('src/components/sites/spotline888-org/admin-notice', { recursive: true });
fs.writeFileSync('src/components/sites/spotline888-org/admin-notice/noticeData.ts', tsContent, 'utf8');
console.log(`Generated noticeData.ts with ${rows.length} rows`);
