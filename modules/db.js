var JsonDB = require('node-json-db')
var db = new JsonDB('moderators', true, false)

var mods = db.getData('/moderators')

function addModPoint (mod) {
  mods[mod] += 1
  db.push('/moderators', mods)
}

function addMod (mod) {
  mods[mod] = 0
  db.push('/moderators', mods)
}

function getMods () {
  let modsList = []
  for (let mod in mods) {
    modsList.push({mod, num: mods[mod]})
  }
  return modsList.sort(function (a, b) {
    return b.num - a.num
  })
}

function getModNames () {
  let modsList = []
  for (let mod in mods) {
    modsList.push(mod)
  }
  modsList = modsList.sort(function (a, b) {
    return b.num - a.num
  })
  return modsList.slice(0, 3)
}

module.exports = {
  addModPoint, addMod, getMods, getModNames
}
