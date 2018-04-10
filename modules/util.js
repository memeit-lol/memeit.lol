var client = require('../db').client

module.exports.urlString = () => {
  let string = ''
  let allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 32; i++) {
    string += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length))
  }
  return string
}

module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.steemconnect) { return next() }

  res.redirect('/')
}

module.exports.isMod = (req, res, next) => {
  if (req.session.steemconnect) {
    client.query('SELECT ID FROM mods WHERE STEEM = \'' + req.session.steemconnect.name.replace(/"/g, '') + '\';').then(resp => {
      console.log(resp)
      if (resp.rowCount === 1) {
        return next()
      } else {
        res.redirect('/')
      }
    })
  } else {
    res.redirect('/')
  }
}
