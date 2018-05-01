const mongoose = require('mongoose')
const config = require('../config')
mongoose.connect(config.mongodb)

module.exports = {
  Mod: require('./models/mod'), Post: require('./models/post')
}
