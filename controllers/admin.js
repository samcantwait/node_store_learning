const Product = require('../models/product');
const fileHelper = require('../util/file');

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
    const { title, price, description } = req.body;
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
                imageUrl: `/${image.path.replace(/\\/g, '/')}`
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        });
    }

    const imageUrl = '/' + image.path.replace(/\\/g, '/');
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
                fileHelper.deleteFile(product.imageUrl);
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

exports.deleteProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found'))
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: productId, userId: req.user._id })
        })
        .then(() => {
            res.status(200).json({ message: 'Success.' })
        })
        .catch(() => res.status(500).json({ message: 'Failed to delete product.' }));
}