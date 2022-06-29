import logger from '../config/logger';

const errorHandler = (err, req, res, next) => {
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
