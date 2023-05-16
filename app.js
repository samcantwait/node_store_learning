const express = require('express');
const path = require('path');
// const { engine } = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const page404Controller = require('./controllers/404')

const app = express();

// app.engine('hbs', engine({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout.hbs' }));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(page404Controller.send404);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Connected on port: ${PORT}`)
})