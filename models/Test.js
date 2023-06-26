import mongoose from 'mongoose'

const testSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  dateclose: { type: Date, default: null },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
})

export default mongoose.model('Test', testSchema)
