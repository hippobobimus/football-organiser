import { pbkdf2Sync, randomBytes } from 'crypto';
import jsonwebtoken from 'jsonwebtoken';

import {
  REFRESH_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_PUBLIC_KEY,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
} from '../config';

const generateHash = (password, salt) => {
  return pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

export const generatePassword = (password) => {
  const salt = randomBytes(32).toString('hex');
  const hash = generateHash(password, salt);

  return { hash, salt };
};

export const authenticatePassword = (password, storedHash, salt) => {
  const hash = generateHash(password, salt);

  return hash === storedHash;
};

// TODO to be deprecated
export const issueJWT = (userId) => {
  const expiresIn = '1d';

  const payload = {
    sub: userId,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn,
    algorithm: 'RS256',
  });

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  };
};

const issueToken = (userId, privateKey, { expiresIn }) => {
  const payload = {
    sub: userId,
  };

  const signedToken = jsonwebtoken.sign(payload, privateKey, {
    expiresIn,
    algorithm: 'RS256',
  });

  return signedToken;
};

export const issueRefreshToken = (userId) => {
  return issueToken(userId, REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const issueAccessToken = (userId) => {
  return issueToken(userId, ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const verifyRefreshToken = (token) => {
  return jsonwebtoken.verify(token, REFRESH_TOKEN_PUBLIC_KEY);
};

export const verifyAccessToken = (token) => {
  return jsonwebtoken.verify(token, ACCESS_TOKEN_PUBLIC_KEY);
};

export default { issueJWT, generatePassword, authenticatePassword };
