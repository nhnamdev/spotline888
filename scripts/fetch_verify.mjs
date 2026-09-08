import fetch from "node-fetch";
import fs from "fs";

async function run() {
  const cookie = fs.readFileSync("scripts/auth_cookie.txt", "utf-8").trim();
  const url = "https://spotline888.org/coinht.php/verify?ref=addtabs";
  
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Cookie": cookie,
      "Referer": "https://spotline888.org/coinht.php/dashboard"
    }
  });

  const html = await res.text();
  console.log("Status:", res.status, "Length:", html.length);
  fs.writeFileSync("scripts/verify_inner.html", html, "utf-8");

  // Also check backend JS
  const jsMatch = html.match(/jsname":"([^"]+)"/);
  console.log("JS Name:", jsMatch ? jsMatch[1] : "None");

  if (jsMatch) {
    const jsUrl = `https://spotline888.org/assets/js/${jsMatch[1]}.js`;
    const jsRes = await fetch(jsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Cookie": cookie
      }
    });
    const jsText = await jsRes.text();
    console.log("JS Status:", jsRes.status, "Length:", jsText.length);
    fs.writeFileSync("scripts/backend_verify.js", jsText, "utf-8");
  }
}

run().catch(console.error);
