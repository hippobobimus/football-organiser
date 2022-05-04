import { pbkdf2Sync, randomBytes } from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';

const PRIV_KEY =
  process.env.JWT_PRIVATE_KEY ||
  fs.readFileSync(new URL('../../id_rsa_priv.pem', import.meta.url), 'utf8');

function generateHash(password, salt) {
  return pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generatePassword(password) {
  const salt = randomBytes(32).toString('hex');
  const hash = generateHash(password, salt);

  return { hash, salt };
}

function authenticatePassword(password, storedHash, salt) {
  const hash = generateHash(password, salt);

  return hash === storedHash;
}

function issueJWT(user) {
  const expiresIn = '1d';

  const payload = {
    sub: user.id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: 'RS256',
  });

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  };
}

export { issueJWT, generatePassword, authenticatePassword };
