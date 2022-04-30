const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  testid: { type: mongoose.Schema.Types.ObjectId, required: true },
  userid: { type: mongoose.Schema.Types.ObjectId, required: true },
  data: [{ type: Object, required: true }],
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Report', reportSchema)
