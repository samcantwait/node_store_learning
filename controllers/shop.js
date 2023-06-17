const Product = require('../models/product');
const Cart = require('../models/cart');

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
            console.log('inprrroduct', product)
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

// exports.getCart = (req, res, next) => {
//     Cart.getCart(cart => {
//         Product.fetchAll(products => {
//             const cartProducts = [];
//             for (product of products) {
//                 const cartProductData = cart.products.find(prod => prod.id === product.id);
//                 if (cartProductData) {
//                     cartProducts.push({ productData: product, qty: cartProductData.qty });
//                 }
//             }
//             res.render('shop/cart', {
//                 path: '/cart',
//                 pageTitle: 'Your cart',
//                 products: cartProducts
//             });
//         })
//     })
// }

// exports.postCart = (req, res, next) => {
//     const { productId } = req.body;
//     Product.findById(productId, (product) => {
//         Cart.addProduct(productId, product.price);
//     });
//     res.redirect('/cart');
// }

// exports.postCartDeleteProduct = (req, res, next) => {
//     const { productId } = req.body;
//     Product.findById(productId, product => {
//         Cart.deleteProduct(productId, product.price);
//         res.redirect('/cart')
//     })
// }

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     })
// }

// exports.getOrders = (req, res, next) => {
//     res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//     });
// }