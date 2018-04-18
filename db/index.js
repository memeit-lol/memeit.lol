const mongoose = require('mongoose')
const config = require('../config')
mongoose.connect(config.mongodb)

module.exports = {
  mod: require('./models/mod'), vote: require('./models/vote'), post: require('./models/post')
}
