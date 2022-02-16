const jwt = require('jsonwebtoken')
const { jwtKey } = require('../config/default.json')

const authMiddleware = (req, res, next) => {
  try {
    req.method === 'OPTIONS' && next()

    const token = req.headers.authorization.split(' ')[1] //Обработка полученной строки из headers
    if (!token)
      return res.status(403).json({ msg: 'Пользователь не авторизован' })

    const decodedData = jwt.verify(token, jwtKey)
    req.user = decodedData

    next()
  } catch (e) {
    res.status(403).json({ msg: 'Пользователь не авторизован' })
  }
}

module.exports = authMiddleware
