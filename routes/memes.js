let express = require('express')
let router = express.Router()
let fs = require('fs')
let jimp = require('jimp')

router.get('/', (req, res, next) => {
  try {
    res.json(fs.readdirSync('../memes'))
  } catch (err) {
    res.json([])
  }
})

router.get('/:name', (req, res, next) => {
  res.setHeader('Content-Type', 'image/png')
  jimp.read('../memes/' + req.params.name, (err, re) => {
    if (!err) {
      let scale = re.bitmap.width / re.bitmap.height
      re.resize(600 * scale, 600)
        .getBuffer(jimp.MIME_PNG, (err, buff) => {
          if (err) console.log(err)
          res.send(buff)
        })
    }
  })
})

router.get('/thumbnail/:name', (req, res, next) => {
  res.setHeader('Content-Type', 'image/png')
  jimp.read('../memes/' + req.params.name, (err, re) => {
    if (!err) {
      let scale = re.bitmap.width / re.bitmap.height
      re.resize(50 * scale, 50)
        .getBuffer(jimp.MIME_PNG, (err, buff) => {
          if (err) console.log(err)
          res.send(buff)
        })
    }
  })
})

module.exports = router
