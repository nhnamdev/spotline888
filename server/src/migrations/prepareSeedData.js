const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Extract attachments from git HEAD
try {
  const rawAttachmentFile = execSync(
    'git show HEAD:src/components/sites/spotline888-org/admin-attachment/attachmentData.ts',
    { maxBuffer: 10 * 1024 * 1024 }
  ).toString();

  const match = rawAttachmentFile.match(/export const (?:rawAttachments|INITIAL_ATTACHMENTS): AttachmentItem\[\] = (\[[\s\S]*?\]);/);
  if (match && match[1]) {
    fs.writeFileSync(path.join(dataDir, 'attachments.json'), match[1], 'utf-8');
    console.log('✅ Đã trích xuất attachments.json thành công');
  }

} catch (err) {
  console.warn('⚠️ Không thể trích xuất attachments từ git:', err.message);
}

// 2. Extract rules from rulesData.ts
try {
  const rulesFilePath = path.resolve(__dirname, '../../../src/components/sites/spotline888-org/admin-auth/rulesData.ts');
  const rawRulesFile = fs.readFileSync(rulesFilePath, 'utf-8');
  const match = rawRulesFile.match(/export const INITIAL_RULES: RuleItem\[\] = (\[[\s\S]*?\]);/);
  if (match && match[1]) {
    fs.writeFileSync(path.join(dataDir, 'authRules.json'), match[1], 'utf-8');
    console.log('✅ Đã trích xuất authRules.json thành công');
  }
} catch (err) {
  console.warn('⚠️ Không thể trích xuất rules:', err.message);
}

// 3. Extract admin logs from AdminAuthAdminLogContent.tsx
try {
  const logFilePath = path.resolve(__dirname, '../../../src/components/sites/spotline888-org/admin-auth/AdminAuthAdminLogContent.tsx');
  const rawLogFile = fs.readFileSync(logFilePath, 'utf-8');
  const match = rawLogFile.match(/const INITIAL_LOGS: AdminLog\[\] = (\[[\s\S]*?\]);/);
  if (match && match[1]) {
    const data = new Function(`return ${match[1]}`)();
    fs.writeFileSync(path.join(dataDir, 'adminLogs.json'), JSON.stringify(data, null, 2), 'utf-8');
    console.log('✅ Đã trích xuất adminLogs.json thành công');
  }
} catch (err) {
  console.warn('⚠️ Không thể trích xuất adminLogs:', err.message);
}

