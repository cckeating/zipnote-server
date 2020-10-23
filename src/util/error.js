module.exports = (err, statusCode, errorMessage) => {
  const error = new Error(err);
  error.statusCode = statusCode;
  error.errorMessage = errorMessage;
  throw error;
};
