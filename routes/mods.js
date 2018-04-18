let express = require('express')
let util = require('../modules/util')
let router = express.Router()
let db = require('../db')

router.get('/', util.isMod, async (req, res, next) => {
  let posts = await db.post.find({voted: false})
  if (posts.length > 0) {
    res.render('mod', {
      posts,
      logged: res.logged,
      mod: res.mod,
      username: req.session.steemconnect.name
    })
  } else {
    res.render('none', {
      logged: res.logged,
      mod: res.mod,
      username: req.session.steemconnect.name
    })
  }
})

router.post('/vote', util.isMod, function (req, res) {
  let post = req.body.post
  let author = post.split('/')[0]
  let permlink = post.split('/')[1]
  let vote = req.body.value
  new db.vote({
    mod: req.session.steemconnect.name,
    post,
    approved: vote
  }).save()
  db.post.findOneAndUpdate({author, permlink}, {voted: true, hidden: !vote}).exec()
  db.mod.findOneAndUpdate({steem: req.session.steemconnect.name}, {$inc: {votes: 1}}).exec()
  res.sendStatus(200)
})

module.exports = router
