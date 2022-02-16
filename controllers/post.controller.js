const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/default.json')
const Token = require('../models/Token')
const tokenService = require('../services/token-service')
const UserDto = require('../dtos/user-dto')
const userService = require('../services/user-service')

class PostController {
  async authUser(req, res) {
    try {
      const { email, password } = req.body

      const userData = await userService.login(email, password)

      res
        .cookie('refreshToken', userData.refreshToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
          secure: true
        })
        .json({ accesToken: userData.accesToken, user: userData.user })
    } catch (error) {
      res
        .status(500)
        .json({ error: { msg: 'Ошибка во время запроса: ' + error.message } })
    }
  }

  async refresh(req, res) {
    const { refreshToken } = req.cookies
  }
}

module.exports = new PostController()

// const role = await Role.findOne({ value: 'USER' })

// const hashedPassword = await bcrypt.hash('10839983', 7)

// const user = new User({
//   email: 'eugene.balabat@gmail.com',
//   password: hashedPassword,
//   username: 'Евгений',
//   surname: 'Балабат',
//   patronymic: 'Дмитриевич',
//   roles: [role._id]
// })

// await user.save()
