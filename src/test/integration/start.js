/* eslint-disable global-require */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';
require('../../config/config');

const sequelize = require('../../db');

it('Should equal 2', () => {
  return 1 + 1;
});

describe('REST API Integration Tests', () => {
  before(async () => {
    await sequelize.sync({ force: true });
  });
  require('../../modules/auth/routes.spec');

  require('../../modules/notes/routes.spec');

  after(async () => {
    await sequelize.close();
  });
});
