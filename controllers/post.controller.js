const ApiError = require('../exceptions/api-error')
const Token = require('../models/Token')
const User = require('../models/User')
const Question = require('../models/Question')
const Test = require('../models/Test')
const Group = require('../models/Group')
const userService = require('../services/user-service')

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
}

module.exports = new PostController()

// const group8 = new Group({
//   value: '11-A'
// })

// await group8.save()

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
