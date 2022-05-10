const ApiError = require('../exceptions/api-error')
const Token = require('../models/Token')
const User = require('../models/User')
const Question = require('../models/Question')
const Test = require('../models/Test')
const Group = require('../models/Group')
const userService = require('../services/user-service')
const bcrypt = require('bcryptjs/dist/bcrypt')
const Answer = require('../models/Answer')
const Report = require('../models/Report')
const Role = require('../models/Role')
const testService = require('../services/test-service')

class PostController {
  async authUser(req, res, next) {
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
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const result = await Token.findOneAndDelete({ refresh: refreshToken })
      if (!result) throw ApiError.BadRequest('Данные токена не найдены.')

      res.status(200).json('Деавторизация прошла успешно.')
    } catch (error) {
      next(error)
    }
  }

  async deleteTest(req, res, next) {
    try {
      const { id } = req.body

      if (!id) throw ApiError.BadRequest('Ошибка во время выполнения.')

      await Report.deleteMany({ testid: id })

      const resultT = await Test.findByIdAndDelete(id)
      if (!resultT) throw ApiError.BadRequest('Ошибка во время выполнения.')

      for (const question of resultT.questions) {
        const resultQ = await Question.findByIdAndDelete(question._id)
        if (resultQ) {
          for (const answer of resultQ.answers) {
            await Answer.findByIdAndDelete(answer._id)
          }
        }
      }

      res.status(200).json('Данные успешно удалены.')
    } catch (error) {
      next(error)
    }
  }

  async setNewUser(req, res, next) {
    try {
      const { surname, name, patronymic, email, password, group, roles } =
        req.body

      if (
        !surname ||
        !name ||
        !patronymic ||
        !email ||
        !password ||
        !roles.length
      )
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

      const candidate = await User.findOne({ email })
      if (candidate)
        throw ApiError.Conflict('Пользователь с таким email уже существует.')

      const hashedPassword = await bcrypt.hash(password, 8)

      await userService.sendMail(email, password)

      const user = await User.create({
        email,
        password: hashedPassword,
        username: name,
        surname,
        patronymic,
        group: group && group,
        roles: [...roles]
      })
      if (!user)
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

      res.status(200).json('Пользователь создан.')
    } catch (error) {
      next(error)
    }
  }

  async setNewTest(req, res, next) {
    try {
      const { title, description, dateclose, creator, groups, questions } =
        req.body
      const questionsDB = []

      if (
        !title ||
        !description ||
        !dateclose ||
        !creator ||
        !groups.length ||
        !questions.length
      )
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

      const dateNow = new Date(Date.now())
      dateNow.setTime(dateNow)

      for (const question of questions) {
        const answersDB = []

        for (const answer of question.answers) {
          const resultA = await Answer.create({
            answer: answer.text,
            true: answer.true
          })
          answersDB.push(resultA._id)
        }

        if (!answersDB.length)
          throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

        const resultQ = await Question.create({
          title: question.question,
          singleAnswer: question.singleAnswer,
          answers: [...answersDB]
        })
        questionsDB.push(resultQ._id)
      }

      if (!questionsDB.length)
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')

      const resultT = await Test.create({
        title,
        description,
        date: dateNow,
        dateclose: new Date(dateclose),
        creator,
        groups,
        questions: [...questionsDB]
      })

      if (!resultT) {
        await testService.deleteTestData([...questionsDB])
        throw ApiError.BadRequest('Ошибка во время выполнения запроса.')
      }

      res.status(200).json('Данные добавлены')
    } catch (error) {
      next(error)
    }
  }

  async setReport(req, res, next) {
    try {
      const { testid, userid, data } = req.body

      if (!testid || !userid || !data)
        throw ApiError.BadRequest('Ошибка получения данных')

      const report = await Report.findOne({ testid, userid })
      if (report) throw ApiError.Conflict('Тест уже пройден.')

      const date = new Date(Date.now())
      date.setTime(date)

      const result = await Report.create({
        testid,
        userid,
        data,
        date
      })

      if (!result)
        throw ApiError.BadRequest('Ошибка во время выполнения запроса')

      res.status(200).json('Данные добавлены')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new PostController()

// const role = await Role.findOne({ value: 'USER' })

// const hashedPassword = await bcrypt.hash('10839983', 7)
// const user = new User({
//   email: 'admin@mail.ru',
//   password: hashedPassword,
//   username: 'Евгений',
//   surname: 'Балабат',
//   patronymic: 'Дмитриевич',
//   roles: ['6209750711b33383509d12c3'],
//   group: '6259a4349e05916246c64582'
// })

// await user.save()

// const ans = new Answer({
//   answer: 'Na2SO4'
// })

// await ans.save()

// const terget = new Target({
//   userid: '626062ef52c4983be64a9b28',
//   testid: '62587afba6c23134b0d59119'
// })

// await terget.save()

// const group8 = new Group({
//   value: '11-A'
// })

// await group8.save()

// const role = await Role.findOne({ value: 'USER' })

// const hashedPassword = await bcrypt.hash('10839983', 7)
// const user = new User({
//   email: 'djek1099@mail.ru',
//   password: hashedPassword,
//   username: 'Евгений',
//   surname: 'Балабат',
//   patronymic: 'Дмитриевич',
//   roles: ['6209750711b33383509d12c3'],
//   group: '6259a4349e05916246c64582'
// })

// await user.save()

// const mass_id = [
//   '6258817427df7804bdc95c6f',
//   '6258817427df7804bdc95c6d',
//   '6258817427df7804bdc95c6e'
// ]
// const questions = []

// for (const element of mass_id) {
//   const result = await Question.findById(element).exec()
//   if (result) questions.push(result._id)
// }

// const test = new Test({
//   title: 'Тест по химии.',
//   description: 'Тест по химии  для студентов 1 курса.',
//   questions: [...questions]
// })

// test.save()

// const question1 = new Question({
//   title:
//     'Определите, у атомов каких из указанных в ряду элементов в основном состоянии отсутствуют неспаренные электроны. ',
//   singleAnswer: false,
//   answers: ['Si', 'S', 'F', 'Zn', 'Ar']
// })
// const question2 = new Question({
//   title:
//     'з числа указанных в ряду элементов выберите два элемента, которые в составе образованных ими анионов с общей формулой ЭOx2- – могут иметь одинаковую степень окисления',
//   singleAnswer: false,
//   answers: ['Si', 'S', 'F', 'Zn', 'Ar']
// })
// const question3 = new Question({
//   title:
//     'Из предложенного перечня выберите два вещества молекулярного строения с ковалентной полярной связью.',
//   singleAnswer: false,
//   answers: ['Na2SO4', 'HCOOH', 'CH4', 'CaO', 'Cl2']
// })
// await question3.save()
// await question1.save()
// await question2.save()
