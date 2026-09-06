import { spawn } from 'child_process';
import fs from 'fs';

async function testAuthIndexPage() {
  const token = 'ZjVmMTkwYjU0NzBiNDgwZGQ2NTllZGM5ZWViZWVjODY=';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile-auth'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9230/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    chromeProc.kill();
    return;
  }

  const createRes = await fetch('http://127.0.0.1:9230/json/new?https://spotline888.org/#/pages/login/login', { method: 'PUT' });
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

  console.log('Waiting 3s for initial page...');
  await new Promise(r => setTimeout(r, 3000));

  // Set auth state in localStorage
  console.log('Injecting auth token into localStorage...');
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        const token = "${token}";
        const state = {
          token: token,
          userInfo: { id: 12, account: 'Ak111', nickname: 'Ak111' },
          appInfo: {},
          registerInfo: {}
        };
        localStorage.setItem("vuex", JSON.stringify(state));
        localStorage.setItem("token", token);
        if (window.uni && window.uni.setStorageSync) {
          window.uni.setStorageSync("vuex", state);
          window.uni.setStorageSync("token", token);
        }
        window.location.hash = "#/pages/index/index";
        window.location.reload();
      })()
    `
  });

  console.log('Waiting 6s for index page to render with authenticated state...');
  await new Promise(r => setTimeout(r, 6000));

  const finalUrl = await send('Runtime.evaluate', { expression: 'window.location.href' });
  console.log('Current URL after auth injection:', finalUrl.result?.value);

  // Take screenshot of top
  const ssTop = await send('Page.captureScreenshot', { format: 'png' });
  if (ssTop.result?.data) {
    fs.mkdirSync('docs/design-references/spotline888-org/pages-index-index', { recursive: true });
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-top.png', Buffer.from(ssTop.result.data, 'base64'));
    console.log('Saved docs/design-references/spotline888-org/pages-index-index/mobile-top.png!');
  }

  // Scroll down and capture middle
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 600)' });
  await new Promise(r => setTimeout(r, 1000));
  const ssMid = await send('Page.captureScreenshot', { format: 'png' });
  if (ssMid.result?.data) {
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-middle.png', Buffer.from(ssMid.result.data, 'base64'));
    console.log('Saved mobile-middle.png!');
  }

  // Scroll down and capture bottom
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 800)' });
  await new Promise(r => setTimeout(r, 1000));
  const ssBot = await send('Page.captureScreenshot', { format: 'png' });
  if (ssBot.result?.data) {
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-bottom.png', Buffer.from(ssBot.result.data, 'base64'));
    console.log('Saved mobile-bottom.png!');
  }

  // Dump DOM
  const domRes = await send('Runtime.evaluate', { expression: 'document.body.innerHTML' });
  fs.writeFileSync('scripts/index_authenticated_dom.html', domRes.result?.value || '');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

testAuthIndexPage().catch(console.error);
