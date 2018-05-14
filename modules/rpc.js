let axios = require('axios')
let config = require('../config')

function rpc (method, params) {
  return axios.default.post(config.api, {
    jsonrpc: '2.0',
    method,
    params,
    id: 1
  }).then(function (data) {
    return data.data
  })
}

module.exports = rpc
