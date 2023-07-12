const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.user
    });
    product.save()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const { productId } = req.params;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product,
                isAuthenticated: req.session.isLoggedIn
            });
        })
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body;
    Product.findById(productId).then(product => {
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        return product.save();
    }).then(result => {
        res.redirect('/admin/products')
    }).catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id')  You can select specific fields
        .populate('userId')
        .then(products => {
            console.log(products)
            res.render('admin/products', {
                prod: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            });
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findByIdAndRemove(productId)
        .then(() => res.redirect('/products'))
        .catch(err => console.log(err));
}