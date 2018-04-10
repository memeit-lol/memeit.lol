module.exports = function (mod, post, approved) {
  return `INSERT INTO vote(MOD, POST, APPROVED) VALUES('${mod}', '${post}', ${approved});`
}
