const express = require('express');
const process = require('node:process');
const { inspect } = require('node:util');
const { Client } = require('pg');
// import pg from 'pg'
// const { Client } = pg

const client = new Client({
  // user: 'database-user',
  // password: 'secretpassword!!',
  // host: 'my.database-server.com',
  // port: 5334,
  // database: 'express_live',
});

(async function() {
  console.log('Connecting to DB...');
  await client.connect();

  const result = await client.query('SELECT count(*) as c FROM items;');
  const count = result.rows[0].c;

  console.log(`DB Connection established. Got ${count} items.`);
})();

const app = express();

process.on('SIGINT', () => {
  // console.log('Received SIGINT. Press Control-D to exit.')
  process.exit();
});

app.get('/', async (req, res) => {
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

  content += "<ul>";
  const result = await client.query('SELECT id, description, status FROM items;');
  for (let row of result.rows) {
    content += `<li>${row.description}</li>`;
  }
  content += "</ul>";

  res.send(content);
});

app.listen(3000);
