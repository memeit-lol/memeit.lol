const steem = require('steem');

var delegation_transactions = [];

function loadDelegations(account, callback) {
  getTransactions(account, -1, callback);
}

function getTransactions(account, start, callback) {
  var last_trans = start;
	
  steem.api.getAccountHistory(account, start, (start < 0) ? 10000 : Math.min(start, 10000), function (err, result) {
    if(err) {
      console.log(err);
      return;
    }

    result.reverse();

		for(var i = 0; i < result.length; i++) {
			var trans = result[i];
      var op = trans[1].op;

      if(op[0] == 'delegate_vesting_shares' && op[1].delegatee == account)
        delegation_transactions.push({ id: trans[0], data: op[1] });
      last_trans = trans[0];
    }
		
    if(last_trans > 0 && last_trans != start)
      getTransactions(account, last_trans, callback);
			
      processDelegations(callback);
		}
  });
}

function processDelegations(callback) {
  var delegations = [];

  delegation_transactions.reverse();

  for(var i = 0; i < delegation_transactions.length; i++) {
    var trans = delegation_transactions[i];
    var delegation = delegations.find(d => d.delegator == trans.data.delegator);

    if(delegation) {
      delegation.vesting_shares = trans.data.vesting_shares;
    } else {
      delegations.push({ delegator: trans.data.delegator, vesting_shares: trans.data.vesting_shares });
    }
  }

  delegation_transactions = [];

  if(callback)
    callback(delegations.filter(function(d) { return parseFloat(d.vesting_shares) > 0; }));
}

module.exports = {
  loadDelegations: loadDelegations
}