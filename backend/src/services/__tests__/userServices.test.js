import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import * as userServices from '../userServices';
import { User } from '../../models';
import passwordUtils from '../../utils/password';

const testUserInput = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'test@test.com',
  newPassword: 'Password.123',
};

const testUserLogin = {
  email: testUserInput.email,
  currentPassword: testUserInput.newPassword,
};

const testUserId = new mongoose.Types.ObjectId();

const testUserPassword = passwordUtils.generatePassword(
  testUserInput.newPassword
);

const testUserDoc = new User({
  _id: testUserId,
  firstName: 'John',
  lastName: 'Smith',
  name: 'John Smith',
  email: 'test@test.com',
  password: testUserPassword,
  id: testUserId.toString(),
});

const testUserUpdate = {
  firstName: 'Dave',
  lastName: 'Jones',
  email: 'updated@test.com',
  currentPassword: testUserInput.newPassword,
  newPassword: 'Password.12',
};

const testUsers = [
  {
    _id: new mongoose.Types.ObjectId(),
    firstName: 'John',
    lastName: 'Smith',
    name: 'John Smith',
    email: 'test1@test.com',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    firstName: 'Jane',
    lastName: 'Doe',
    name: 'Jane Doe',
    email: 'test2@test.com',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    firstName: 'Lee',
    lastName: 'Jones',
    name: 'Lee Jones',
    email: 'test3@test.com',
  },
];

