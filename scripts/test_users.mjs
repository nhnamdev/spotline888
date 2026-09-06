async function test() {
  for (const u of ['ak111', 'AK111', 'Ak111', 'admin', 'test']) {
    const res = await fetch('https://spotline888.org/api/login/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: '123456' })
    });
    const d = await res.json();
    console.log(`User: ${u} =>`, d);
  }
}
test();
