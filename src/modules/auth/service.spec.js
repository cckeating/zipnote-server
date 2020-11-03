/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const sinon = require('sinon');
const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;
chai.use(chaiAsPromised);

const SignupService = require('./service');

describe('Auth Service', () => {
  const User = {
    findOne: () => {},
    create: () => {},
  };

  const bcrypt = {
    hash: () => {},
    compare: () => {},
  };

  const jwt = {
    sign: () => {},
  };

  afterEach(() => {
    sinon.restore();
  });

  // Signup Method
  describe('Signup', () => {
    const signupDTO = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    it('Should create a new user if one does not already exist', async () => {
      const randomId = faker.random.number();
      const bcryptHashStub = sinon.stub(bcrypt, 'hash').returns(signupDTO.password);
      const userFindOneStub = sinon.stub(User, 'findOne').returns(null);
      const userCreateStub = sinon.stub(User, 'create').returns({
        id: randomId,
        ...signupDTO,
      });

      const service = SignupService({ User, jwt, bcrypt });

      const result = await service.signup(signupDTO);

      expect(result).to.eql({
        id: randomId,
        firstName: signupDTO.firstName,
        lastName: signupDTO.lastName,
      });
      expect(bcryptHashStub.calledOnceWith(signupDTO.password)).to.be.true;
      expect(userFindOneStub.calledOnceWithExactly({ where: { email: signupDTO.email } })).to.be
        .true;
      expect(userCreateStub.calledOnceWithExactly(signupDTO));
    });

    it('Should throw an error with 409 status code if email is in use', () => {
      sinon.stub(User, 'findOne').returns({
        id: faker.random.number(),
      });

      const service = SignupService({ User, jwt, bcrypt });

      return expect(service.signup(signupDTO))
        .to.eventually.rejectedWith('Failed to create new user')
        .with.property('statusCode', 409);
    });
  });

  // Login Method
  describe('Login', () => {
    const loginDTO = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const mockUser = {
      id: faker.random.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    it('Should return a successful login object on success', async () => {
      const userFindOneStub = sinon.stub(User, 'findOne').returns(mockUser);
      const bcryptCompareStub = sinon.stub(bcrypt, 'compare').returns(true);
      const jwtSignStub = sinon.stub(jwt, 'sign').returns({ userId: mockUser.id });

      const service = SignupService({ User, jwt, bcrypt });
      const result = await service.login(loginDTO);

      expect(result.name).to.eql(`${mockUser.firstName} ${mockUser.lastName}`);
      expect(result.id).to.eql(mockUser.id);
      expect(result.token).to.not.be.null;
      expect(userFindOneStub.calledOnceWithExactly({ where: { email: loginDTO.email } })).to.be
        .true;
      expect(bcryptCompareStub.calledOnceWithExactly(loginDTO.password, mockUser.password)).to.be
        .true;
      expect(jwtSignStub.calledOnce).to.be.true;
    });

    it('Should throw a "User not found" error with statusCode 401 when user with email does not exist', () => {
      sinon.stub(User, 'findOne').returns(null);

      const service = SignupService({ User, jwt, bcrypt });
      return expect(service.login(loginDTO))
        .to.eventually.rejectedWith('User not found')
        .with.property('statusCode', 401);
    });

    it('Should throw a "User not found" error with statusCode 401 when passwords do not match', () => {
      sinon.stub(User, 'findOne').returns(mockUser);
      sinon.stub(bcrypt, 'compare').returns(false);

      const service = SignupService({ User, jwt, bcrypt });

      return expect(service.login(loginDTO))
        .to.eventually.rejectedWith('Invalid password')
        .with.property('statusCode', 401);
    });
  });
});
