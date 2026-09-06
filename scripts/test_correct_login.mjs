async function testCorrectLoginPayload() {
  const payload = {
    account: 'Ak111',
    passwd: '123456',
    checkFree: true
  };

  console.log('Testing payload:', payload);

  const res = await fetch('https://spotline888.org/api/login/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log('Result:', data);
}

testCorrectLoginPayload().catch(console.error);
