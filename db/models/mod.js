const mongoose = require('mongoose')

let modSchema = mongoose.Schema({
  steem: String,
  banned: {type: Boolean, default: false},
  votes: {type: Number, default: 0}
})

mongoose.model('Mod', modSchema)

module.exports = mongoose.model('Mod')
