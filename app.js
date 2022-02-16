const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error-middleware')

const app = express()

const port = process.env.PORT || config.get('port') || 5000

var allowlist = ['http://localhost:3000']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: true,
      credentials: true,
      methods: ['GET', 'PUT', 'POST']
    } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false, credentials: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(express.json({ extended: true }))
app.use(cors(corsOptionsDelegate))
app.use(cookieParser())
app.use(errorMiddleware)

app.use('/api/get', require('./routes/get.routes'))
app.use('/api/post', require('./routes/post.routes'))

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'))
    app.listen(port, () => {
      console.log(`Server is working on ${port} port...`)
    })
  } catch (e) {
    console.log('Server errror:', e.message)
    process.exit(1)
  }
}

start()
