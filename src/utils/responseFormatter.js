const formatResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    statusCode,
    message,
    data,
  };
};

const formatError = (message, statusCode = 500, error = null) => {
  return {
    statusCode,
    message,
    error: error ? error.message : null,
  };
};

module.exports = {
  formatResponse,
  formatError,
};
