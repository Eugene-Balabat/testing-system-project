const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const Token = require('../models/Token')

class TokenService {
  generateTokens(payload) {
    const accesToken = jwt.sign({ payload }, config.accesKey, {
      expiresIn: '10d'
    })
    const refreshToken = jwt.sign({ payload }, config.refreshKey, {
      expiresIn: '15d'
    })

    return { accesToken, refreshToken }
  }

  validationAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, config.accesKey)
      return userData
    } catch (error) {
      return null
    }
  }

  async findToken(refreshToken) {
    const dbToken = await Token.findOne({ refreshToken })
    return dbToken
  }

  validationRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, config.refreshKey)
      return userData
    } catch (error) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ user: userId })
    if (tokenData) {
      tokenData.refresh = refreshToken
      return tokenData.save()
    }
    const token = await Token.create({ user: userId, refresh: refreshToken })
    return token
  }
}

module.exports = new TokenService()
