const express = require('express');
const path = require('path');
// const { engine } = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const page404Controller = require('./controllers/404');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

// app.engine('hbs', engine({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout.hbs' }));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('6490dc98527b5358bebf50d6');
        if (!user) throw 'User does not exist!';
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    } catch (err) {
        console.log('error: ', err)
    }

    //// OR 
    // User.findById('648f12e109c4c51343b8e359')
    //     .then(user => {
    //         req.user = user;
    //         console.log('ussserrs: ', user, req.user._id)
    //         next();
    //     })
    //     .catch(err => console.log(err));

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(page404Controller.send404);

mongoConnect(() => {
    // const new_user = new User('samcantwait', 'samatkins@gmail.com');
    // new_user.save();
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Connected on port: ${PORT}`);
    });
});