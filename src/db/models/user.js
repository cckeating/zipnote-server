const Sequelize = require('sequelize');

const sequelize = require('../db');

const user = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING,
});

module.exports = user;
