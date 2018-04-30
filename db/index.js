const mongoose = require('mongoose')
const config = require('../config')
mongoose.connect(config.mongodb)

module.exports = {
  mod: require('./models/mod'), post: require('./models/post')
}
