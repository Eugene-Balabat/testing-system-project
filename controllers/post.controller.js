import ApiError from '../exceptions/api-error.js'
import Token from '../models/Token.js'
import User from '../models/User.js'
import Question from '../models/Question.js'
import Test from '../models/Test.js'
import userService from '../services/user-service.js'
import bcrypt from 'bcryptjs'
import Answer from '../models/Answer.js'
import Report from '../models/Report.js'
import testService from '../services/test-service.js'

//const bcrypt = require('bcryptjs/dist/bcrypt')

class PostController {
  async authUser(req, res, next) {
    try {
      const { email, password, remember } = req.body

      const userData = await userService.login(email, password, remember)

      res
        .cookie('refreshToken', userData.refreshToken, {
          sameSite: 'none',
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

      await Token.findOneAndDelete({ refresh: refreshToken })
      res.status(200).json('Деавторизация прошла успешно.')
    } catch (error) {
      next(error)
    }
  }

  async deleteTest(req, res, next) {
    try {
      const { id } = req.body

      if (!id) throw ApiError.BadRequest('Ошибка во время выполнения.')

      const resultT = await Test.findByIdAndDelete(id)
      if (!resultT) throw ApiError.BadRequest('Ошибка во время выполнения.')

      await Report.deleteMany({ testid: id })

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

  async removeUsers(req, res, next) {
    try {
      const { users } = req.body

      if (!users)
        throw ApiError.BadRequest(
          'Ошибка во время выполнения (данные не получены).'
        )

      for (const user of users) {
        const ownTests = await Test.find({ creator: user })

        await Token.findOneAndDelete({ user: user })
        await Report.deleteMany({ userid: user })
        await User.findByIdAndDelete(user)

        if (ownTests) {
          for (const test of ownTests) {
            await testService.delete(test)
          }
        }
      }

      res.status(200).json('Данные успешно удалены.')
    } catch (error) {
      next(error)
    }
  }

  async updateUsers(req, res, next) {
    try {
      const { users } = req.body
      console.log(users)

      if (!users)
        throw ApiError.BadRequest(
          'Ошибка во время выполнения (данные не получены).'
        )

      for (const user of users) {
        await User.updateOne(
          {
            _id: user._id
          },
          {
            $set: {
              surname: user.surname,
              username: user.username,
              patronymic: user.patronymic
            }
          }
        )
      }

      res.status(200).json('Данные успешно обновлены.')
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

export default new PostController()
