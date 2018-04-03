let express = require('express');
let util = require('../modules/util');
let steem = require('../modules/steemconnect')
let delegator = require('../modules/delegators')
let router = express.Router();
let db = require("../modules/db");
let fs = require("fs");

router.get('/', util.isAuthenticated, (req, res, next) => {
  var images = fs.readdirSync("./memes");
    res.render('post', {
      name: req.session.steemconnect.name,
      images
    });
});

router.post('/create-post', util.isAuthenticated, (req, res) => {
  var images = fs.readdirSync("./memes");
    let author = req.session.steemconnect.name
    let permlink = util.urlString()
    var tags = req.body.tags.split(',').map(item => item.trim());
    let primaryTag = "steemitlol";
    let otherTags = tags.slice(1, 4);
    let title = req.body.title;
    let body = req.body.image;
    let done = false;
    delegator.getWeights("steemit.lol", function(data) {
      if(!done) {
        let ben = [];
        for(let key in data) {
          ben.push({account: key, weight: data[key]});
        }
        steem.broadcast([['comment', {parent_author: "", parent_permlink: primaryTag, author, permlink, title, body, json_metadata: JSON.stringify({app: 'steemit.lol/0.0.1', tags: [primaryTag, ...otherTags], image: ['https://steemit.lol/photos/images/'+req.body.image]})}], ['comment_options', {author, permlink, max_accepted_payout: "1000000.000 SBD", percent_steem_dollars: 10000, allow_votes: true, allow_curation_rewards: true, extensions: [0, {beneficiaries: [{account: "steemit.lol", weight: 1000}, {account: "lol.pay", weight: 1500}]}]}]], function(err, response) {
          if (err) {
            res.render('post', {
              name: req.session.steemconnect.name,
              msg: 'Error',
              images
            });
            console.log(err);
          } else {
            res.render('post', {
              name: req.session.steemconnect.name,
              msg: 'Posted To Steem Network',
              images
            })
          }
        });
        done = true;
      }
    });
});

router.post('/vote', util.isAuthenticated, (req, res) => {
    let postId = req.body.postId
    let voter = req.session.steemconnect.name
    let author = req.body.author
    let permlink = req.body.permlink
    let weight = 10000

    steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
      if (err) {
          res.json({ error: err.error_description })
      } else {
          res.json({ id: postId })
      }
    });
})


router.post('/comment',  util.isAuthenticated, (req, res) => {

    let author = req.session.steemconnect.name
    let permlink = req.body.parentPermlink + '-' + util.urlString()
    let title = 'RE: ' + req.body.parentTitle
    let body = req.body.message
    let parentAuthor = req.body.parentAuthor
    let parentPermlink = req.body.parentPermlink
    steem.comment(parentAuthor, parentPermlink, author, permlink, title, body, '', (err, steemResponse) => {
      if (err) {
        res.json({ error: err.error_description })
      } else {
        res.json({
          msg: 'Posted To Steem Network',
          res: steemResponse
        })
      }
    });
});

module.exports = router;
