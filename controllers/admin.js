const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: '',
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageURL, price, description } = req.body;
    const image = req.file;
    console.log(image)
    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title,
                price,
                description,
                imageUrl: `/${image.path.replace('\\', '/')}`
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        });
    }

    const imageUrl = image.path;
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        image,
        userId: req.user
    });
    product.save()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
                errorMessage: '',
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body;
    const image = req.file;
    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = title;
            product.price = price;
            if (image) {
                product.imageUrl = `/${image.path.replace('\\', '/')}`;
            }
            product.description = description;
            return product.save()
                .then(result => {
                    res.redirect('/admin/products');
                })
        }).catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id')  You can select specific fields
        .populate('userId')
        .then(products => {
            res.render('admin/products', {
                prod: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.deleteOne({ _id: productId, userId: req.user._id })
        .then(() => res.redirect('/products'))
        .catch(err => console.log(err));
}