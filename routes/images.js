let express = require('express')
let router = express.Router()
let fs = require('fs')
let jimp = require('jimp')
let uuid = require('uuid/v4')
let pixel = require('pixelhosting')
let config = require('../package.json').config

pixel.init({
  api_key: config.api_key,
  api_key_id: config.api_key_id
})

router.get('/:name', (req, res, next) => {
  res.setHeader('Content-Type', 'image/png')
  jimp.read('./images/' + req.params.name, (err, re) => {
    if (!err) {
      let scale = re.bitmap.width / re.bitmap.height
      re.resize(300 * scale, 300)
        .getBuffer(jimp.MIME_PNG, (err, buff) => {
          if (err) console.log(err)
          res.send(buff)
        })
    }
  })
})

router.post('/', (req, res) => {
  let image = req.body.image
  let data = image.replace(/^data:image\/\w+;base64,/, '')
  let name = uuid() + '.png'
  fs.writeFileSync('./images/' + name, data, {encoding: 'base64'})
  if (config.testing) {
    res.json({filename: name})
  } else {
    pixel.upload(image).then((result) => {
      res.json({filename: result})
    })
  }
})

module.exports = router
