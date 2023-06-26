import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
  value: { type: String, unique: true }
})

export default mongoose.model('Group', groupSchema)
