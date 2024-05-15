const express = require('express')
const process = require('node:process')

const app = express()

process.on('SIGINT', () => {
  // console.log('Received SIGINT. Press Control-D to exit.')
  process.exit()
})

app.get('/', function (req, res) {
  res.append('Cache-Control', 'no-store, no-cache')
  res.append('Set-Cookie', 'exp-live=true; Path=/; Secure')

  var userName = 'anonymous'
  if (req.query.name) {
    userName = req.query.name
  }

  res.send(`Hello World, you are <strong>${userName}</strong>!`)
})

app.listen(3000)
