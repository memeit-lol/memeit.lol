var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var img = document.getElementById('img1')
var img2 = document.getElementById('img2')
var top2 = document.getElementById('top')
var bottom = document.getElementById('bottom')
var submit = document.getElementById('submitBTN')
var fontSize = 50
window.url = 'https://steemit.lol/photos/memes/thumbnail/1_Okay_Guy.jpg'
var image = document.getElementById('image')
var form = document.getElementById('form')

function change (url) {
  window.url = url
  draw()
}

function draw () {
  img.crossOrigin = 'anonymous'
  img.onload = function () {
    drawMeme()
    img2.src = canvas.toDataURL()
  }
  img.src = window.url.replace('/thumbnail', '')
}

function drawMeme () {
  canvas.height = img.height
  canvas.width = img.width
  ctx.clearRect(0, 0, img.width, img.height)
  ctx.drawImage(img, 0, 0, img.width, img.height)
  ctx.lineWidth = 8
  ctx.font = 'bold 50pt Impact'
  ctx.strokeStyle = 'black'
  ctx.mutterLine = 2
  ctx.miterLimit = 2
  ctx.lineJoin = 'circle'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  var text1 = top2.value.toUpperCase()
  var x = img.width / 2
  var y = 0
  wrapText(ctx, text1, x, y, img.width, 1.6, false, fontSize)
  ctx.textBaseline = 'bottom'
  var text2 = bottom.value.toUpperCase()
  y = img.height
  wrapText(ctx, text2, x, y, img.width, 1.6, true, fontSize)
  ctx.lineWidth = 4
  wrapText(ctx, 'steemit.lol', 35, y, img.width, 1.6, true, 10)
}

function wrapText (context, text, x, y, maxWidth, lineHeightRatio, fromBottom, fontSize) {
  context.font = 'bold ' + fontSize + 'pt Impact'
  var pushMethod = (fromBottom) ? 'unshift' : 'push'
  var _lineHeightRatio = (fromBottom) ? -lineHeightRatio : lineHeightRatio
  var lineHeight = _lineHeightRatio * fontSize
  var lines = []
  var y = y
  var line = ''
  var words = text.split(' ')

  for (var n = 0; n < words.length; n++) {
    var testLine = line + ' ' + words[n]
    var metrics = context.measureText(testLine)
    var testWidth = metrics.width

    if (testWidth > maxWidth) {
      lines[pushMethod](line)
      line = words[n] + ' '
    } else {
      line = testLine
    }
  }
  lines[pushMethod](line)

  if (lines.length > 2) {
    wrapText(context, text, x, y, maxWidth, lineHeightRatio, fromBottom, fontSize - 10)
  } else {
    for (var k in lines) {
      context.strokeText(lines[k], x, y + lineHeight * k)
      context.fillText(lines[k], x, y + lineHeight * k)
    }
  }
}

top.addEventListener('keyup', draw)
bottom.addEventListener('keyup', draw)
submit.addEventListener('click', function (e) {
  e.preventDefault()
  $.post('https://steemit.lol/photos/images/', {image: canvas.toDataURL()}, function (data) {
    image.value = data.filename
    form.submit()
  })
})
draw()
