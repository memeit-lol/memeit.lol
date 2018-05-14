var Meme = function () {
  var self = {}

  self.export = function () {
    return self.c.toDataURL()
  }

  self.draft = function () {
    return JSON.stringify(self.c.toJSON())
  }

  self.addSticker = function (url) {
    fabric.Image.fromURL(url, function (img) {
      var scale = 50 / img.height
      img.scale(scale)
      self.c.add(img)
      self.c.setActiveObject(img)
    }, {crossOrigin: 'anonymous'})
  }

  self.removeElement = function (element = self.c.getActiveObject()) {
    self.c.remove(element)
  }

  self.defaultTextAreas = function () {
    self.addText('DOUBLE CLICK ON ME', 0, 25)
    self.addText('DOUBLE CLICK ON ME', 0, self.c.height - 75)
  }

  self.addText = function (text = "DOUBLE CLICK ON ME", x = 0, y = 0) {
    var element = new fabric.Textbox(text, { width: self.width, height: 50, breakWords: true, textAlign:'center',left: x, top: y, fontFamily: 'Impact', fontSize: 40, stroke: '#000000', strokeWidth: 3, fill: "#ffffff", strokeMiterLimit: 2, strokeLineCap: "round" })
    self.c.add(element)
    self.c.setActiveObject(element)
  }

  self.addBackgroundImage = function (url) {
    var i = new Image()
    i.onload = function () {
      self.c.clear()
      self.c.setHeight(i.height)
      self.c.setWidth(i.width)
      self.c.setBackgroundImage(url, function () {
        var scale = i.height / i.width
        self.c.backgroundImage.scaleToWidth(self.width)
        self.c.setDimensions({width: self.width, height: self.width  * scale})
        var text = new fabric.Text('memeit.lol', { left: 7, top: self.width * scale - 25, fontFamily: 'Impact', fontSize: 20, stroke: '#000000', strokeWidth: .75, fill: "#ffffff", strokeMiterLimit: 2, strokeLineCap: "round" });
        text.selectable = false
        self.c.add(text)
        self.defaultTextAreas()
      }, {crossOrigin: 'anonymous'})
    }
    i.src = url
  }

  self.init = function (id, width = 500) {
    self.c = new fabric.Canvas(id)
    self.width = width
    window.onkeyup = function (ev) {
      switch (ev.keyCode) {
        case 46:
          self.removeElement()
          break
      }
    }
    self.addBackgroundImage('https://api.memeit.lol/v1/meme/1_Advice_Yoda_Gives.jpg')
  }

  return self
}