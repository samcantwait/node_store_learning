const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    Product.create({
        title,
        price,
        imageUrl,
        description
    })
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const { productId } = req.params;
    Product.findByPk(productId)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product
            });
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body;
    Product.findByPk(productId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT')
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))

}

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prod: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findByPk(productId)
        .then(product => product.destroy())
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err))
}