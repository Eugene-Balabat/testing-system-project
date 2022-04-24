const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
})

module.exports = mongoose.model('Test', testSchema)