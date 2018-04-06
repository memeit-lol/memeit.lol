const steem = require('steem');
let db = require("../modules/db");

var delegation_transactions = [];

function loadDelegations(account, callback) {
  getTransactions(account, -1, callback);
}

function getTransactions(account, start, callback) {
  var last_trans = start;

  steem.api.getAccountHistory(account, start, (start < 0) ? 10000 : Math.min(start, 10000), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    result.reverse();

    for (var i = 0; i < result.length; i++) {
      var trans = result[i];
      var op = trans[1].op;

      if (op[0] == 'delegate_vesting_shares' && op[1].delegatee == account)
        delegation_transactions.push({ id: trans[0], data: op[1] });
      last_trans = trans[0];
    }

    if (last_trans > 0 && last_trans != start)
      getTransactions(account, last_trans, callback);

    processDelegations(callback);

  });
}

function processDelegations(callback) {
  var delegations = [];

  delegation_transactions.reverse();

  for (var i = 0; i < delegation_transactions.length; i++) {
    var trans = delegation_transactions[i];
    var delegation = delegations.find(d => d.delegator == trans.data.delegator);

    if (delegation) {
      delegation.vesting_shares = trans.data.vesting_shares;
    } else {
      delegations.push({ delegator: trans.data.delegator, vesting_shares: trans.data.vesting_shares });
    }
  }

  delegation_transactions = [];

  if (callback)
    callback(delegations.filter(function (d) { return parseFloat(d.vesting_shares) > 0; }));
}

function add(object, name, value) {
  var added = false;
  for(let ob in object) {
    if(ob === name) {
      object[ob] += value;
      added = true;
    }
  }
  if(!added) {
    object[name] = value;
  }
  return object;
}

function getWeights(account, callback) {
  loadDelegations(account, function(del) {
    var mods = db.getModNames();
    var weights = {};
    weights = add(weights, "gktown", 500);
    weights = add(weights, "kennybll", 500);
    mods.forEach(mod => {
      weights = add(weights, mod, 100);
    });
    var total = 0;
    var past = 0;
    del.forEach(function(de) {
      total += parseFloat(de.vesting_shares.replace(" VESTS", ""));
    });
    var chance = Math.random();
    var chance2 = Math.random();
    var chance3 = Math.random();
    del.forEach(function(de) {
      var per = parseFloat(de.vesting_shares.replace(" VESTS", "")) / total;
      if(chance >= past && chance <= per + past) {
        weights = add(weights, de.delegator, 400);
      } else
      if(chance2 >= past && chance2 <= per + past) {
        weights = add(weights, de.delegator, 400);
      } else
      if(chance3 >= past && chance3 <= per + past) {
        weights = add(weights, de.delegator, 400);
      }
      past += per;
    });
    callback(weights);
  });
}

module.exports = {
  loadDelegations: loadDelegations,
  getWeights: getWeights
}