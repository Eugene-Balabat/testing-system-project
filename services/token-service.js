import jwt from 'jsonwebtoken'
import config from '../config/default.json' assert { type: 'json' }
import Token from '../models/Token.js'

class TokenService {
  generateTokens(payload) {
    const accesToken = jwt.sign({ payload }, config.accesKey, {
      expiresIn: payload.remember ? '24h' : '2h'
    })
    const refreshToken = jwt.sign({ payload }, config.refreshKey, {
      expiresIn: payload.remember ? '30d' : '24h'
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
    try {
      const dbToken = await Token.findOne({ refreshToken })
      return dbToken
    } catch (error) {
      return null
    }
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

export default new TokenService()
