const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    host: "mail.samcantwait.com",
    port: 465,
    secure: true,
    auth: {
        user: 'sam@samcantwait.com',
        pass: process.env.EMAIL_PASS
    },
});


exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (!message.length) {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (!message.length) {
        message = null;
    };
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: { email: '', password: '', confirmPassword: '' },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg
        });
    };
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.')
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(passwordMatches => {
                    if (passwordMatches) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        })
                    }
                    req.flash('error', 'Invalid email or password.')
                    res.redirect('/login');
                })
                .catch(() => {
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { email, password, confirmPassword },
            validationErrors: errors.array()
        });
    }
    bcrypt.hash(password, 12)
        .then(hashedPass => {
            const user = new User({
                email,
                password: hashedPass,
                cart: { items: [] }
            })
            return user.save();
        })
        .then(() => {
            res.redirect('/login')
            return transporter.sendMail({
                to: email,
                from: 'sam@samcantwait.com',
                subject: 'Signup successful',
                html: '<h1>You successfully signed up.</h1>'
            });
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (!message.length) {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
}

// Nodejs has a built in crypto library
exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'User does not exist.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save()
                    .then(result => {
                        transporter.sendMail({
                            to: req.body.email,
                            from: 'sam@samcantwait.com',
                            subject: 'Password reset',
                            html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>
                    `
                        })
                        res.redirect('/');
                    });
            })
            .catch(err => {
                console.log(err);
                res.redirect('/reset');
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (!message.length) {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                token
            });
        })
        .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
    const { password, userId, token } = req.body;
    let resetUser;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(password, 12)
        })
        .then(hashedPass => {
            resetUser.password = hashedPass;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(() => res.redirect('/login'))
        .catch(err => console.log(err));
}