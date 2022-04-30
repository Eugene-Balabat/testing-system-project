const bcrypt = require('bcryptjs/dist/bcrypt')
const User = require('../models/User')
const Role = require('../models/Role')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class TokenService {
  async login(email, password) {
    const user = await User.findOne({ email })
    const roles = []
    if (!user)
      throw ApiError.BadRequest('Ползователь с таким email не существует.')

    const isMatchPasswords = await bcrypt.compare(password, user.password)
    if (!isMatchPasswords) throw ApiError.BadRequest('Неверный пароль.')

    for (const id of user.roles) {
      const candidat = await Role.findById(id)
      if (candidat) roles.push(candidat.value)
    }

    const userDto = new UserDto(user) // id, email
    const tokens = tokenService.generateTokens({
      ...userDto
    })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: { id: userDto.id, roles: [...roles] } }
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.UnauthorizedError()

    const userData = tokenService.validationRefreshToken(refreshToken)
    const dbToken = tokenService.findToken(refreshToken)
    const roles = []

    if (!userData || !dbToken) throw ApiError.UnauthorizedError()

    const user = await User.findById(userData.payload.id)

    if (!user) throw ApiError.UnauthorizedError()

    for (const id of user.roles) {
      const candidat = await Role.findById(id)
      if (candidat) roles.push(candidat.value)
    }

    const userDto = new UserDto(user) // id, email
    const tokens = tokenService.generateTokens({
      ...userDto
    })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: {
        roles: [...roles],
        id: userDto.id,
        info: {
          name: user.username,
          surname: user.surname,
          patronymic: user.patronymic
        }
      }
    }
  }
}

module.exports = new TokenService()
