const bcrypt = require('bcryptjs/dist/bcrypt')
const User = require('../models/User')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class TokenService {
  async login(email, password) {
    const user = await User.findOne({ email })
    if (!user)
      throw ApiError.BadRequest('Ползователь с таким email не существует.')

    const isMatchPasswords = await bcrypt.compare(password, user.password)
    if (!isMatchPasswords) throw ApiError.BadRequest('Неверный пароль.')

    const userDto = new UserDto(user) // id, email
    const tokens = tokenService.generateTokens({
      ...userDto
    })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, userId: userDto.id }
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.UnauthorizedError()

    const userData = tokenService.validationRefreshToken(refreshToken)
    const dbToken = tokenService.findToken(refreshToken)

    if (!userData || !dbToken) throw ApiError.UnauthorizedError()

    const user = await User.findById(userData.payload.id)

    if (!user) throw ApiError.UnauthorizedError()

    const userDto = new UserDto(user) // id, email
    const tokens = tokenService.generateTokens({
      ...userDto
    })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens }
  }
}

module.exports = new TokenService()
