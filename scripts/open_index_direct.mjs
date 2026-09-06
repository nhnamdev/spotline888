import { spawn } from 'child_process';
import fs from 'fs';

async function openIndexDirectly() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile-index'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9229/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    chromeProc.kill();
    return;
  }

  // Open https://spotline888.org/#/pages/index/index directly
  const createRes = await fetch('http://127.0.0.1:9229/json/new?https://spotline888.org/#/pages/index/index', { method: 'PUT' });
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

  console.log('Waiting 6s for index page to load...');
  await new Promise(r => setTimeout(r, 6000));

  const urlRes = await send('Runtime.evaluate', { expression: 'window.location.href' });
  console.log('Current URL:', urlRes.result?.value);

  // Take screenshot
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  if (ss.result?.data) {
    fs.mkdirSync('docs/design-references/spotline888-org/pages-index-index', { recursive: true });
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-direct.png', Buffer.from(ss.result.data, 'base64'));
    console.log('Saved docs/design-references/spotline888-org/pages-index-index/mobile-direct.png!');
  }

  const dom = await send('Runtime.evaluate', { expression: 'document.body.innerHTML' });
  fs.writeFileSync('scripts/index_direct_dom.html', dom.result?.value || '');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

openIndexDirectly().catch(console.error);
