const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');

const authService = require('./service')({ User, bcrypt, jwt });

/**
 * POST method to signup to system
 *  */
exports.signup = async (req, res, next) => {
  try {
    const result = await authService.signup({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json({ message: 'New user created', id: result.id });
  } catch (err) {
    next(err);
  }
};

/**
 * POST method to login to system
 *  */
exports.login = async (req, res, next) => {
  try {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
