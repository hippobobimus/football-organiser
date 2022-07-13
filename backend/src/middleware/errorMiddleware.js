import logger from '../config/logger';

// error middleware must have a func signature with 4 parameters in order for it to
// be differentiated from normal middleware, so next must be included even though unused.
/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  const statusCode =
    err.statusCode < 400 || !err.statusCode ? 500 : err.statusCode;

  logger.error(err.message, { name: err.name, statusCode, stack: err.stack });

  res.status(statusCode);

  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
};

export { errorHandler };
