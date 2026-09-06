import { spawn } from 'child_process';
import fs from 'fs';

async function screenshotLocal() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile-test2'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9224/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    chromeProc.kill();
    return;
  }

  const createRes = await fetch('http://127.0.0.1:9224/json/new?http://localhost:3000', { method: 'PUT' });
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

  // Set mobile device metrics
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 2000));

  // Default state screenshot
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  if (ss.result?.data) {
    fs.writeFileSync('scripts/local_mobile_screenshot.png', Buffer.from(ss.result.data, 'base64'));
  }

  // Type account and password to test active state
  await send('Runtime.evaluate', {
    expression: `
      const inputs = document.querySelectorAll('input');
      if (inputs[0]) {
        inputs[0].value = 'spotline_user';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (inputs[1]) {
        inputs[1].value = '12345678';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const ssActive = await send('Page.captureScreenshot', { format: 'png' });
  if (ssActive.result?.data) {
    fs.writeFileSync('scripts/local_active_screenshot.png', Buffer.from(ssActive.result.data, 'base64'));
    console.log('Saved scripts/local_active_screenshot.png!');
  }

  // Also test language drawer
  await send('Runtime.evaluate', {
    expression: "document.querySelector('button[aria-label=\"Language Switcher\"]').click()"
  });
  await new Promise(r => setTimeout(r, 500));

  const ssLang = await send('Page.captureScreenshot', { format: 'png' });
  if (ssLang.result?.data) {
    fs.writeFileSync('scripts/local_lang_drawer.png', Buffer.from(ssLang.result.data, 'base64'));
    console.log('Saved scripts/local_lang_drawer.png!');
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

screenshotLocal().catch(console.error);
