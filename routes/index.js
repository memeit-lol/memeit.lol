let express = require('express')
let router = express.Router()
let delegatorsScript = require('../modules/delegators')

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.steemconnect) {
    res.redirect('/dashboard')
  } else {
    res.render('index', { title: 'SteemConnect V2 Boilerplate' })
  }
})

router.get('/@:username?', (req, res, next) => {
  let username = req.params.username
  res.render('profile', {
    name: username
  })
})

router.get('/faq', (req, res, next) => {
  res.render('faq')
})

router.get('/supporters', (req, res, next) => {
  delegatorsScript.loadDelegations('memeit.lol', function (delegators) {
    console.log(delegators)
    res.render('supporters', {
      delegators
    })
  })
})

router.get('/:category/@:username/:permlink', (req, res, next) => {
  let category = req.params.category
  let username = req.params.username
  let permlink = req.params.permlink
  res.render('single', {
    category: category,
    username: username,
    permlink: permlink
  })
})

module.exports = router
