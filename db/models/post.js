const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: String,
  author: String,
  permlink: String,
  voted: {type: Boolean, default: false},
  hidden: {type: Boolean, default: true},
  img: String,
  time: {type: Date, default: Date.now}
})

mongoose.model('Post', postSchema)

module.exports = mongoose.model('Post')
