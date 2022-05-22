const ApiError = require('../exceptions/api-error')
const Test = require('../models/Test')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const Group = require('../models/Group')
const Report = require('../models/Report')

class TestService {
  async getTestData(id) {
    const questions = []
    const resGroups = []

    const data = await Test.findById(id)
    if (!data) throw ApiError.BadRequest('Данные теста не были найдены.')

    const groups = await Group.find({})
    if (!groups)
      throw ApApiError.BadRequest(
        'Не были надены группы, которые связаны с тестом.'
      )

    for (const group of groups) {
      if (data.groups.includes(group._id))
        resGroups.push({ data: group, active: true })
      else resGroups.push({ data: group, active: false })
    }

    for (const question of data.questions) {
      const candidatQ = await Question.findById(question)
      if (candidatQ) {
        const answers = []
        for (const answer of candidatQ.answers) {
          const candidatA = await Answer.findById(answer)
          if (candidatA) answers.push(candidatA)
        }
        questions.push({
          question: candidatQ,
          answers: [...answers]
        })
      }
    }

    return {
      title: data.title,
      description: data.description,
      closeDate: data.dateclose,
      creator: data.creator,
      groups: [...resGroups],
      items: [...questions]
    }
  }

  async delete(testdata) {
    await Test.findByIdAndDelete(testdata._id)
    await Report.deleteMany({ testid: testdata._id })

    await this.deleteTestData([...testdata.questions])
  }

  checkMistakes(item) {
    for (const answer of item.answers) {
      if (item.singleAnswer) {
        if (answer.true && !answer.checked) {
          return true
        }
      } else {
        if (
          (answer.true && !answer.checked) ||
          (!answer.true && answer.checked)
        )
          return true
      }
    }
    return false
  }

  getAnswerData(report) {
    let correct = 0
    let uncorrect = 0

    for (const item of report.data) {
      this.checkMistakes(item) ? (uncorrect += 1) : (correct += 1)
    }

    return { correct, uncorrect }
  }

  async deleteTestData(questions) {
    for (const idQ of questions) {
      const question = await Question.findById(idQ)

      for (const idA of question.answers) {
        await Answer.findByIdAndDelete(idA)
      }
      await Question.findByIdAndDelete(question._id)
    }
  }
}

module.exports = new TestService()