describe('userServices', () => {
  const issueJWTMock = jest
    .spyOn(passwordUtils, 'issueJWT')
    .mockImplementation((userId) => {
      if (userId === testUserDoc.id) {
        return { token: 'expectedToken' };
      }
      return null;
    });

  describe('get users', () => {
    it('should query database with correct filter and projection', async () => {
      const UserFindMock = jest
        .spyOn(User, 'find')
        .mockResolvedValue(testUsers);

      const filter = {}; // all users
      const projection = { password: 0 }; // exclude password

      await userServices.getUsers();

      expect(UserFindMock).toHaveBeenCalledTimes(1);
      expect(UserFindMock).toHaveBeenCalledWith(filter, projection);
    });

    it('should return an array of all users', async () => {
      jest.spyOn(User, 'find').mockResolvedValue(testUsers);

      const users = await userServices.getUsers();

      expect(users).toEqual(testUsers);
    });
  });

  describe('create user', () => {
    it('should throw if user email already exists', async () => {
      const UserFindOneMock = jest
        .spyOn(User, 'findOne')
        .mockResolvedValue(testUserDoc);

      const filter = { email: testUserInput.email };

      await expect(userServices.createUser(testUserInput)).rejects.toThrow(
        'User already exists.'
      );

      expect(UserFindOneMock).toHaveBeenCalledTimes(1);
      expect(UserFindOneMock).toHaveBeenCalledWith(filter);
    });

    it('should throw if missing input parameters', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      const UserCreateMock = jest.spyOn(User, 'create').mockResolvedValue(null);

      const { firstName, ...noFirstName } = testUserInput;
      const { lastName, ...noLastName } = testUserInput;
      const { email, ...noEmail } = testUserInput;
      const { newPassword, ...noPassword } = testUserInput;

      await expect(userServices.createUser(noFirstName)).rejects.toThrow(
        'Missing user input data.'
      );
      await expect(userServices.createUser(noLastName)).rejects.toThrow(
        'Missing user input data.'
      );
      await expect(userServices.createUser(noEmail)).rejects.toThrow(
        'Missing user input data.'
      );
      await expect(userServices.createUser(noPassword)).rejects.toThrow(
        'Missing user input data.'
      );

      expect(UserCreateMock).not.toHaveBeenCalled();
    });

    it('should create user in database with correct parameters', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      const UserCreateMock = jest
        .spyOn(User, 'create')
        .mockResolvedValue(testUserDoc);

      await userServices.createUser(testUserInput);

      const { newPassword, ...rest } = testUserInput;

      expect(UserCreateMock).toHaveBeenCalledWith({
        password: { hash: expect.any(String), salt: expect.any(String) },
        ...rest,
      });
    });

    it('should return JWT', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'create').mockResolvedValue(testUserDoc);

      const token = await userServices.createUser(testUserInput);

      expect(issueJWTMock).toHaveBeenCalledWith(testUserDoc.id);
      expect(token).toBe('expectedToken');
    });
  });

  describe('login user', () => {
    it('should throw if missing email or password parameters', async () => {
      const UserFindOneMock = jest
        .spyOn(User, 'findOne')
        .mockResolvedValue(testUserDoc);

      const { email, ...noEmail } = testUserLogin;
      const { currentPassword, ...noPassword } = testUserLogin;

      await expect(userServices.login(noEmail)).rejects.toThrow(
        'Missing user input data.'
      );
      await expect(userServices.login(noPassword)).rejects.toThrow(
        'Missing user input data.'
      );

      expect(UserFindOneMock).not.toHaveBeenCalled();
    });

    it('should throw if user does not exist', async () => {
      const UserFindOneMock = jest
        .spyOn(User, 'findOne')
        .mockResolvedValue(null);

      const filter = { email: testUserLogin.email };

      await expect(userServices.login(testUserLogin)).rejects.toThrow(
        'Invalid email or password.'
      );

      expect(UserFindOneMock).toHaveBeenCalledTimes(1);
      expect(UserFindOneMock).toHaveBeenCalledWith(filter);
    });

    it('should throw if password is incorrect', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(testUserDoc);

      await expect(
        userServices.login({
          ...testUserLogin,
          currentPassword: 'wrongPassword',
        })
      ).rejects.toThrow('Invalid email or password.');
    });

    it('should return JWT', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(testUserDoc);

      const token = await userServices.login(testUserLogin);

      expect(issueJWTMock).toHaveBeenCalledWith(testUserDoc.id);
      expect(token).toBe('expectedToken');
    });
  });

  describe('get user', () => {
    it('should throw if user does not exist', async () => {
      const UserFindByIdMock = jest
        .spyOn(User, 'findById')
        .mockResolvedValue(null);

      await expect(userServices.getUser(testUserDoc.id)).rejects.toThrow(
        'User does not exist.'
      );

      expect(UserFindByIdMock).toHaveBeenCalledTimes(1);
      expect(UserFindByIdMock).toHaveBeenCalledWith(testUserDoc.id);
    });

    it('should throw if valid user id not provided', async () => {
      const UserFindByIdMock = jest
        .spyOn(User, 'findById')
        .mockResolvedValue(null);

      await expect(userServices.getUser()).rejects.toThrow('Invalid user id.');
      await expect(userServices.getUser('notanid')).rejects.toThrow(
        'Invalid user id.'
      );

      expect(UserFindByIdMock).not.toHaveBeenCalled();
    });

    it('should return user payload', async () => {
      const UserFindByIdMock = jest
        .spyOn(User, 'findById')
        .mockResolvedValue(testUserDoc);

      const user = await userServices.getUser(testUserDoc.id);

      expect(user).toEqual(testUserDoc);
      expect(UserFindByIdMock).toHaveBeenCalledTimes(1);
      expect(UserFindByIdMock).toHaveBeenCalledWith(testUserDoc.id);
    });
  });

  describe('update user', () => {
    it('should throw if user does not exist', async () => {
      const UserFindByIdMock = jest
        .spyOn(User, 'findById')
        .mockResolvedValue(null);

      jest.spyOn(User.prototype, 'save').mockResolvedValue(null);

      await expect(userServices.updateUser(testUserDoc.id, {})).rejects.toThrow(
        'User does not exist.'
      );

      expect(UserFindByIdMock).toHaveBeenCalledTimes(1);
      expect(UserFindByIdMock).toHaveBeenCalledWith(testUserDoc.id);
    });

    it('should throw if a valid user id or password are not given', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(testUserDoc);
      const UserSaveMock = jest
        .spyOn(User.prototype, 'save')
        .mockResolvedValue(null);

      const { currentPassword, ...noPassword } = testUserUpdate;

      await expect(
        userServices.updateUser(null, testUserUpdate)
      ).rejects.toThrow('Invalid user id.');
      await expect(
        userServices.updateUser('not a user id', testUserUpdate)
      ).rejects.toThrow('Invalid user id.');
      await expect(
        userServices.updateUser(testUserDoc.id, noPassword)
      ).rejects.toThrow('You must provide the current password.');

      expect(UserSaveMock).not.toHaveBeenCalled();
    });

    it('should return updated user payload', async () => {
      const UserFindByIdMock = jest
        .spyOn(User, 'findById')
        .mockResolvedValue(testUserDoc);

      const UserSaveMock = jest
        .spyOn(User.prototype, 'save')
        .mockImplementation(function () {
          return Promise.resolve(this);
        });

      const user = await userServices.updateUser(
        testUserDoc.id,
        testUserUpdate
      );

      expect(user.firstName).toEqual(testUserUpdate.firstName);
      expect(user.lastName).toEqual(testUserUpdate.lastName);
      expect(user.email).toEqual(testUserUpdate.email);
      expect(user.password).not.toEqual(testUserPassword);

      expect(UserFindByIdMock).toHaveBeenCalledTimes(1);
      expect(UserFindByIdMock).toHaveBeenCalledWith(testUserDoc.id);

      expect(UserSaveMock).toHaveBeenCalledTimes(1);
    });
  });
});
