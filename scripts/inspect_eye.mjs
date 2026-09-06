import { spawn } from 'child_process';
import fs from 'fs';

async function inspectEye() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9222/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  const createRes = await fetch('http://127.0.0.1:9222/json/new?https://spotline888.org/#/pages/login/login', { method: 'PUT' });
  const target = await createRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(resolve => ws.onopen = resolve);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const cb = callbacks.get(data.id);
      callbacks.delete(data.id);
      cb(data);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 3500));

  const eyeHtml = await send('Runtime.evaluate', {
    expression: 'document.querySelector(".eye-btn")?.outerHTML'
  });
  console.log('eye-btn outerHTML:', eyeHtml.result?.value);

  const eyeStyles = await send('Runtime.evaluate', {
    expression: `
      const el = document.querySelector(".eye-btn");
      const icon = el?.querySelector(".eye-icon");
      JSON.stringify({
        btn: el ? getComputedStyle(el).cssText : null,
        icon: icon ? {
          fontFamily: getComputedStyle(icon).fontFamily,
          fontSize: getComputedStyle(icon).fontSize,
          color: getComputedStyle(icon).color,
          content: getComputedStyle(icon, '::before').content,
          text: icon.textContent
        } : null
      }, null, 2);
    `
  });
  console.log('eye styles:', eyeStyles.result?.value);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

inspectEye().catch(console.error);
