exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true
    });
}

const products = [];

exports.postAddProduct = (req, res, next) => {
    products.push({
        title: req.body.title
    })
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    res.render('shop', {
        pageTitle: 'Shop',
        prod: products, path: '/',
        hasProd: products.length > 0,
        activeShop: true
    });
}