import createError from 'http-errors';

import { User } from '../models';
import { verifyAccessToken } from '../utils/password';

// TODO allowed roles
// const protect = (allowedRoles = ['user']) => async (req, res, next) => {

const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(createError(401, 'Access denied, invalid token.'));
  }

  const {
    0: tokenType,
    1: token,
    length,
  } = req.headers.authorization.split(' ');

  if (length !== 2 || tokenType.toLowerCase() !== 'bearer') {
    return next(createError(401, 'Access denied, invalid token.'));
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    return next(createError(401, 'Access denied, invalid token.'));
  }

  const { sub: id } = payload;

  let user;
  try {
    user = await User.findById(id).select('-password');
  } catch (err) {
    return next(err);
  }

  if (!user) {
    return next(createError(401, 'User does not exist.'));
  }

  req.user = user;
  return next();
};

const protectAdmin = [
  protect,
  (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }

    return next(
      createError(403, 'Insufficient privileges to access resource.')
    );
  },
];

export { protect, protectAdmin };
