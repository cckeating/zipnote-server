const { validationResult } = require('express-validator');

/**
 * Validation middleware. Checks to see if there was any errors with the request
 *
 *  */
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation result error');
    error.errorMessage = errors.array();
    error.statusCode = 422;
    throw error;
  }
  next();
};
