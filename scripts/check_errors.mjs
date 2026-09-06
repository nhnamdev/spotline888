import { spawn } from 'child_process';

async function checkErrors() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Hi\\Desktop\\spotline888\\spotline888\\scripts\\chrome-profile-err'
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

  const createRes = await fetch('http://127.0.0.1:9233/json/new?http://localhost:3000', { method: 'PUT' });
  const target = await createRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      ws.send(JSON.stringify({ id: msgId, method, params }));
      resolve();
    });
  }

  await new Promise(resolve => ws.onopen = resolve);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[Console]', data.params.type, data.params.args?.map(a => a.value));
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('[Exception]', data.params.exceptionDetails);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 4000));

  // Check if tailwind stylesheet is loaded
  const styles = await new Promise((resolve) => {
    const msgId = id++;
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === msgId) resolve(d.result?.result?.value);
    };
    ws.send(JSON.stringify({
      id: msgId,
      method: 'Runtime.evaluate',
      params: {
        expression: `
          Array.from(document.styleSheets).map(s => {
            try { return s.cssRules.length; } catch(e) { return e.message; }
          })
        `,
        returnByValue: true
      }
    }));
  });

  console.log('Stylesheets rules count:', styles);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

checkErrors().catch(console.error);
