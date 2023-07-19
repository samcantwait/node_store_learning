const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// If not authed then user if redirected and next is never called so it never gets to next middleware.
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts)

router.post('/add-product', isAuth, adminController.postAddProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct)

module.exports = router;