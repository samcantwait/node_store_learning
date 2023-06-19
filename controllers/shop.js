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

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => console.log(result))
        .catch(err => console.log(err));
    //     let fetchedCart;
    //     let newQuantity = 1;
    //     req.user
    //         .getCart()
    //         .then(cart => {
    //             fetchedCart = cart;
    //             return cart.getProducts({ where: { id: productId } });
    //         })
    //         .then(products => {
    //             let product;
    //             if (products.length) {
    //                 product = products[0];
    //             }

    //             if (product) {
    //                 const oldQuantity = product.cartItem.quantity;///////////////////////////
    //             }
    //         })
    //     res.redirect('/cart');
}

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