const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const page404Controller = require('./controllers/404');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://samatkins:${process.env.MONGODB_PASS}@nodecluster.s7zhua5.mongodb.net/shop?&w=majority`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
// We are using this package to prevent csrf attacks. It sends a token to our server to identify our site before a user can make a post request.
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
})

// Expressjs has locals. These are only passed into the views which are rendered.
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(page404Controller.send404);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Connected on port: ${PORT}`);
        });
    })
    .catch(err => console.log(err));
