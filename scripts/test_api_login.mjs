async function testLoginApi() {
  const res = await fetch('https://spotline888.org/api/login/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    },
    body: JSON.stringify({
      username: 'Ak111',
      password: '123456'
    })
  });

  const headers = Object.fromEntries(res.headers.entries());
  console.log('Status:', res.status);
  console.log('Headers:', headers);
  const data = await res.json();
  console.log('Data:', data);
}

testLoginApi().catch(console.error);
