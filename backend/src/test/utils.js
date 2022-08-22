import {
  generatePassword,
  issueAccessToken,
  issueRefreshToken,
} from '../utils/password';
import { User } from '../models';
import { userGenerator } from './dataGenerators';

export const createUser = async (overrides) => {
  const userData = userGenerator(overrides);

  let user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: generatePassword(userData.newPassword),
  });

  user = await user.save();

  return user;
};

export const createAuthUser = async (overrides) => {
  const password = overrides?.newPassword || 'Password.123';

  const user = await createUser({ newPassword: password, ...overrides });

  const accessToken = issueAccessToken(user.id);
  const refreshToken = issueRefreshToken(user.id);

  return { accessToken, refreshToken, user, password };
};

export const createUsers = async (qty, overrides) => {
  let userPromises = [];

  for (let i = 0; i < qty; i += 1) {
    userPromises.push(createUser(overrides));
  }

  return Promise.all(userPromises);
};
