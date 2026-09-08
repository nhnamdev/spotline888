import fetch from "node-fetch";

async function test() {
  console.log("Testing /yuebao_config...");
  const res1 = await fetch("http://localhost:3000/yuebao_config");
  const text1 = await res1.text();
  console.log("Status /yuebao_config:", res1.status);
  console.log("Contains 余额宝配置:", text1.includes("余额宝配置"));
  console.log("Contains 余额宝管理:", text1.includes("余额宝管理"));
  console.log("Contains 配置标题:", text1.includes("配置标题"));
  console.log("Contains 收益率:", text1.includes("收益率"));
  console.log("Contains 计算周期(天):", text1.includes("计算周期(天)"));
  console.log("Contains 最低金额:", text1.includes("最低金额"));
  console.log("Contains 启用:", text1.includes("启用"));

  console.log("Testing /admin/yuebao_config...");
  const res2 = await fetch("http://localhost:3000/admin/yuebao_config");
  console.log("Status /admin/yuebao_config:", res2.status);
}

test().catch(console.error);
