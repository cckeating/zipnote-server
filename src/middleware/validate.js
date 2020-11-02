const { validationResult } = require('express-validator');

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
