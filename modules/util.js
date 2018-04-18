module.exports.urlString = () => {
  let string = ''
  let allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 32; i++) {
    string += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length))
  }
  return string
}

module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.token && req.session.steemconnect) {
    let steem = require('./steemconnect')
    steem.setAccessToken(req.session.token)
    next()
  } else res.redirect('/')
}

module.exports.isMod = async (req, res, next) => {
  let mod = require('../db').mod
  if (req.session.steemconnect) {
    let is = await mod.find({steem: req.session.steemconnect.name, banned: false})
    if (is.length === 1) {
      return next()
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/')
  }
}
