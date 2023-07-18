const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.'),
        body('password', 'Please enter a valid password.')
            .isLength({ min: 2 })
            .isAlphanumeric()
    ],
    authController.postLogin);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email exists already, please pick a different one.')
                        }
                    })
            }),
        body('password', 'Please enter a valid password.')
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;