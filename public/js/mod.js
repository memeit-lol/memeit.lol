$('button[id=Accept]').each(function(it, el) {
  el.addEventListener('click', function(e) {
    el.parentNode.parentNode.style.display = "none"
    $.ajax({
      type: 'POST',
      url: '/mods/vote',
      data: JSON.stringify({
        post: e.target.attributes["data-post"].value,
        value: 1
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    })
  })
})

$('button[id=Ignore]').each(function(it, el) {
  el.addEventListener('click', function(e) {
    el.parentNode.parentNode.style.display = "none"
    $.ajax({
      type: 'POST',
      url: '/mods/vote',
      data: JSON.stringify({
        post: e.target.attributes["data-post"].value,
        value: 0
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    })
  })
})

$('button[id=Decline]').each(function(it, el) {
  el.addEventListener('click', function(e) {
    el.parentNode.parentNode.style.display = "none"
    $.ajax({
      type: 'POST',
      url: '/mods/vote',
      data: JSON.stringify({
        post: e.target.attributes["data-post"].value,
        value: -1
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    })
  })
})