var c = new fabric.Canvas('canvas')
var text = document.getElementById("text")
var submit = document.getElementById('submitBTN')
window.url = 'https://memeit.lol/photos/memes/thumbnail/1_Okay_Guy.jpg'
var form = document.getElementById('form')

function change (url) {
  window.url = url
  draw()
}

function draw () {
  drawMeme(window.url.replace('/thumbnail', ''))
}

function addText() {
  var text = new fabric.Textbox('CLICK ON ME', {width: 200,breakWords: true, textAlign:'center',left: 0, top: 0, fontFamily: 'Impact', fontSize: 40, stroke: '#000000', strokeWidth: 3, fill: "#ffffff" });
  c.add(text);
}

function drawMeme (src) {
  var image = new Image();
  image.onload = function() {
	  c.clear()
    c.setHeight(image.height)
    c.setWidth(image.width)
    c.setBackgroundImage(src, function() {
      var scale = image.height / image.width
      c.backgroundImage.scaleToWidth(500)
      c.setDimensions({width: 500,height: 500  * scale})
      var text = new fabric.Text('memeit.lol', { left: 7, top: 480 * scale, fontFamily: 'Impact', fontSize: 20, stroke: '#000000', strokeWidth: .75, fill: "#ffffff" });
      c.add(text);
      c.item(0).selectable = false;
    }, {crossOrigin: 'anonymous'})
  }
  image.src = src;
}
form.onsubmit = function(e) {
  e.preventDefault()
}
submit.addEventListener('click', function (e) {
  e.preventDefault()
  submit.disabled = true
  $.post('https://api.memeit.lol/new', {image: c.toDataURL()}, function (data) {
    image.value = data.filename
    form.submit()
  })
})
draw()
c.on('object:selected', function(e) {
  text.value = c.getActiveObject().text;
});
text.addEventListener('keyup', function (e) {
  var obj = c.getActiveObject();
  if (!obj) return;
  obj.text = e.target.value.toUpperCase();
  c.renderAll();
});
