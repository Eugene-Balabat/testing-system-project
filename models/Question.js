import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  singleAnswer: { type: Boolean, required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
})

export default mongoose.model('Question', questionSchema)
