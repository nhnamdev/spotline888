import https from 'https';
import fs from 'fs';

const url = 'https://spotline888.org/static/js/pages-login-register.63f304f2.js';

https.get(url, (res) => {
  console.log('Status code:', res.statusCode);
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('scripts/register.chunk.js');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded register.chunk.js successfully!');
    });
  } else {
    console.error('Failed with status:', res.statusCode);
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
