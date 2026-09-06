import { spawn } from 'child_process';
import fs from 'fs';

async function reconIndexPage() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile-recon'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9228/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      console.log('Connected to Chrome!', wsUrl);
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    console.error('Failed to connect to Chrome');
    chromeProc.kill();
    return;
  }

  const createRes = await fetch('http://127.0.0.1:9228/json/new?https://spotline888.org/#/pages/login/login', { method: 'PUT' });
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

  // Set mobile device metrics (390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Enable network logging to capture API calls and image URLs
  await send('Network.enable');
  await send('Page.enable');
  await send('Runtime.enable');

  const capturedUrls = [];
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const cb = callbacks.get(data.id);
      callbacks.delete(data.id);
      cb(data);
    }
    if (data.method === 'Network.responseReceived') {
      const url = data.params.response.url;
      capturedUrls.push({ url, mimeType: data.params.response.mimeType });
    }
  };

  console.log('Waiting 4s for login page to load...');
  await new Promise(r => setTimeout(r, 4000));

  // Fill in credentials: Ak111 / 123456
  console.log('Filling in login credentials...');
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        const inputs = document.querySelectorAll('input');
        if (inputs[0]) {
          inputs[0].value = 'Ak111';
          inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (inputs[1]) {
          inputs[1].value = '123456';
          inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  // Click login submit button
  console.log('Clicking submit button...');
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        const btn = document.querySelector('.submit-btn') || document.querySelector('button');
        if (btn) btn.click();
      })()
    `
  });

  console.log('Waiting 5s for login redirect...');
  await new Promise(r => setTimeout(r, 5000));

  // Check current URL and location.hash
  const urlRes = await send('Runtime.evaluate', { expression: 'window.location.href' });
  console.log('Current URL after login:', urlRes.result?.value);

  // If not on index yet, navigate directly to #/pages/index/index
  if (!urlRes.result?.value?.includes('pages/index/index')) {
    console.log('Navigating explicitly to https://spotline888.org/#/pages/index/index');
    await send('Runtime.evaluate', { expression: 'window.location.hash = "#/pages/index/index"' });
    await new Promise(r => setTimeout(r, 5000));
  }

  const finalUrl = await send('Runtime.evaluate', { expression: 'window.location.href' });
  console.log('Final URL:', finalUrl.result?.value);

  // Take mobile screenshot
  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss1.result?.data) {
    fs.mkdirSync('docs/design-references/spotline888-org/pages-index-index', { recursive: true });
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-top.png', Buffer.from(ss1.result.data, 'base64'));
    console.log('Saved docs/design-references/spotline888-org/pages-index-index/mobile-top.png!');
  }

  // Scroll down to capture rest of the page
  console.log('Scrolling down...');
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 700)' });
  await new Promise(r => setTimeout(r, 1000));

  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss2.result?.data) {
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-middle.png', Buffer.from(ss2.result.data, 'base64'));
    console.log('Saved mobile-middle.png!');
  }

  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 1000)' });
  await new Promise(r => setTimeout(r, 1000));

  const ss3 = await send('Page.captureScreenshot', { format: 'png' });
  if (ss3.result?.data) {
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-bottom.png', Buffer.from(ss3.result.data, 'base64'));
    console.log('Saved mobile-bottom.png!');
  }

  // Full page height screenshot
  const metrics = await send('Page.getLayoutMetrics');
  const contentHeight = Math.ceil(metrics.result?.contentSize?.height || 2000);
  console.log('Page content height:', contentHeight);

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: contentHeight,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await new Promise(r => setTimeout(r, 1000));

  const ssFull = await send('Page.captureScreenshot', { format: 'png' });
  if (ssFull.result?.data) {
    fs.writeFileSync('docs/design-references/spotline888-org/pages-index-index/mobile-full.png', Buffer.from(ssFull.result.data, 'base64'));
    console.log('Saved mobile-full.png!');
  }

  // Dump DOM
  const domRes = await send('Runtime.evaluate', { expression: 'document.body.innerHTML' });
  fs.writeFileSync('scripts/index_rendered_dom.html', domRes.result?.value || '');

  // Save captured URLs
  fs.writeFileSync('scripts/index_network_urls.json', JSON.stringify(capturedUrls, null, 2));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

reconIndexPage().catch(console.error);
