let express = require('express')
let util = require('../modules/util')
let steem = require('../modules/steemconnect')
let delegator = require('../modules/delegators')
let config = require('../config')
let router = express.Router()
let axios = require('axios')
let db = require('../db')

router.get('/', util.isAuthenticated, (req, res, next) => {
  axios.default.get(config.endpoints.base + config.endpoints.memes).then(images => {
    return images.data.images
  }).then(images => {
    res.render('post', {
      name: req.session.steemconnect.name,
      images,
      username: req.session.steemconnect.name
    })
  })
})

router.post('/create-post', util.isAuthenticated, (req, res) => {
  axios.default.get(config.endpoints.base + config.endpoints.memes).then(images => {
    return images.data.images
  }).then(images => {
    let author = req.session.steemconnect.name
    let permlink = util.urlString()
    var tags = req.body.tags.split(',').map(item => item.trim())
    let primaryTag = 'memeitlol'
    let otherTags = tags.slice(0, 4)
    let title = req.body.title
    let done = false
    new db.post({
      title,
      author,
      permlink,
      img: req.body.image
    }).save()
    delegator.getWeights('memeit.lol', function (data) {
      if (!done) {
        let ben = []
        for (let key in data) {
          ben.push({'account': key, 'weight': data[key]})
        }
        steem.broadcast([['comment', {'parent_author': '', 'parent_permlink': primaryTag, 'author': author, 'permlink': permlink, 'title': title, 'body': `<img src="${req.body.image}" />`, 'json_metadata': JSON.stringify({app: 'memeit.lol/0.0.1', tags: [primaryTag, ...otherTags], image: [req.body.image]})}], ['comment_options', {'author': author, 'permlink': permlink, 'max_accepted_payout': '1000000.000 SBD', 'percent_steem_dollars': 10000, 'allow_votes': true, 'allow_curation_rewards': true, 'extensions': [[0, {'beneficiaries': ben}]]}]], function (err, response) {
          if (err) {
            res.render('error', {
              message: 'Error: Please try again later',
              username: req.session.steemconnect.name
            })
            console.log(err)
          } else {
            res.redirect(`/@${author}/${permlink}`)
          }
        })
        done = true
      }
    })
  })
})

router.get('/vote/@:author/:permlink', util.isAuthenticated, (req, res) => {
  let author = req.params.author
  let permlink = req.params.permlink
  res.render('vote', {
    author, permlink,
    username: req.session.steemconnect.name
  })
})

router.post('/vote/@:author/:permlink', util.isAuthenticated, (req, res) => {
  let voter = req.session.steemconnect.name
  let author = req.params.author
  let permlink = req.params.permlink
  let weight = 10000

  steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
    if (err) {
      console.log(err)
      res.redirect(`/@${author}/${permlink}`)
    } else {
      res.redirect(`/@${author}/${permlink}`)
    }
  })
})

router.get('/comment/@:author/:permlink', util.isAuthenticated, (req, res) => {
  axios.default.get(config.endpoints.base + config.endpoints.memes).then(images => {
    return images.data.images
  }).then(images => {
    res.render('comment', {
      permlink: req.params.permlink,
      author: req.params.author,
      images,
      username: req.session.steemconnect.name
    })
  })
})

router.post('/comment/@:author/:permlink', util.isAuthenticated, (req, res) => {
  let author = req.session.steemconnect.name
  let permlink = req.params.permlink + '-' + util.urlString()
  let title = 'RE: ' + req.params.permlink
  let body = req.body.image
  let parentAuthor = req.params.author
  let parentPermlink = req.params.permlink
  steem.broadcast([['comment', {'parent_author': parentAuthor, 'parent_permlink': parentPermlink, 'author': author, 'permlink': permlink, 'title': title, 'body': `<img src="${body}" />`, 'json_metadata': JSON.stringify({app: 'memeit.lol/0.0.1', image: [req.body.image]})}]], function (err, response) {
    if (err) {
      console.log(err)
      res.redirect(`/@${author}/${permlink}`)
    } else {
      res.redirect(`/@${author}/${permlink}`)
    }
  })
})

module.exports = router
