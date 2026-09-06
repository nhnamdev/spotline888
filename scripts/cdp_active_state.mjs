import { spawn } from 'child_process';
import fs from 'fs';

async function captureActiveState() {
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 3500));

  // Type in account and password
  await send('Runtime.evaluate', {
    expression: `
      const inputs = document.querySelectorAll('input');
      if (inputs.length >= 2) {
        inputs[0].value = 'spotline_user';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].value = 'password123';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  const ss = await send('Page.captureScreenshot', { format: 'png' });
  if (ss.result?.data) {
    fs.writeFileSync('scripts/target_active_btn.png', Buffer.from(ss.result.data, 'base64'));
    console.log('Saved scripts/target_active_btn.png!');
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

captureActiveState().catch(console.error);
