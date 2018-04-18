let steem = require('steem')
let marked = require('marked')

let getAccountInfo = (username) => {
  let totalVestingShares, totalVestingFundSteem

  steem.api.getDynamicGlobalProperties((err, result) => {
    if (err) console.log(err)
    totalVestingShares = result.total_vesting_shares
    totalVestingFundSteem = result.total_vesting_fund_steem
  })

  return new Promise((resolve, reject) => {
    steem.api.getAccounts([username], (err, result) => {
      if (err) console.log(err)
      let user = result[0]

      let jsonData = user.json_metadata ? JSON.parse(user.json_metadata).profile : {}

      // steem power calc
      let vestingShares = user.vesting_shares
      let delegatedVestingShares = user.delegated_vesting_shares
      let receivedVestingShares = user.received_vesting_shares
      let steemPower = steem.formatter.vestToSteem(vestingShares, totalVestingShares, totalVestingFundSteem)
      let delegatedSteemPower = steem.formatter.vestToSteem((receivedVestingShares.split(' ')[0]) + ' VESTS', totalVestingShares, totalVestingFundSteem)
      let outgoingSteemPower = steem.formatter.vestToSteem((receivedVestingShares.split(' ')[0] - delegatedVestingShares.split(' ')[0]) + ' VESTS', totalVestingShares, totalVestingFundSteem) - delegatedSteemPower

      // vote power calc
      let lastVoteTime = (new Date() - new Date(user.last_vote_time + 'Z')) / 1000
      let votePower = user.voting_power += (10000 * lastVoteTime / 432000)
      votePower = Math.min(votePower / 100, 100).toFixed(2)

      let data = {
        name: user.name,
        image: jsonData.profile_image ? 'https://steemitimages.com/512x512/' + jsonData.profile_image : '',
        rep: steem.formatter.reputation(user.reputation),
        effectiveSp: parseInt(steemPower + delegatedSteemPower + outgoingSteemPower),
        sp: parseInt(steemPower).toLocaleString(),
        delegatedSpIn: parseInt(delegatedSteemPower).toLocaleString(),
        delegatedSpOut: parseInt(-outgoingSteemPower).toLocaleString(),
        s: parseInt(delegatedSteemPower + outgoingSteemPower),
        vp: votePower,
        steem: user.balance.substring(0, user.balance.length - 5),
        sbd: user.sbd_balance.substring(0, user.sbd_balance.length - 3),
        numOfPosts: user.post_count,
        followerCount: '',
        followingCount: '',
        usdValue: '',
        createdDate: new Date(user.created)
      }
      data.usdValue = steem.formatter.estimateAccountValue(user)
      steem.api.getFollowCount(user.name, function (err, result) {
        if (err) console.log(err)
        data.followerCount = result.follower_count
        data.followingCount = result.following_count
        resolve(data)
      })
    })
  })
}

async function getImg (username) {
  return new Promise((resolve, reject) => {
    steem.api.getAccounts([username], (err, re) => {
      if (err) console.log(err)
      let img = 'https://steemitimages.com/128x128/img/default-user.jpg'
      try {
        img = JSON.parse(re[0].json_metadata).profile.profile_image
      } catch (er) {
        console.log(er)
      }
      resolve(img)
    })
  })
}

async function getComments (username, permlink) {
  return new Promise((resolve, reject) => {
    steem.api.getContentReplies(username, permlink, async function (err, resp) {
      if (err) console.log(err)
      resp.map(r => {
        r.body = marked(r.body)
        return r
      })
      resolve(resp)
    })
  })
}

async function getPostAndComments (username, permlink) {
  return new Promise((resolve, reject) => {
    steem.api.getContent(username, permlink, function (err, resp) {
      if (err) console.log(err)
      console.log(resp)
      let i = {
        author: resp.author,
        category: resp.category,
        permlink: resp.permlink,
        title: resp.title,
        body: marked(resp.body),
        tags: JSON.parse(resp.json_metadata).tags.map(t => {
          if (t !== '') return `<span>${t}</span>`
        })
      }
      resolve(i)
    })
  })
}

module.exports = {
  getAccountInfo, getPostAndComments, getImg, getComments
}
