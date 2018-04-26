let express = require('express')
let util = require('../modules/util')
let router = express.Router()
let db = require('../db')

/* GET users listing. */
router.get('/:feed', async (req, res, next) => {
  let posts
  if (req.params.feed === 'all') {
    posts = await db.post.find({}).sort({time: -1}).limit(10)
  } else if (req.params.feed === 'approved') {
    posts = await db.post.find({hidden: false}).sort({time: -1}).limit(10)
  } else {
    posts = []
  }
  if (res.logged) res.render('feed', {
    posts,
    logged: res.logged,
    mod: res.mod,
    num: 1,
    feed: req.params.feed,
    username: req.session.steemconnect.name
  })
  else res.render('feed', {
    posts,
    logged: res.logged,
    mod: res.mod,
    num: 1,
    feed: req.params.feed
  })
})

router.get('/:feed/:num', async (req, res, next) => {
  let posts
  if (req.params.feed === 'all') {
    posts = await db.post.find({}).sort({time: -1}).skip(req.params.num * 10).limit(10)
  } else if (req.params.feed === 'approved') {
    posts = await db.post.find({hidden: false}).sort({time: -1}).skip(req.params.num * 10).limit(10)
  } else {
    posts = []
  }
  if (res.logged) res.render('feed', {
    posts,
    logged: res.logged,
    mod: res.mod,
    num: req.params.num + 1,
    feed: req.params.feed,
    username: req.session.steemconnect.name
  })
  else res.render('feed', {
    posts,
    logged: res.logged,
    mod: res.mod,
    num: req.params.num + 1,
    feed: req.params.feed
  })
})

module.exports = router
