import request from 'supertest';

import app from '../app';
import * as db from '../config/testDb';
import pwUtils from '../utils/password';
import { User } from '../models';

describe('users', () => {
  let testUsers;
  let users;
  const testPassword = 'Password.123';
  const newUserInput = {
    firstName: 'Bill',
    lastName: 'Green',
    email: 'test@test.com',
    newPassword: 'Password.123',
  };

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    // populate db
    testUsers = [
      new User({
        firstName: 'John',
        lastName: 'Smith',
        email: 'test1@test.com',
        password: pwUtils.generatePassword('Password.123'),
      }),
      new User({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'test2@test.com',
        password: pwUtils.generatePassword('Password.123'),
      }),
      new User({
        firstName: 'Anne',
        lastName: 'Jones',
        email: 'test3@test.com',
        password: pwUtils.generatePassword('Password.123'),
      }),
    ];
    users = await Promise.all(testUsers.map(async (user) => user.save()));
  });

  afterEach(async () => {
    testUsers = null;
    users = null;
    await db.clear();
  });

  describe('POST /api/users', () => {
    const path = '/api/users';

    it('should return 400 if the given email is already associated with an account', async () => {
      const existingUser = { ...newUserInput, email: testUsers[0].email };
      const { statusCode } = await request(app).post(path).send(existingUser);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if a first name, last name, email or new password are not provided', async () => {
      const { firstName, ...noFirstName } = newUserInput;
      const { lastName, ...noLastName } = newUserInput;
      const { email, ...noEmail } = newUserInput;
      const { newPassword, ...noPassword } = newUserInput;

      [noFirstName, noLastName, noEmail, noPassword].forEach(async (body) => {
        const { statusCode } = await request(app).post(path).send(body);
        expect(statusCode).toBe(400);
      });
    });

    it('should return 400 if a weak password is provided', async () => {
      const weakPassword = { ...newUserInput, newPassword: 'password' };
      const { statusCode } = await request(app).post(path).send(weakPassword);

      expect(statusCode).toBe(400);
    });

    it('should return 200 if valid input is provided', async () => {
      const { statusCode } = await request(app).post(path).send(newUserInput);

      expect(statusCode).toBe(200);
    });

    it('should return json if valid input is provided', async () => {
      const { headers } = await request(app).post(path).send(newUserInput);

      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return auth token if valid input is provided', async () => {
      const { body } = await request(app).post(path).send(newUserInput);

      expect(body.token).toEqual(expect.any(String));
      expect(body.token).toMatch(/^Bearer/);
    });
  });

  describe('GET /api/users/me', () => {
    const path = '/api/users/me';

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get(path);
      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode, headers } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return auth user', async () => {
      const userId = users[0].id;
      const { token } = pwUtils.issueJWT(userId);

      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);
      expect(body.id).toBe(userId);
    });

    it('should return correct user fields', async () => {
      const user = users[0];
      const { token } = pwUtils.issueJWT(user.id);

      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: user.id,
        createdAt: expect.any(String),
        email: user.email,
        firstName: user.firstName,
        id: user.id,
        isAdmin: false,
        lastName: user.lastName,
        name: user.name,
        role: user.role,
        updatedAt: expect.any(String),
      });
    });
  });

  describe('PUT /api/users/me', () => {
    const path = '/api/users/me';
    const userUpdate = {
      firstName: 'Gladys',
      lastName: 'Barker',
      email: 'updated@test.com',
      currentPassword: testPassword,
      newPassword: 'Newpassword.123',
    };

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).put(path).send(userUpdate);
      expect(statusCode).toBe(401);
    });

    it('should return 401 if the current password is not provided or is invalid', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);
      const { currentPassword, ...noPassword } = userUpdate;

      const { statusCode } = await request(app)
        .put(path)
        .set('Authorization', token)
        .send(noPassword);

      // input validation error
      expect(statusCode).toBe(400);
    });

    it('should return 401 if the current password is incorrect', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode } = await request(app)
        .put(path)
        .set('Authorization', token)
        .send({ ...userUpdate, currentPassword: 'wrongPassword.123' });

      expect(statusCode).toBe(401);
    });

    it('should return 200 when authorization token and correct password are given', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode } = await request(app)
        .put(path)
        .set('Authorization', token)
        .send(userUpdate);

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode, headers } = await request(app)
        .put(path)
        .set('Authorization', token)
        .send(userUpdate);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should allow individual user fields to be updated', async () => {
      const userId = users[0].id;
      const { token } = pwUtils.issueJWT(userId);

      let res;

      // strange behaviour from jest when run in loop, hence the below
      res = await request(app).put(path).set('Authorization', token).send({
        currentPassword: userUpdate.currentPassword,
        firstName: userUpdate.firstName,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.firstName).toBe(userUpdate.firstName);

      res = await request(app).put(path).set('Authorization', token).send({
        currentPassword: userUpdate.currentPassword,
        lastName: userUpdate.lastName,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.lastName).toBe(userUpdate.lastName);

      res = await request(app).put(path).set('Authorization', token).send({
        currentPassword: userUpdate.currentPassword,
        email: userUpdate.email,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.lastName).toBe(userUpdate.lastName);

      res = await request(app).put(path).set('Authorization', token).send({
        currentPassword: userUpdate.currentPassword,
        newPassword: userUpdate.newPassword,
      });
      expect(res.statusCode).toBe(200);
    });

    it('should return updated user', async () => {
      const user = users[0];
      const { token } = pwUtils.issueJWT(user.id);

      const { statusCode, body } = await request(app)
        .put(path)
        .set('Authorization', token)
        .send(userUpdate);

      expect(statusCode).toBe(200);
      expect(body).toEqual({
        __v: 0,
        _id: user.id,
        createdAt: expect.any(String),
        email: userUpdate.email,
        firstName: userUpdate.firstName,
        id: user.id,
        isAdmin: false,
        lastName: userUpdate.lastName,
        name: userUpdate.firstName + ' ' + userUpdate.lastName,
        role: user.role,
        updatedAt: expect.any(String),
      });
    });
  });

  describe('POST /api/users/login', () => {
    const path = '/api/users/login';

    it('should return 401 if the given email is not already associated with an account', async () => {
      const login = {
        email: 'notfound@test.com',
        currentPassword: testPassword,
      };

      const { statusCode } = await request(app).post(path).send(login);

      expect(statusCode).toBe(401);
    });

    it('should return 400 if an email is not provided', async () => {
      const { statusCode } = await request(app)
        .post(path)
        .send({ currentPassword: testPassword });

      // fails validation
      expect(statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      const user = users[0];

      const { statusCode } = await request(app)
        .post(path)
        .send({ email: user.email });

      // fails validation
      expect(statusCode).toBe(400);
    });

    it('should return 401 if an incorrect password is provided', async () => {
      const user = users[0];

      const { statusCode } = await request(app).post(path).send({
        email: user.email,
        currentPassword: 'WrongPassword.123',
      });

      expect(statusCode).toBe(401);
    });

    it('should return 200 if valid email and password provided', async () => {
      const user = users[0];

      const { statusCode } = await request(app).post(path).send({
        email: user.email,
        currentPassword: testPassword,
      });

      expect(statusCode).toBe(200);
    });

    it('should return json if valid input is provided', async () => {
      const user = users[0];

      const { statusCode, headers } = await request(app).post(path).send({
        email: user.email,
        currentPassword: testPassword,
      });

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return auth token if valid input is provided', async () => {
      const user = users[0];

      const { statusCode, body } = await request(app).post(path).send({
        email: user.email,
        currentPassword: testPassword,
      });

      expect(statusCode).toBe(200);
      expect(body.token).toEqual(expect.any(String));
      expect(body.token).toMatch(/^Bearer/);
    });
  });

  describe('GET /api/users', () => {
    const path = '/api/users';

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get(path);
      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode, headers } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return all users in database', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      // check number of users
      expect(body.length).toBe(users.length);

      // check uniqueness
      const ids = new Set(body.map((user) => user.id));
      expect(ids.size).toBe(users.length);
    });

    it('should return correct user fields', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      body.forEach((userJson) => {
        const user = users.find((curr) => curr.id === userJson.id);
        expect(userJson).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          email: user.email,
          firstName: user.firstName,
          id: expect.any(String),
          isAdmin: false,
          lastName: user.lastName,
          name: user.name,
          role: user.role,
          updatedAt: expect.any(String),
        });
      });
    });
  });
});
