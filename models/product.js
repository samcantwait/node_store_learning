const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        return db.collection('products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(id) })
            .next()
            .then(product => {
                return product;
            })
            .catch(err => console.log(err));
    }

    static update(id, title, price, imageUrl, description) {
        const db = getDb();
        return db.collection('products')
            .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { title, price, imageUrl, description } })
            .then(result => console.log('updated result: ', result))
            .catch(err => console.log(err));
    }

    static delete(id) {
        const db = getDb()
        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(id) })
            .then(result => console.log('deleted result: ', result))
            .catch(err => console.log(err));
    }
}

module.exports = Product;