const express = require('express')
const config = require('config')

const app = express()

const port = process.env.PORT || config.get('port') || 5000

async function start() {
  try {
    //await mongoose.connect(config.get('mongoUri'))
    app.listen(port, () => {
      console.log(`Server is working on ${port} port...`)
    })
  } catch (e) {
    console.log('Server errror:', e.message)
    process.exit(1)
  }
}

start()
