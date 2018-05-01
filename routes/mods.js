let express = require('express')
let util = require('../modules/util')
let router = express.Router()
let db = require('../db')

router.get('/', util.isMod, async (req, res, next) => {
  let posts = await db.Post.find({time: {$gt: Date.now() - 86400000}, votes: {$not: {$elemMatch: {mod: req.session.steemconnect.name}}}, author: {$ne: req.session.steemconnect.name}})
  posts = posts.sort(function (a, b) { return 0.5 - Math.random() })
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

router.post('/vote', util.isMod, async function (req, res) {
  let post = req.body.post
  let author = post.split('/')[0]
  if (author === req.session.steemconnect.name) {
    res.sendStatus(403)
  } else {
    let permlink = post.split('/')[1]
    let vote = req.body.value
    let Post = await db.Post.findOne({author, permlink})
    let hidden
    if (Post.score === undefined) {
      hidden = !(vote > 0)
    } else {
      hidden = !(Post.score + vote > 0)
    }
    switch (vote) {
      case 0:
        db.Post.findOneAndUpdate({author, permlink}, {hidden, $push: {votes: {mod: req.session.steemconnect.name, approved: vote}}}).exec()
        break
      default:
        db.Post.findOneAndUpdate({author, permlink}, {hidden, $inc: {score: vote}, $push: {votes: {mod: req.session.steemconnect.name, approved: vote}}}).exec()
        break
    }
    let mods = await db.Mod.find({steem: req.session.steemconnect.name})
    if (mods.length > 0) db.Mod.findOneAndUpdate({steem: req.session.steemconnect.name}, {$inc: {votes: 1}}).exec()
    else new db.Mod({steem: req.session.steemconnect.name, votes: 0}).save()
    res.sendStatus(200)
  }
})

module.exports = router
