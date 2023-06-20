const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const page404Controller = require('./controllers/404');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('6491c84a6a315c03a08dee91');
        if (!user) throw 'User does not exist!';
        req.user = user;
        next();
    } catch (err) {
        console.log('error: ', err)
    }
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(page404Controller.send404);

mongoose
    .connect(`mongodb+srv://samatkins:${process.env.MONGODB_PASS}@nodecluster.s7zhua5.mongodb.net/shop?retryWrites=true&w=majority`)
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const new_user = new User({
                        name: 'samcantwait',
                        email: 'samatkins@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    new_user.save();
                }
            })
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Connected on port: ${PORT}`);
        });
    })
    .catch(err => console.log(err));
