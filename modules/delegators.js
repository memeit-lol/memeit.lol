const steem = require('steem')
let db = require('../db')

var delegationTransactions = []

function loadDelegations (account, callback) {
  getTransactions(account, -1, callback)
}

function getTransactions (account, start, callback) {
  var lastTrans = start

  steem.api.getAccountHistory(account, start, (start < 0) ? 10000 : Math.min(start, 10000), function (err, result) {
    if (err) {
      console.log(err)
      return
    }

    result.reverse()

    for (var i = 0; i < result.length; i++) {
      var trans = result[i]
      var op = trans[1].op

      if (op[0] === 'delegate_vesting_shares' && op[1].delegatee === account) { delegationTransactions.push({ id: trans[0], data: op[1] }) }
      lastTrans = trans[0]
    }

    if (lastTrans > 0 && lastTrans !== start) { getTransactions(account, lastTrans, callback) }

    processDelegations(callback)
  })
}

function processDelegations (callback) {
  var delegations = []

  delegationTransactions.reverse()

  for (var i = 0; i < delegationTransactions.length; i++) {
    var trans = delegationTransactions[i]
    var delegation = delegations.find(d => d.delegator === trans.data.delegator)

    if (delegation) {
      delegation.vesting_shares = trans.data.vesting_shares
    } else {
      delegations.push({ delegator: trans.data.delegator, vesting_shares: trans.data.vesting_shares })
    }
  }

  delegationTransactions = []

  if (callback) { callback(delegations.filter(function (d) { return parseFloat(d.vesting_shares) > 99904.3171 })) }
}

function add (object, name, value) {
  var added = false
  for (let ob in object) {
    if (ob === name) {
      object[ob] += value
      added = true
    }
  }
  if (!added) {
    object[name] = value
  }
  return object
}

function getWeights (account, callback) {
  loadDelegations(account, function (del) {
    db.client.query('SELECT STEEM FROM mods ORDER BY VOTES ASC', function (err, res) {
      if (err) console.log(err)
      var weights = {}
      for (let row of res.rows) {
        weights = add(weights, row.steem, 100)
      }
      weights = add(weights, 'lol.pay', 1000)
      var total = 0
      var past = 0
      del.forEach(function (de) {
        total += parseFloat(de.vesting_shares.replace(' VESTS', ''))
      })
      var chance = Math.random()
      var chance2 = Math.random()
      var chance3 = Math.random()
      del.forEach(function (de) {
        var per = parseFloat(de.vesting_shares.replace(' VESTS', '')) / total
        if (chance >= past && chance <= per + past) {
          weights = add(weights, de.delegator, 500)
        } else if (chance2 >= past && chance2 <= per + past) {
          weights = add(weights, de.delegator, 500)
        } else if (chance3 >= past && chance3 <= per + past) {
          weights = add(weights, de.delegator, 500)
        }
        past += per
      })
      callback(weights)
    })
  })
}

module.exports = {
  loadDelegations: loadDelegations,
  getWeights: getWeights
}
