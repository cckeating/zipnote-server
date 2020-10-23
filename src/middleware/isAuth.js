const jwt = require('jsonwebtoken');
const throwError = require('../util/error');
const config = require('../config/config');
const { User } = require('../db/models');

/**
 * Auth middleware - Makes sure request has a valid Authorization token
 * and links user to request object on success so that we can have user info on
 * each request
 *  */
module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throwError('No Authorization header', 401, 'Not authenticated');
  }

  const bearer = authHeader.split(' ')[1];

  let token;
  try {
    token = jwt.verify(bearer, config.JWT_SECRET_KEY);
  } catch (err) {
    throwError('Expired token', 401, 'This token is no longer valid, please login to revalidate');
  }

  if (!token) {
    throwError('Invalid token', 401, 'Not authenticated');
  }

  // Find user by ID and attach user info to the request object
  User.findOne({
    where: { id: token.userId },
  })
    .then((user) => {
      req.user = user.toJSON();
      next();
    })
    .catch(() => {
      next(throwError('Failed to find user', 401, 'Not authenticated'));
    });
};
