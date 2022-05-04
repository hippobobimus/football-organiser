import fs from 'fs';
import createError from 'http-errors';
import jsonwebtoken from 'jsonwebtoken';

import { User } from '../models';

const PUB_KEY =
  process.env.JWT_PUBLIC_KEY ||
  fs.readFileSync(new URL('../../id_rsa_pub.pem', import.meta.url), 'utf8');

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
    payload = jsonwebtoken.verify(token, PUB_KEY);
  } catch (err) {
    return next(createError(401, 'Access denied, invalid token.'))
  }

  const { sub: id } = payload;

  let user;
  try {
    user = await User.findById(id).select('-password');
  } catch (err) {
    return next(err);
  }

  if (!user) {
    return next(createError(401, 'User does not exist.'))
  }

  req.user = user;
  return next();
};

export { protect };
