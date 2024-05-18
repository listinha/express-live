const express = require('express');
const process = require('node:process');
const { inspect } = require('node:util');
const pg = require('pg');

if (process.env.NODE_ENV === 'production') {
  var pgOptions = {
    ssl: {
      rejectUnauthorized: false
    },
  }
} else {
  var pgOptions = { database: 'express_live' };
}

const client = new pg.Client(pgOptions);

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

  let content = `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Todo List</title>
      <style type="text/css">
      .todo_list {
        padding: 0px;
      }
      .todo_list li {
        list-style-type: none;
      }
      </style>
    </head>
    <body>
  `;

  content += `<p>Hello World, you are <strong>${userName}</strong>!</p>`;
  content += "<p>Best viewed in 800x600</p>";
  content += `<p>Requested host is <i>${hostHeader}</i></p>`;

  content += '<ul class="todo_list">';
  const result = await client.query('SELECT id, description, status FROM items;');
  for (let row of result.rows) {
    const status = (row.status === 1 ? '⚫️' : '☑️');

    content += `<li>${status} ${row.description}</li>`;
  }
  content += "</ul>";

  content += `
    </body>
  </html>`;

  res.send(content);
});

app.listen(3000);
