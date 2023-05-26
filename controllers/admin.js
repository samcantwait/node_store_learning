const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, image, description, price);
    product.save()
        .then(res.redirect('/'))
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const { productId } = req.params;
    Product.findById(productId, product => {
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
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body;
    const updatedProduct = new Product(productId, title, imageUrl, description, price);
    updatedProduct.save();
    res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prod: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.deleteById(productId);
    res.redirect('/admin/products');
}