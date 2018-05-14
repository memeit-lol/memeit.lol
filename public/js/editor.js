var form = document.getElementById('form')
var submit = document.getElementById('submitBTN')
var image = document.getElementById('image')

var editor = new Meme()
editor.init('canvas')

form.onsubmit = function (e) {
  e.preventDefault()
}

submit.addEventListener('click', function (e) {
  e.preventDefault()
  submit.disabled = true
  submit.innerText = 'Uploading...'
  $.post('https://api.memeit.lol/v1/new', {image: editor.export()}, function (data) {
    image.value = data.filename
    form.submit()
  })
})
