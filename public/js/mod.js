$('button[id=Accept]').each(function(it, el) {
  el.addEventListener('click', function(e) {
    console.log(e.target.attributes["data-post"].value)
  })
})