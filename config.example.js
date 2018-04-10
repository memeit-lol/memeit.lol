let config = {
  port: 3000,
  auth: {
    client_id: 'memeit.lol.app',
    redirect_uri: 'http://localhost:3000/auth/'
  },
  session: {
    secret: 'sessionlolidsk'
  },
  postgres: ''
}

module.exports = config
