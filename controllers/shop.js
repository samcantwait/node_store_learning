const Product = require('../models/product');
const Order = require('../models/order');

const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product
        .find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'Products',
                prod: products,
                path: '/products',
                currentPage: page,
                totalProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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

                })
        })
}

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product
        .find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                prod: products,
                path: '/',
                currentPage: page,
                totalProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
                    email: req.user.email
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
            });
        })
}

exports.getInvoice = (req, res, next) => {
    const { orderId } = req.params;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'))
            };
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Not authorized.'))
            };

            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName);

            // Create a PDF on the fly
            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('------------------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.productData.price;
                pdfDoc.fontSize(14).text(prod.productData.title + ' - ' + prod.quantity + ' x $' + prod.productData.price);
            });
            pdfDoc.text('------');
            pdfDoc.fontSize(18).text('Total Price: $' + totalPrice);

            pdfDoc.end();


            // Read a PDF that was already created.
            // const file = fs.createReadStream(invoicePath);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            // file.pipe(res);
        })
        .catch(err => next(err));
}