const mongoose = require('mongoose')

const targetSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  testid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Test' },
  dateclose: { type: Date, default: null },
  active: { type: Boolean, default: true }
})

module.exports = mongoose.model('Target', targetSchema)
