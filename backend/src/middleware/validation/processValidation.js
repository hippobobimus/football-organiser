import { validationResult } from 'express-validator';
import createError from 'http-errors';

const processValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = errors.errors
      .map((err) => `'${err.param}': ${err.msg}`)
      .join(' ');

    return next(
      createError(400, 'Field validation failed. ' + msg, {
        fieldValidationErrors: errors.errors,
      })
    );
  }

  return next();
};

export default processValidation;
