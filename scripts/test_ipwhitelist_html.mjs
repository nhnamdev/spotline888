import fetch from "node-fetch";

async function test() {
  console.log("Testing /ipwhitelist...");
  const res1 = await fetch("http://localhost:3000/ipwhitelist");
  const text1 = await res1.text();
  console.log("Status /ipwhitelist:", res1.status);
  console.log("Contains 后台IP白名单:", text1.includes("后台IP白名单"));
  console.log("Contains IP白名单:", text1.includes("IP白名单"));
  console.log("Contains 添加IP:", text1.includes("添加IP"));
  console.log("Contains 批量删除:", text1.includes("批量删除"));
  console.log("Contains 77.83.241.39:", text1.includes("77.83.241.39"));
  console.log("Contains 管理员IP:", text1.includes("管理员IP"));

  console.log("Testing /index/ipwhitelist...");
  const res2 = await fetch("http://localhost:3000/index/ipwhitelist");
  console.log("Status /index/ipwhitelist:", res2.status);

  console.log("Testing /admin/ipwhitelist...");
  const res3 = await fetch("http://localhost:3000/admin/ipwhitelist");
  console.log("Status /admin/ipwhitelist:", res3.status);
}

test().catch(console.error);
