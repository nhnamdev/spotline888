import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scripts/profile_data.json', 'utf8'));
const rows = raw.rows || [];

const tsContent = `export interface ProfileLogItem {
  id: number;
  admin_id: number;
  username: string;
  url: string;
  title: string;
  content: string;
  ip: string;
  useragent: string;
  createtime: number;
}

export const INITIAL_PROFILE_LOGS: ProfileLogItem[] = ${JSON.stringify(rows, null, 2)};
`;

fs.mkdirSync('src/components/sites/spotline888-org/admin-profile', { recursive: true });
fs.writeFileSync('src/components/sites/spotline888-org/admin-profile/profileData.ts', tsContent, 'utf8');
console.log(`Generated profileData.ts with ${rows.length} rows`);
