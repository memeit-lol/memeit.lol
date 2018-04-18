$('button[id=Accept]').each(function(it, el) {
  el.addEventListener('click', function(e) {
    $.ajax({
      type: 'POST',
      url: '/mods/vote',
      data: JSON.stringify({
        post: e.target.attributes["data-post"].value,
        value: true
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    })
  })
})

$('button[id=Decline]').each(function(it, el) {
  el.addEventListener('click', function(e) {
    $.ajax({
      type: 'POST',
      url: '/mods/vote',
      data: JSON.stringify({
        post: e.target.attributes["data-post"].value,
        value: false
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    })
  })
})