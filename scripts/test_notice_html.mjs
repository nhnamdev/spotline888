import fetch from "node-fetch";

async function test() {
  const res = await fetch("http://localhost:3000/notice");
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Contains 新闻公告:", text.includes("新闻公告"));
  console.log("Contains 隐私政策:", text.includes("隐私政策"));
  console.log("Contains 公司使命:", text.includes("公司使命"));
  console.log("Contains 帮助中心:", text.includes("帮助中心"));
  console.log("Contains 合同简介:", text.includes("合同简介"));
}

test().catch(console.error);
