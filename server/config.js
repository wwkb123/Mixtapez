module.exports = {
    url: {
        client: process.env.NODE_ENV === 'production' ? 'https://mixtapez416.herokuapp.com' : 'http://localhost:3000',
        server: process.env.NODE_ENV === 'production' ? 'https://mixtapez416.herokuapp.com' : 'http://localhost:3001',
    }
}