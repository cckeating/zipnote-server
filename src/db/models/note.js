const Sequelize = require('sequelize');

const sequelize = require('../db');

const note = sequelize.define('note', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
});

module.exports = note;
