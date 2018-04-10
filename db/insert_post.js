module.exports = function (title, author, permlink, img) {
  return `INSERT INTO posts(TITLE, AUTHOR, PERMLINK, VOTED, IMG) VALUES('${title}', '${author}', '${permlink}', false, '${img}');`
}
