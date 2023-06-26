import ApiError from '../exceptions/api-error.js'
import tokenService from '../services/token-service.js'

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

export default authMiddleware
