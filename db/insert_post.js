module.exports = function (title, author, permlink) {
  return `INSERT INTO posts(TITLE, AUTHOR, PERMLINK) VALUES('${title}', '${author}', '${permlink}');`
}
