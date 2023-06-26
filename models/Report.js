import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  testid: { type: mongoose.Schema.Types.ObjectId, required: true },
  userid: { type: mongoose.Schema.Types.ObjectId, required: true },
  data: [{ type: Object, required: true }],
  date: { type: Date, default: Date.now }
})

export default mongoose.model('Report', reportSchema)
