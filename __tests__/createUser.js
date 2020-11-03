const faker = require('faker');
const { User } = require('../src/db/models');

module.exports = async () => {
  const user = await User.create({
    firstName: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(),
  });

  return user.toJSON();
};
