let express = require('express');
let router = express.Router();
let fs = require("fs");
let jimp = require("jimp");
let uuid = require("uuid/v4");

router.get('/:name', (req, res, next) => {
  res.setHeader("Content-Type", "image/png");
  jimp.read("./images/"+req.params.name, (err, re) => {
    if(!err) {
      let scale = re.bitmap.width / re.bitmap.height;
      re.resize(300*scale,300)   
        .getBuffer(jimp.MIME_PNG, (err, buff) => {
          res.send(buff);
        });
      }
  });
});

router.post("/", (req, res) => {
  let image = req.body.image;
  let data = image.replace(/^data:image\/\w+;base64,/, '');
  let name = uuid() + ".png";
  fs.writeFileSync("./images/" + name, data, {encoding: "base64"});
  res.json({filename: name});
});

module.exports = router;
