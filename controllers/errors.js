exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page not Found',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.get500 = (req, res, next) => {
    const error = req.body;
    console.log(error)
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedin
    });
};