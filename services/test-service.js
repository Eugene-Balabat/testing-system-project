const ApiError = require('../exceptions/api-error')
const Test = require('../models/Test')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const Group = require('../models/Group')

class TestService {
  async getTestData(id) {
    const questions = []
    const resGroups = []

    const data = await Test.findById(id)
    if (!data) throw ApiError.NotFound()

    const groups = await Group.find({})
    if (!groups) throw ApApiError.NotFound()

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
