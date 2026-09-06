import { spawn } from 'child_process';
import fs from 'fs';

async function takeScreenshot() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile'
  ]);

  // Wait for port to open
  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9222/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      console.log('Connected to Chrome DevTools!', wsUrl);
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Failed to connect to Chrome DevTools');
    chromeProc.kill();
    return;
  }

  // Create new target
  const createRes = await fetch('http://127.0.0.1:9222/json/new?https://spotline888.org/#/pages/login/login', { method: 'PUT' });
  const target = await createRes.json();
  const pageWs = target.webSocketDebuggerUrl;
  console.log('Page WebSocket:', pageWs);

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

  // Set device metrics (mobile 390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Enable Page and Runtime
  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Waiting 5s for page to render...');
  await new Promise(r => setTimeout(r, 5000));

  // Get outerHTML
  const htmlRes = await send('Runtime.evaluate', {
    expression: 'document.body.innerHTML'
  });
  console.log('Body HTML length:', htmlRes.result?.value?.length);
  fs.writeFileSync('scripts/rendered_body.html', htmlRes.result?.value || '');

  // Screenshot
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  if (ss.result?.data) {
    fs.writeFileSync('scripts/target_mobile_screenshot.png', Buffer.from(ss.result.data, 'base64'));
    console.log('Successfully saved scripts/target_mobile_screenshot.png!');
  }

  // Also desktop 1440x900 screenshot
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));
  const ssDesktop = await send('Page.captureScreenshot', { format: 'png' });
  if (ssDesktop.result?.data) {
    fs.writeFileSync('scripts/target_desktop_screenshot.png', Buffer.from(ssDesktop.result.data, 'base64'));
    console.log('Successfully saved scripts/target_desktop_screenshot.png!');
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

takeScreenshot().catch(console.error);
