const express = require('express')
const path = require('path')

const app = express()

const port = process.env.PORT || 3000

app.use(express.static(__dirname))
//app.use(express.static(path.resolve(__dirname, 'build')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

async function start() {
  try {
    app.listen(port)
  } catch (e) {
    console.log('Server errror:', e.message)
    process.exit(1)
  }
}

start()
