let config = {
    port: 3000,
    auth: {
        client_id: 'steemit.lol.app',
        redirect_uri: 'http://localhost:3000/auth/'
    },
    session: {
        secret: 'sessionlolidsk'
    }
};

module.exports = config;
