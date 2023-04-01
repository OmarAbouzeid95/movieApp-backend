
const {MongoClient} = require('mongodb')

let dbConnection

module.exports = {
    dbConnect: (cb) => {
        MongoClient.connect('mongodb+srv://omarali95:89YWmSpvXZQqvgd4@movieapp.o0qxoad.mongodb.net/?retryWrites=true&w=majority')
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(error => {
            return cb(error)
        })
    },
    getDb: () => {
        return dbConnection
    }
}