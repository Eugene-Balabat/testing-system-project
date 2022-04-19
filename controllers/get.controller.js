const Test = require('../models/Test')
const User = require('../models/User')
const userService = require('../services/user-service')
const ApiError = require('../exceptions/api-error')
const Question = require('../models/Question')

class GetController {
  async getUsers(req, res, next) {
    try {
      const users = await User.find()
      if (!users)
        return res
          .status(500)
          .json({ error: { msg: 'Пользователи не найдены. ' } })

      res.json(users)
    } catch (error) {
      next(error)
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const userData = await userService.refresh(refreshToken)

      res
        .cookie('refreshToken', userData.refreshToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
          secure: true
        })
        .json({ accesToken: userData.accesToken, user: userData.user })
    } catch (error) {
      console.log(error.payload)
      next(error)
    }
  }

  async getTestData(req, res, next) {
    try {
      const { testid } = req.headers
      const questions = []

      const testData = await Test.findById(testid)
      if (!testData) throw ApiError.NotFound()

      for (const element of testData.questions) {
        const candidat = await Question.findById(element)
        if (candidat) questions.push(candidat)
      }

      res.status(200).json([...questions])
    } catch (error) {
      next(error)
    }
  }

  async getTests(req, res, next) {
    try {
      const tests = await Test.find({})
      if (!tests) throw ApiError.NotFound()

      res.status(200).json({ tests: [...tests] })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new GetController()
