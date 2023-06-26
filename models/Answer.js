import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  answer: { type: String, trim: true, required: true },
  true: { type: Boolean, default: false }
})

export default mongoose.model('Answer', answerSchema)
