import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scripts/attachment_data.json', 'utf8'));
const rows = raw.rows || [];

const tsContent = `export interface AttachmentItem {
  id: number;
  admin_id: number;
  user_id: string;
  url: string;
  imagewidth: string;
  imageheight: string;
  imagetype: string;
  imageframes: number;
  filesize: number;
  mimetype: string;
  extparam: string;
  createtime: number;
  updatetime: number;
  uploadtime: number;
  storage: string;
  sha1: string;
  fullurl: string;
}

export const INITIAL_ATTACHMENTS: AttachmentItem[] = ${JSON.stringify(rows, null, 2)};
`;

fs.mkdirSync('src/components/sites/spotline888-org/admin-attachment', { recursive: true });
fs.writeFileSync('src/components/sites/spotline888-org/admin-attachment/attachmentData.ts', tsContent, 'utf8');
console.log(`Generated attachmentData.ts with ${rows.length} rows`);
