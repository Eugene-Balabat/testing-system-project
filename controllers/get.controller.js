const Test = require('../models/Test')
const User = require('../models/User')
const userService = require('../services/user-service')
const testService = require('../services/test-service')
const ApiError = require('../exceptions/api-error')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const Group = require('../models/Group')
const Report = require('../models/Report')
const Role = require('../models/Role')

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

  async getPersonalTestData(req, res, next) {
    try {
      const { testid, userid } = req.headers
      let active = null

      if (!testid || !userid)
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

      const report = await Report.findOne({ testid, userid })

      report ? (active = false) : (active = true)

      const testData = await testService.getTestData(testid)

      res.status(200).json({
        active,
        testData: {
          title: testData.title,
          description: testData.description,
          creator: testData.creator,
          items: [...testData.items]
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async getTestData(req, res, next) {
    try {
      const { testid } = req.headers

      if (!testid)
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

      const testData = await testService.getTestData(testid)

      res.status(200).json({
        ...testData
      })
    } catch (error) {
      next(error)
    }
  }

  async getTests(req, res, next) {
    try {
      const restests = []
      const resgroups = []
      const tests = await Test.find({})
      if (!tests) throw ApiError.NotFound()

      const now = new Date(Date.now())

      for (const test of tests) {
        for (const group of test.groups) {
          const candidat = await Group.findById(group)
          if (!resgroups.find(element => element.value === candidat.value))
            resgroups.push(candidat)
        }
        if (test.dateclose > now) restests.push({ test: test, active: true })
        else restests.push({ test: test, active: false })
      }

      res.status(200).json({ tests: [...restests], groups: [...resgroups] })
    } catch (error) {
      next(error)
    }
  }

  async getPersonalTests(req, res, next) {
    try {
      const { userid } = req.headers
      const resTests = []

      const user = await User.findById(userid)
      if (!user) throw ApiError.NotFound('Пользователь не найден.')

      const tests = await Test.find({})
      if (!tests) throw ApiError.NotFound()

      const now = new Date(Date.now())

      for (const element of tests) {
        if (element.groups.includes(user.group) && element.dateclose > now) {
          const report = await Report.findOne({
            testid: element._id,
            userid: user._id
          })
          if (report) resTests.push({ test: element, active: false })
          else resTests.push({ test: element, active: true })
        }
      }

      res.status(200).json({ tests: [...resTests] })
    } catch (error) {
      next(error)
    }
  }

  async getGroups(req, res, next) {
    try {
      const groups = await Group.find({})

      if (!groups) throw ApiError.NotFound()

      res.status(200).json({ groups: [...groups] })
    } catch (error) {
      next(error)
    }
  }

  async getRoles(req, res, next) {
    try {
      const roles = await Role.find({})

      if (!roles) throw ApiError.NotFound()

      res.status(200).json({ roles: [...roles] })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new GetController()
