const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.session.user = user;
                req.session.isLoggedIn = true;
                req.session.save(err => {
                    res.redirect('/');
                })
            }
            res.redirect('/');
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    })
}