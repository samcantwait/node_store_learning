const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', { pageTitle: 'Shop', prod: products, path: '/', hasProd: products.length > 0, activeShop: true });
});

module.exports = router;