const { Client } = require('pg')
const config = require('../config')
const client = new Client({
  connectionString: config.postgres
})

client.connect()

module.exports = client
