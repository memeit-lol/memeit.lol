let config = {
  port: 3000,
  auth: {
    client_id: 'memeit.lol.app',
    redirect_uri: 'http://localhost:3000/auth/'
  },
  session: {
    secret: 'sessionlolidsk'
  },
  postgres: '',
  endpoints: {
    base: 'https://api.memeit.com/',
    img: 'new',
    memes: 'memes'
  }
}

module.exports = config
