import fs from 'fs';
import path from 'path';

const src = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d3641893-8920-4a3d-8212-26e79c83355f\\admin_full_dashboard_1788772552709.png';
const destDir = path.resolve('docs/design-references/spotline888-org/admin-dashboard');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
const dest = path.join(destDir, 'desktop_screenshot.png');
fs.copyFileSync(src, dest);
console.log('Copied desktop screenshot to', dest);
