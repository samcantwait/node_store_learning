exports.send404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page not Found',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    })
}