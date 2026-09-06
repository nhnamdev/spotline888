import { spawn } from 'child_process';
import fs from 'fs';

async function captureRealIndex() {
  const token = 'ZjVmMTkwYjU0NzBiNDgwZGQ2NTllZGM5ZWViZWVjODY=';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile-real'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9231/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    chromeProc.kill();
    return;
  }

  const createRes = await fetch('http://127.0.0.1:9231/json/new?about:blank', { method: 'PUT' });
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

  // Add script to evaluate on new document
  const initScript = `
    const token = "${token}";
    const state = {
      token: token,
      userInfo: { id: 12, account: 'Ak111', nickname: 'Ak111' },
      appInfo: {},
      registerInfo: {}
    };
    try {
      localStorage.setItem("vuex", JSON.stringify(state));
      localStorage.setItem("token", token);
    } catch(e) {}
  `;

  await send('Page.addScriptToEvaluateOnNewDocument', { source: initScript });

  console.log('Navigating to https://spotline888.org/#/pages/index/index ...');
  await send('Page.navigate', { url: 'https://spotline888.org/#/pages/index/index' });

  console.log('Waiting 7s for page to load and render...');
  await new Promise(r => setTimeout(r, 7000));

  const url = await send('Runtime.evaluate', { expression: 'window.location.href' });
  console.log('Current URL is:', url.result?.value);

  // Take screenshot
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss1.result?.data) {
    fs.mkdirSync('docs/design-references/spotline888-org/pages-index-index', { recursive: true });
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-top.png', Buffer.from(ss1.result.data, 'base64'));
    console.log('Saved docs/design-references/spotline888-org/pages-index-index/mobile-top.png!');
  }

  // Scroll down 600px
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 600)' });
  await new Promise(r => setTimeout(r, 1000));
  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss2.result?.data) {
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-middle.png', Buffer.from(ss2.result.data, 'base64'));
    console.log('Saved mobile-middle.png!');
  }

  // Scroll down 800px
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 800)' });
  await new Promise(r => setTimeout(r, 1000));
  const ss3 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss3.result?.data) {
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-bottom.png', Buffer.from(ss3.result.data, 'base64'));
    console.log('Saved mobile-bottom.png!');
  }

  // Dump DOM
  const dom = await send('Runtime.evaluate', { expression: 'document.body.innerHTML' });
  fs.writeFileSync('scripts/index_real_dom.html', dom.result?.value || '');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

captureRealIndex().catch(console.error);
