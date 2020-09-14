const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
    MongoClient.connect(
        "mongodb+srv://oduduu:emem@2000@cluster0.uqgye.mongodb.net/shop?retryWrites=true&w=majority", {useUnifiedTopology: true}
    )
        .then((client) => {
            console.log("Connected to Database!");
            _db = client.db()
            cb()
        })
        .catch((err) => {
            console.log('Database Connection error: ', err);
            throw err;
        });

}

const getDb = () => {
    if (_db) return _db;
    throw 'No database found!';
}

module.exports = {mongoConnect, getDb};