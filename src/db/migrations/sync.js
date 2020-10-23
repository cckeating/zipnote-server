/* Script to sync database tables - Drops all tables and rebuilds to issue schema updates */

const sequelize = require('../db');

require('../relationships');

async function init() {
  await sequelize.sync({ force: true });
  sequelize.close();
}

init();
