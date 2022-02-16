const jwt = require('jsonwebtoken')
const config = require('../config/default.json')
const Token = require('../models/Token')

class TokenService {
  generateTokens(payload) {
    const accesToken = jwt.sign({ payload }, config.accesKey, {
      expiresIn: '30m'
    })
    const refreshToken = jwt.sign({ payload }, config.refreshKey, {
      expiresIn: '30d'
    })

    return { accesToken, refreshToken }
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

  async refresh(refreshToken) {}
}

module.exports = new TokenService()
