const bcrypt = require('bcryptjs/dist/bcrypt')
const User = require('../models/User')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')

class TokenService {
  async login(email, password) {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Ползователь с таким email не существует.')

    const isMatchPasswords = await bcrypt.compare(password, user.password)
    if (!isMatchPasswords) throw new Error('Неверный пароль.')

    const userDto = new UserDto(user) // id, email
    const tokens = tokenService.generateTokens({
      ...userDto
    })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }
}

module.exports = new TokenService()
