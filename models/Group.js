const { Schema, model } = require('mongoose')

const groupSchema = new Schema({
  value: { type: String, unique: true }
})

module.exports = model('Group', groupSchema)
