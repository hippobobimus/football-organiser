import jwt from 'jsonwebtoken';
import { db } from './db';
import { JWT_SECRET } from '../../config';

export const hash = (str) => {
  let hash = 8364;

  for (let i = str.length; i > 0; i -= 1) {
    hash = (hash * 33) ^ str.charCodeAt(i - 1);
  }

  return String(hash >>> 0);
};

export const authenticate = ({ email, currentPassword }) => {
  const user = db.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });

  const authenticated = user?.password === hash(currentPassword);

  if (!authenticated) {
    throw new Error('Invalid email or password');
  }

  const accessToken = jwt.sign(user.id, JWT_SECRET);

  return { accessToken };
};

export const requireAuth = (req, options) => {
  if (!req.headers.get('authorization')) {
    throw new Error('Invalid access token');
  }

  const {
    0: tokenType,
    1: token,
    length,
  } = req.headers.get('authorization').split(' ');

  if (length !== 2 || tokenType.toLowerCase() !== 'bearer') {
    throw new Error('Access denied, invalid token.');
  }

  const userId = jwt.verify(token, JWT_SECRET);

  const user = db.user.findFirst({
    where: {
      id: {
        equals: userId,
      },
    },
  });

  if (!user) {
    throw new Error('Invalid access token, user does not exist');
  }

  if (options?.admin && !user.isAdmin) {
    throw new Error('Access denied, insufficient privileges');
  }

  return user;
};
