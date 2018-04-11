let express = require('express')
let util = require('../modules/util')
let steem = require('../modules/steemconnect')
let delegator = require('../modules/delegators')
let router = express.Router()
let fs = require('fs')
let db = require('../db')

router.get('/', util.isAuthenticated, (req, res, next) => {
  var images
  try {
    images = fs.readdirSync('../memes')
  } catch (err) {
    images = []
  }
  res.render('post', {
    name: req.session.steemconnect.name,
    images
  })
})

router.post('/create-post', util.isAuthenticated, (req, res) => {
  var images
  try {
    images = fs.readdirSync('../memes')
  } catch (err) {
    images = []
  }
  let author = req.session.steemconnect.name
  let permlink = util.urlString()
  var tags = req.body.tags.split(',').map(item => item.trim())
  let primaryTag = 'memeitlol'
  let otherTags = tags.slice(0, 4)
  let title = req.body.title
  let done = false
  db.client.query(db.post(title, author, permlink, `https://memeit.lol/photos/images/${req.body.image}`))
  delegator.getWeights('memeit.lol', function (data) {
    if (!done) {
      let ben = []
      for (let key in data) {
        ben.push({'account': key, 'weight': data[key]})
      }
      console.log([['comment', {'parent_author': '', 'parent_permlink': primaryTag, 'author': author, 'permlink': permlink, 'title': title, 'body': `<img src="https://memeit.lol/photos/images/${req.body.image}" />`, 'json_metadata': JSON.stringify({app: 'memeit.lol/0.0.1', tags: [primaryTag, ...otherTags], image: ['https://memeit.lol/photos/images/' + req.body.image]})}], ['comment_options', {'author': author, 'permlink': permlink, 'max_accepted_payout': '1000000.000 SBD', 'percent_steem_dollars': 10000, 'allow_votes': true, 'allow_curation_rewards': true, 'extensions': [[0, {'beneficiaries': ben}]]}]])
      steem.broadcast([['comment', {'parent_author': '', 'parent_permlink': primaryTag, 'author': author, 'permlink': permlink, 'title': title, 'body': `<img src="https://memeit.lol/photos/images/${req.body.image}" />`, 'json_metadata': JSON.stringify({app: 'memeit.lol/0.0.1', tags: [primaryTag, ...otherTags], image: ['https://memeit.lol/photos/images/' + req.body.image]})}], ['comment_options', {'author': author, 'permlink': permlink, 'max_accepted_payout': '1000000.000 SBD', 'percent_steem_dollars': 10000, 'allow_votes': true, 'allow_curation_rewards': true, 'extensions': [[0, {'beneficiaries': ben}]]}]], function (err, response) {
        if (err) {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Error',
            images
          })
          console.log(err)
        } else {
          res.render('post', {
            name: req.session.steemconnect.name,
            msg: 'Posted To Steem Network',
            images
          })
        }
      })
      done = true
    }
  })
})

router.post('/vote', util.isAuthenticated, (req, res) => {
  let postId = req.body.postId
  let voter = req.session.steemconnect.name
  let author = req.body.author
  let permlink = req.body.permlink
  let weight = 10000

  steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
    if (err) {
      res.json({ error: err.error_description })
    } else {
      res.json({ id: postId })
    }
  })
})

router.post('/comment', util.isAuthenticated, (req, res) => {
  let author = req.session.steemconnect.name
  let permlink = req.body.parentPermlink + '-' + util.urlString()
  let title = 'RE: ' + req.body.parentTitle
  let body = req.body.message
  let parentAuthor = req.body.parentAuthor
  let parentPermlink = req.body.parentPermlink
  steem.comment(parentAuthor, parentPermlink, author, permlink, title, body, '', (err, steemResponse) => {
    if (err) {
      res.json({ error: err.error_description })
    } else {
      res.json({
        msg: 'Posted To Steem Network',
        res: steemResponse
      })
    }
  })
})

module.exports = router
