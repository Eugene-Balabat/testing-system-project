const { Schema, model } = require('mongoose')

const roleSchema = new Schema({
  value: { type: String, unique: true, default: 'USER-S' }
})

module.exports = model('Role', roleSchema)
