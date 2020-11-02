/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const request = require('supertest');
const faker = require('faker');
const { expect } = require('chai');

const authService = require('./service')();

const app = require('../../app');

describe('Auth Routes', () => {
  describe('GET /auth/signup', () => {
    it('Should sign up a user', async () => {
      const data = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const { body, status } = await request(app).post('/v1/auth/signup').send(data);

      expect(status).to.eql(200);
      expect(body.message).to.not.be.null;
      expect(body.id).to.not.be.null;
    });
  });

  describe('GET /auth/login', () => {
    it('Should sign up a user', async () => {
      const data = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      // Create a user
      const createdUser = await authService.signup(data);

      // Test route
      const { body, status } = await request(app).post('/v1/auth/login').send({
        email: data.email,
        password: data.password,
      });

      expect(status).to.eql(200);
      expect(body.name).to.not.be.null;
      expect(body.id).to.eql(createdUser.id);
      expect(body.token).to.not.be.null;
    });
  });
});
