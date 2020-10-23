/**
 * Create database connection
 * */

const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
  dialect: 'mysql',
  host: config.DB_HOST,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = sequelize;
