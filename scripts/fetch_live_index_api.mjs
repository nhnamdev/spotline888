async function fetchIndexData() {
  const endpoints = [
    '/index/index',
    '/index/recconfig',
    '/index/goods',
    '/login/getSiteConfig',
    '/user/getUnreadCount'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`https://spotline888.org/api${ep}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)'
        }
      });
      console.log(`Endpoint: ${ep}, status: ${res.status}`);
      const data = await res.json();
      console.log(`Data for ${ep}:`, JSON.stringify(data).slice(0, 300));
      const fs = await import('fs');
      fs.writeFileSync(`scripts/api_${ep.replace(/\//g, '_')}.json`, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`Error on ${ep}:`, e.message);
    }
  }
}

fetchIndexData().catch(console.error);
