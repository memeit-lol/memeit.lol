let steemconnect2 = require('sc2-sdk')
let config = require('../package.json').config

let steem = steemconnect2.Initialize({
  app: config.auth.client_id,
  callbackURL: config.testing === false ? config.auth.redirect_uri : 'http://localhost:3000/auth/',
  scope: ['login', 'vote', 'comment', 'comment_options']
})

module.exports = steem
