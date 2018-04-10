const { Client } = require('pg')
const config = require('../config')
const mod = require('./insert_mod')
const post = require('./insert_post')
const vote = require('./insert_vote')

const client = new Client({
  connectionString: config.postgres
})

client.connect()

module.exports = {
  client, mod, post, vote
}
