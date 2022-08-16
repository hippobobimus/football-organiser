import fs from 'fs';

export const REFRESH_TOKEN_PUBLIC_KEY =
  process.env.JWT_PUBLIC_KEY ||
  fs.readFileSync(
    new URL('../../keys/id_rsa_pub_refresh.pem', import.meta.url),
    'utf8'
  );

export const REFRESH_TOKEN_PRIVATE_KEY =
  process.env.JWT_PRIVATE_KEY ||
  fs.readFileSync(
    new URL('../../keys/id_rsa_priv_refresh.pem', import.meta.url),
    'utf8'
  );

export const ACCESS_TOKEN_PUBLIC_KEY =
  process.env.JWT_PUBLIC_KEY ||
  fs.readFileSync(
    new URL('../../keys/id_rsa_pub_access.pem', import.meta.url),
    'utf8'
  );

export const ACCESS_TOKEN_PRIVATE_KEY =
  process.env.JWT_PRIVATE_KEY ||
  fs.readFileSync(
    new URL('../../keys/id_rsa_priv_access.pem', import.meta.url),
    'utf8'
  );

export const REFRESH_TOKEN_EXPIRES_IN = '1d';

export const ACCESS_TOKEN_EXPIRES_IN = '20s';

export const REFRESH_COOKIE_MAX_AGE_MS = 1 * 24 * 60 * 60 * 1000;
