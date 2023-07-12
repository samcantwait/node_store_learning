const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'All Products',
                prod: products,
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            });
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail',
                {
                    product,
                    pageTitle: product.title,
                    path: '/products',
                    isAuthenticated: req.session.isLoggedIn
                })
        })
}

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                prod: products,
                path: '/',
                isAuthenticated: req.session.isLoggedIn
            });
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                products: user.cart.items,
                path: '/cart',
                isAuthenticated: req.session.isLoggedIn
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
        .removeFromCart(productId)
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
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, productData: { ...i.productId._doc } }
            });

            const order = new Order({
                user: {
                    userId: req.user,
                    name: req.user.name,
                },
                products: products
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })

}