let express = require('express')
let util = require('../modules/util')
let router = express.Router()
let client = require('../db').client

router.get('/', util.isMod, (req, res, next) => {
  client.query('SELECT * FROM POSTS WHERE VOTED = false;').then((resp) => {
    if (resp.rowCount > 0) {
      res.render('mod', {
        posts: resp.rows
      })
    } else {
    }
  })
})

module.exports = router
