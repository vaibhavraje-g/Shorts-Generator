const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(500).send('Something broke!');
}

module.exports = errorHandler;