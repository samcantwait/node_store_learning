const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_store_sequelize', 'root', 'H5lloM0t0!', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;