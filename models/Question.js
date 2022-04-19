const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  singleAnswer: { type: Boolean, required: true },
  answers: [{ type: String, trim: true }]
})

module.exports = mongoose.model('Question', questionSchema)
