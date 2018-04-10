module.exports = function (steem) {
  return `INSERT INTO mods(STEEM, BANNED, VOTES) VALUES('${steem}', false, 0);`
}
