import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/verify_data.json', 'utf-8'));
const withVerifyTime = data.rows.filter(r => r.verify_time !== undefined && r.verify_time !== null);
console.log("Rows with verify_time:", withVerifyTime.length);
if (withVerifyTime.length > 0) {
  console.log("Sample verify_time:", withVerifyTime[0].verify_time);
} else {
  console.log("Row timestamps available:", {
    reg_time: data.rows[0].reg_time,
    last_login_time: data.rows[0].last_login_time,
    rtime: data.rows[0].rtime
  });
}
