import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scripts/auth_rule_data.json', 'utf8'));

const tsCode = `export interface RuleItem {
  id: number;
  pid: number;
  name: string;
  title: string;
  icon: string;
  condition: string;
  remark: string;
  ismenu: number;
  createtime: number;
  updatetime: number;
  weigh: number;
  status: "normal" | "hidden";
  subnode?: number;
}

export const INITIAL_RULES: RuleItem[] = ${JSON.stringify(raw.rows, null, 2)};
`;

fs.writeFileSync('src/components/sites/spotline888-org/admin-auth/rulesData.ts', tsCode, 'utf8');
console.log('Successfully written rulesData.ts, count:', raw.rows.length);
