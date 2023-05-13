const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.engine('hbs', engine({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout.hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not Found' })
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Connected on port: ${PORT}`)
})