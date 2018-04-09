let express = require('express')
let util = require('../modules/util')
let router = express.Router()

/* GET users listing. */
router.get('/', util.isAuthenticated, (req, res, next) => {

  const userMetadata = !!req.session.steemconnect.json_metadata
    ? JSON.parse(req.session.steemconnect.json_metadata)
    : {};

  res.render('dashboard', {
    name: req.session.steemconnect.name,
    about: userMetadata.profile ? userMetadata.profile.about : '',
    profileImage: userMetadata.profile ? userMetadata.profile.profile_image : 'http://via.placeholder.com/100x100'
  })
})

module.exports = router
