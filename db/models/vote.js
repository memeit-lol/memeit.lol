const mongoose = require('mongoose')

const voteSchema = mongoose.Schema({
  mod: String,
  post: String,
  approved: Boolean,
  time: {type: Date, default: Date.now}
})

mongoose.model('Vote', voteSchema)

module.exports = mongoose.model('Vote')
