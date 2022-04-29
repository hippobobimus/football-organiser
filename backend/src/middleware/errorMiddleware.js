const errorHandler = (err, req, res, next) => {
  if (err.statusCode < 400 || !err.statusCode) {
    err.statusCode = 500;
  }

  res.status(err.statusCode);

  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
};

export { errorHandler };
