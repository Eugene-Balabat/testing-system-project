const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
  answer: { type: String, trim: true, required: true },
  true: { type: Boolean, default: false }
})

module.exports = mongoose.model('Answer', answerSchema)
