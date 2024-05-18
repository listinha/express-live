const express = require('express');
const process = require('node:process');

const app = express();

process.on('SIGINT', () => {
  // console.log('Received SIGINT. Press Control-D to exit.')
  process.exit();
});

app.get('/', (req, res) => {
  res.append('Cache-Control', 'no-store, no-cache');
  res.append('Set-Cookie', 'exp-live=true; Path=/; Secure');

  const hostHeader = req.get('host');

  var userName = 'anonymous';
  if (req.query.name) {
    userName = req.query.name
  }

  let content = `<p>Hello World, you are <strong>${userName}</strong>!</p>`;
  content += "<p>Best viewed in 800x600</p>";
  content += `<p>Requested host is <i>${hostHeader}</i></p>`;

  res.send(content);
});

app.listen(3000);
