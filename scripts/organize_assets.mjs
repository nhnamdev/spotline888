import fs from 'fs';
import path from 'path';

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
}

const refDir = 'docs/design-references/spotline888-org/pages-login-login';
const assetDir = 'public/sites/spotline888-org/pages-login-login';

copyFile('scripts/target_mobile_screenshot.png', `${refDir}/mobile-default.png`);
copyFile('scripts/target_desktop_screenshot.png', `${refDir}/desktop-default.png`);
copyFile('scripts/target_lang_popup.png', `${refDir}/lang-drawer.png`);
copyFile('scripts/target_active_btn.png', `${refDir}/mobile-active-button.png`);

copyFile('scripts/logo.png', `${assetDir}/logo.png`);
copyFile('scripts/lang_icon.png', `${assetDir}/lang_icon.png`);
