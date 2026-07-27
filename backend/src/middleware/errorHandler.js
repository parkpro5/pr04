const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    logger.error(err.stack || err.message);
  }
  res.status(statusCode).json({
    error: {
      message: statusCode >= 500 ? 'Internal server error' : err.message,
    },
  });
}

module.exports = errorHandler;
