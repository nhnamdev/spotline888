import { spawn } from 'child_process';
import fs from 'fs';

async function testInteractions() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\spotline888\\spotline888\\scripts\\chrome-profile-interact'
  ]);

  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9233/json/version');
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      break;
    } catch (e) {}
  }

  if (!wsUrl) {
    chromeProc.kill();
    return;
  }

  const createRes = await fetch('http://127.0.0.1:9233/json/new?http://localhost:3000', { method: 'PUT' });
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
  await send('Runtime.evaluate', {
    expression: "const el = document.querySelector('nextjs-portal'); if (el) el.style.display = 'none';"
  });

  // 1. Open announcement popup
  console.log('Clicking notice to open announcement modal...');
  await send('Runtime.evaluate', {
    expression: "document.getElementById('notice-banner-btn')?.click();"
  });
  await new Promise(r => setTimeout(r, 600));

  const ssModal = await send('Page.captureScreenshot', { format: 'png' });
  if (ssModal.result?.data) {
    fs.writeFileSync('scripts/local_notice_modal.png', Buffer.from(ssModal.result.data, 'base64'));
    console.log('Saved scripts/local_notice_modal.png');
  }

  // Close modal
  await send('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('确定'));
      if (btn) btn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // 2. Open Language Drawer
  console.log('Opening language drawer...');
  await send('Runtime.evaluate', {
    expression: `
      const globeBtn = document.querySelector('header button');
      if (globeBtn) globeBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const ssLang = await send('Page.captureScreenshot', { format: 'png' });
  if (ssLang.result?.data) {
    fs.writeFileSync('scripts/local_lang_drawer.png', Buffer.from(ssLang.result.data, 'base64'));
    console.log('Saved scripts/local_lang_drawer.png');
  }

  // Select Vietnamese
  console.log('Selecting Vietnamese...');
  await send('Runtime.evaluate', {
    expression: `
      const vnItem = Array.from(document.querySelectorAll('div')).find(d => d.textContent?.trim() === 'Tiếng Việt');
      if (vnItem) vnItem.click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const ssVn = await send('Page.captureScreenshot', { format: 'png' });
  if (ssVn.result?.data) {
    fs.writeFileSync('scripts/local_vietnamese_index.png', Buffer.from(ssVn.result.data, 'base64'));
    console.log('Saved scripts/local_vietnamese_index.png');
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

testInteractions().catch(console.error);
