import createError from 'http-errors';
import mongoose from 'mongoose';

import { User } from '../models';
import pwUtils from '../utils/password';

export const createUser = async (input) => {
  const { firstName, lastName, email, newPassword } = input;

  if (!firstName || !lastName || !email || !newPassword) {
    throw createError(400, 'Missing user input data.');
  }

  const foundUser = await User.findOne({ email });

  if (foundUser) {
    throw createError(400, 'User already exists.');
  }

  const { hash, salt } = pwUtils.generatePassword(newPassword);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: { hash, salt },
  });

  const { token } = pwUtils.issueJWT(user.id);

  return token;
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

  const authenticated = pwUtils.authenticatePassword(
    currentPassword,
    user.password.hash,
    user.password.salt
  );

  if (!authenticated) {
    throw createError(401, 'Invalid email or password.');
  }

  const { token } = pwUtils.issueJWT(user.id);

  return token;
};

export const getUsers = async () => {
  const users = await User.find({}, { password: 0 });
  return users;
};

export const getUser = async (id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw createError(401, 'Invalid user id.');
  }

  const user = await User.findById(id);

  if (!user) {
    throw createError(401, 'User does not exist.');
  }

  return user;
};

export const updateUser = async (id, update) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw createError(401, 'Invalid user id.');
  }

  if (update.newPassword && process.env.APP_DEMO_MODE === 'true') {
    throw createError(400, 'Password editing is disabled in demo mode.');
  }

  let user = await User.findById(id);

  if (!user) {
    throw createError(401, 'User does not exist.');
  }

  if (!update.currentPassword) {
    throw createError(401, 'You must provide the current password.');
  }

  // Re-authenticate user.
  const authenticated = pwUtils.authenticatePassword(
    update.currentPassword,
    user.password.hash,
    user.password.salt
  );
  if (!authenticated) {
    throw createError(401, 'Invalid password.');
  }

  // Update fields.
  if (update.firstName) {
    user.firstName = update.firstName;
  }
  if (update.lastName) {
    user.lastName = update.lastName;
  }
  if (update.email) {
    user.email = update.email;
  }
  if (update.newPassword) {
    user.password = pwUtils.generatePassword(update.newPassword);
  }

  user = await user.save();

  // return updated user.
  return user;
};
