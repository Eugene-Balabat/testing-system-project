const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token-service')

const authMiddleware = async (req, res, next) => {
  try {
    req.method === 'OPTIONS' && next()

    const token = req.headers.authorization.split(' ')[1] //Обработка полученной строки из headers
    if (!token) return next(ApiError.UnauthorizedError())

    const userData = await tokenService.validationAccessToken(token)
    if (!userData) return next(ApiError.UnauthorizedError())

    req.user = userData
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}

module.exports = authMiddleware
