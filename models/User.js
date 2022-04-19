const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  username: { type: String, required: true, trim: true },
  surname: { type: String, trim: true, required: true },
  patronymic: { type: String, trim: true, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
})

module.exports = mongoose.model('User', userSchema)
