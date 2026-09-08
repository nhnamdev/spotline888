import fetch from "node-fetch";

async function test() {
  console.log("Testing /verify...");
  const res = await fetch("http://localhost:3000/verify");
  const text = await res.text();
  console.log("Status /verify:", res.status);
  console.log("Contains 实名认证:", text.includes("实名认证"));
  console.log("Contains 批量通过:", text.includes("批量通过"));
  console.log("Contains 批量拒绝:", text.includes("批量拒绝"));
  console.log("Contains LeeChiewHo:", text.includes("LeeChiewHo"));
  console.log("Contains WongLeeChu:", text.includes("WongLeeChu"));
  console.log("Contains 身份证:", text.includes("身份证"));
  console.log("Contains 护照:", text.includes("护照"));

  console.log("Testing /admin/verify...");
  const resAdmin = await fetch("http://localhost:3000/admin/verify");
  console.log("Status /admin/verify:", resAdmin.status);
}

test().catch(console.error);
