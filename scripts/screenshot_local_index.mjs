import { spawn } from 'child_process';
import fs from 'fs';

async function screenshotLocalIndex() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile-local-index'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9232/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    chromeProc.kill();
    return;
  }

  const createRes = await fetch('http://127.0.0.1:9232/json/new?http://localhost:3000', { method: 'PUT' });
  const target = await createRes.json();
  const pageWs = target.webSocketDebuggerUrl;

  const ws = new WebSocket(pageWs);
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Waiting 3s for local index to render...');
  await new Promise(r => setTimeout(r, 3000));
  await send('Runtime.evaluate', {
    expression: "const el = document.querySelector('nextjs-portal'); if (el) el.style.display = 'none';"
  });

  // 1. Top screenshot
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss1.result?.data) {
    fs.writeFileSync('scripts/local_index_top.png', Buffer.from(ss1.result.data, 'base64'));
    console.log('Saved scripts/local_index_top.png');
  }

  // 2. Middle screenshot
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 500)' });
  await new Promise(r => setTimeout(r, 500));
  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss2.result?.data) {
    fs.writeFileSync('scripts/local_index_middle.png', Buffer.from(ss2.result.data, 'base64'));
    console.log('Saved scripts/local_index_middle.png');
  }

  // 3. Bottom screenshot
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 500)' });
  await new Promise(r => setTimeout(r, 500));
  const ss3 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss3.result?.data) {
    fs.writeFileSync('scripts/local_index_bottom.png', Buffer.from(ss3.result.data, 'base64'));
    console.log('Saved scripts/local_index_bottom.png');
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

screenshotLocalIndex().catch(console.error);
