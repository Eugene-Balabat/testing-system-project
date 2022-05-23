const Test = require('../models/Test')
const User = require('../models/User')
const userService = require('../services/user-service')
const testService = require('../services/test-service')
const ApiError = require('../exceptions/api-error')
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

  async getPersonalReportData(req, res, next) {
    try {
      const { reportid } = req.headers

      if (!reportid)
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

      const report = await Report.findById(reportid)
      if (!report) throw ApiError.NotFound('Не найден отчет по данному тесту.')

      const test = await Test.findById(report.testid)
      if (!test) throw ApiError.NotFound('Данные теста не найдены.')

      const user = await User.findById(report.userid)
      if (!user)
        throw ApiError.NotFound(
          'Пользователь, связанный с данным тестом - отсутсвтует.'
        )

      const group = await Group.findById(user.group)
      if (!group)
        throw ApiError.NotFound(
          'Группа, для которой был создан тест не найдена.'
        )

      res.status(200).json({
        user: {
          name: user.username,
          surname: user.surname,
          patronymic: user.patronymic,
          group: group.value
        },
        reportData: report.data,
        testData: { title: test.title, description: test.description },
        date: report.date
      })
    } catch (error) {
      next(error)
    }
  }

  async getRemoveUserData(req, res, next) {
    try {
      const { userroles } = req.headers
      const resData = []

      if (!userroles)
        throw ApiError.BadRequest('Ошибка во время получения данных.')

      if (!userroles.includes('ADMIN'))
        throw ApiError.BadRequest(
          'Прав доступа недостаточно для осуществления операции.'
        )

      const rolesDB = await Role.find({})
      if (!rolesDB)
        throw ApiError.BadRequest(
          'Ошибка во время выполнения запроса (Роли не найдены).'
        )

      const groupsDB = await Group.find({})
      if (!groupsDB)
        throw ApiError.BadRequest(
          'Ошибка во время выполнения запроса (Группы не найдены).'
        )

      const usersDB = await User.find()
      if (!usersDB)
        throw ApiError.BadRequest(
          'Ошибка во время выполнения запроса (Пользователи не найдены).'
        )

      for (const group of groupsDB) {
        const users = await User.find({ group: group._id })
        if (users && users.length) resData.push({ item: group, users })
      }

      for (const role of rolesDB) {
        if (role.value !== 'USER-S') {
          const users = []

          for (const user of usersDB) {
            if (user.roles.includes(role._id)) users.push(user)
          }
          if (users.length) resData.push({ item: role, users })
        }
      }

      res.status(200).json([...resData])
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

  async getTestResults(req, res, next) {
    try {
      const { testid } = req.headers

      const resGroups = []
      const resReports = []

      if (!testid)
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

      const test = await Test.findById(testid)
      const reports = await Report.find({ testid })

      if (!test) throw ApiError.BadRequest('Данные теста не найдены.')

      for (const id of test.groups) {
        const group = await Group.findById(id)
        if (group) resGroups.push(group)
      }

      if (!resGroups.length) {
        await testService.delete(test)
        throw ApiError.BadRequest(
          'Тест не предназначался ни для одной из групп.'
        )
      }

      if (reports) {
        for (const report of reports) {
          const user = await User.findById(report.userid)

          if (!user) await Report.findByIdAndDelete(report._id)
          else {
            const group = await Group.findById(user.group)

            if (!group) await Report.findByIdAndDelete(report._id)
            else {
              const data = testService.getAnswerData(report)

              resReports.push({
                user: {
                  name: user.username,
                  surname: user.surname,
                  patronymic: user.patronymic
                },
                group: group._id,
                data: { ...data, id: report._id },
                date: report.date
              })
            }
          }
        }
      }

      res.status(200).json({ groups: [...resGroups], reports: [...resReports] })
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
