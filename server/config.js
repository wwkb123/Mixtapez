module.exports = {
    url: {
        client: process.env.NODE_ENV === 'production' ? 'https://mixtapez416.herokuapp.com' : 'http://localhost:3000',
        server: process.env.NODE_ENV === 'production' ? 'https://mixtapez416.herokuapp.com' : 'http://localhost:3001',
    },
    mongDB_URI: {
        uri: "mongodb+srv://admin:admin@cluster0.wknfy.mongodb.net/db?retryWrites=true&w=majority"
    },
    spotify: {
        clientId: '9cf6f8ef5fb94f05bed2ec62cca84b4e',
        clientSecret: '80205a921f5c4360acc65c72fe03a92f'
    },
    email: {
        user: 'mixtapez416@gmail.com',
        pass: 'mixtapez888'
    }
}