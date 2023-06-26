import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import errorMiddleware from './middlewares/error-middleware.js'
import getRoutes from './routes/get.routes.js'
import postRoutes from './routes/post.routes.js'
//const errorMiddleware = require('./middlewares/error-middleware.cjs')

const app = express()

const port = process.env.PORT || config.get('port') || 5000

var allowlist = [
  'http://localhost:3000',
  'https://test-service-app.herokuapp.com'
]
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
app.use(cookieParser())
app.use(cors(corsOptionsDelegate))

//app.use('/api/get', cookieParser(), require('./routes/get.routes'))
app.use('/api/get', cookieParser(), getRoutes)
app.use('/api/post', cookieParser(), postRoutes)
//app.use('/api/post', cookieParser(), require('./routes/post.routes'))

app.use(errorMiddleware)

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'))
    mongoose.set('debug', true)

    app.listen(port, () => {
      console.log(`Server is working on ${port} port...`)
    })
  } catch (e) {
    console.log('Server errror:', e.message)
    process.exit(1)
  }
}

start()
