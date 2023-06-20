const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'All Products',
                prod: products,
                path: '/products',
            });
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId)
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
        })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                prod: products,
                path: '/',
            });
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                products: products,
                path: '/cart'
            })
        })
}

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => res.redirect('/cart'))
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    req.user
        .deleteItemFromCart(productId)
        .then(result => res.redirect('/cart'))
        .catch(err => console.log(err));
}

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     })
// }

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders
            });
        })

}