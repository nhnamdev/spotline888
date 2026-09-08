import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scripts/verify_data.json', 'utf-8'));

// Take top 30 rows
const selectedRows = rawData.rows.slice(0, 30).map(r => ({
  id: r.id,
  username: r.username || '',
  real_name: r.real_name || '',
  id_card: r.id_card || '',
  profession: r.profession || '',
  id_img_1: r.id_img_1 || '',
  id_img_2: r.id_img_2 || '',
  gj: r.gj || (r.id % 5 === 0 ? 'passport' : 'id_card'), // use valid values
  is_auth: r.is_auth !== undefined ? r.is_auth : 2,
  id_auth_error: r.id_auth_error || '',
  verify_time: r.reg_time || '',
  reg_time: r.reg_time || '',
  money: r.money || '0.00',
  credit_score: r.credit_score || 100
}));

// Make row 197 or a couple rows show different statuses (e.g. one 已提交 for the sidebar badge "1"!)
// Notice sidebar menu item 10 has: `<span id="verifymark">1</span>`!
// That's why the badge shows 1 pending verification!
if (selectedRows.length > 0) {
  selectedRows[0].is_auth = 1; // ID 197 is "已提交" (pending verify) matching sidebar badge!
}

const content = `export interface VerifyItem {
  id: number;
  username: string;
  real_name: string;
  id_card: string;
  profession: string;
  id_img_1: string;
  id_img_2: string;
  gj: string | null;
  is_auth: number; // 0: 未认证, 1: 已提交, 2: 已认证, -1: 认证失败
  id_auth_error: string;
  verify_time: string;
  reg_time: string;
  money: string;
  credit_score: number;
}

export const INITIAL_VERIFY_ITEMS: VerifyItem[] = ${JSON.stringify(selectedRows, null, 2)};
`;

fs.mkdirSync('src/components/sites/spotline888-org/admin-verify', { recursive: true });
fs.writeFileSync('src/components/sites/spotline888-org/admin-verify/verifyData.ts', content, 'utf-8');
console.log("Generated verifyData.ts with", selectedRows.length, "rows.");
