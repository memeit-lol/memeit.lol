let express = require('express')
let util = require('../modules/util')
let router = express.Router()
let db = require('../db')

/* GET users listing. */
router.get('/', util.isAuthenticated, async (req, res, next) => {
  let posts = await db.post.find({hidden: false}).sort({time: -1}).limit(10)
  const userMetadata = req.session.steemconnect.json_metadata
    ? JSON.parse(req.session.steemconnect.json_metadata)
    : {}
  res.render('dashboard', {
    posts,
    name: req.session.steemconnect.name,
    about: userMetadata.profile ? userMetadata.profile.about : '',
    profileImage: userMetadata.profile ? userMetadata.profile.profile_image : 'http://via.placeholder.com/100x100',
    logged: res.logged,
    mod: res.mod,
    username: req.session.steemconnect.name
  })
})

module.exports = router
