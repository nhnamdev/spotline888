import { spawn } from 'child_process';
import fs from 'fs';

async function testVietnamese() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile-test4'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9226/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    chromeProc.kill();
    return;
  }

  const createRes = await fetch('http://127.0.0.1:9226/json/new?http://localhost:3000', { method: 'PUT' });
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

  await new Promise(r => setTimeout(r, 2000));

  // Open language drawer
  await send('Runtime.evaluate', {
    expression: "document.querySelector('button[aria-label=\"Language Switcher\"]').click()"
  });
  await new Promise(r => setTimeout(r, 500));

  // Click Tiếng Việt
  await send('Runtime.evaluate', {
    expression: `
      const items = Array.from(document.querySelectorAll('div')).filter(d => d.textContent.trim() === 'Tiếng Việt');
      if (items[0]) items[0].click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // Capture Vietnamese screenshot
  const ssVi = await send('Page.captureScreenshot', { format: 'png' });
  if (ssVi.result?.data) {
    fs.writeFileSync('scripts/local_vietnamese_screenshot.png', Buffer.from(ssVi.result.data, 'base64'));
    console.log('Saved Vietnamese screenshot to scripts/local_vietnamese_screenshot.png!');
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

testVietnamese().catch(console.error);
