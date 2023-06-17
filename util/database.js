const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config()

let _db;

const uri = `mongodb+srv://samatkins:${process.env.MONGODB_PASS}@nodecluster.s7zhua5.mongodb.net/shop?retryWrites=true&w=majority`

const mongoConnect = (cb) => {
    MongoClient.connect(uri)
        .then(client => {
            console.log('connected to the mongo');
            _db = client.db();
            cb();
        })
        .catch(err => {
            console.log(err)
            throw (err);
        });
}

const getDb = () => {
    if (_db) return _db;
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;