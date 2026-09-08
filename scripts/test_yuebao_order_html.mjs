import fetch from "node-fetch";

async function test() {
  console.log("Testing /yuebao_order...");
  const res1 = await fetch("http://localhost:3000/yuebao_order");
  const text1 = await res1.text();
  console.log("Status /yuebao_order:", res1.status);
  console.log("Contains 余额宝订单:", text1.includes("余额宝订单"));
  console.log("Contains 余额宝管理:", text1.includes("余额宝管理"));
  console.log("Contains ak111:", text1.includes("ak111"));
  console.log("Contains 23.00:", text1.includes("23.00"));
  console.log("Contains WongLeeChu:", text1.includes("WongLeeChu"));

  console.log("Testing /yuebao_order/index...");
  const res2 = await fetch("http://localhost:3000/yuebao_order/index");
  console.log("Status /yuebao_order/index:", res2.status);

  console.log("Testing /admin/yuebao_order...");
  const res3 = await fetch("http://localhost:3000/admin/yuebao_order");
  console.log("Status /admin/yuebao_order:", res3.status);
}

test().catch(console.error);
