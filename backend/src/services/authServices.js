import createError from 'http-errors';

import { User } from '../models';
import {
  authenticatePassword,
  generatePassword,
  issueRefreshToken,
  issueAccessToken,
  verifyRefreshToken,
} from '../utils/password';

export const registerUser = async (input) => {
  const { firstName, lastName, email, newPassword } = input;

  if (!firstName || !lastName || !email || !newPassword) {
    throw createError(400, 'Missing user input data.');
  }

  const foundUser = await User.findOne({ email });

  if (foundUser) {
    throw createError(400, 'User already exists.');
  }

  const { hash, salt } = generatePassword(newPassword);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: { hash, salt },
  });

  const refreshToken = issueRefreshToken(user.id);
  const accessToken = issueAccessToken(user.id);

  return { refreshToken, accessToken };
};

export const login = async (input) => {
  const { email, currentPassword } = input;

  if (!email || !currentPassword) {
    throw createError(401, 'Missing user input data.');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw createError(401, 'Invalid email or password.');
  }

  const authenticated = authenticatePassword(
    currentPassword,
    user.password.hash,
    user.password.salt
  );

  if (!authenticated) {
    throw createError(401, 'Invalid email or password.');
  }

  const refreshToken = issueRefreshToken(user.id);
  const accessToken = issueAccessToken(user.id);

  return { refreshToken, accessToken };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  // TODO revoke refresh token.
  console.log('revoke token');
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(401, 'Invalid refresh token');
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw createError(401, 'Access denied, invalid token.');
  }

  const { sub: id } = payload;

  const user = await User.findById(id).select('-password');

  if (!user) {
    throw createError(401, 'User does not exist.');
  }

  const newRefreshToken = issueRefreshToken(user.id);
  const accessToken = issueAccessToken(user.id);

  return { refreshToken: newRefreshToken, accessToken };
};
