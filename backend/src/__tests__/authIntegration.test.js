import request from 'supertest';

import app from '../app';
import * as db from '../config/testDb';
import { createAuthUser, createUsers } from '../test/utils';
import { userGenerator } from '../test/dataGenerators';

describe('auth', () => {
  let users;
  let auth;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    // populate db
    users = await createUsers(3);
    auth = await createAuthUser();
  });

  afterEach(async () => {
    await db.clear();
  });

  describe('POST /api/auth/register', () => {
    const path = '/api/auth/register';

    it('should return 400 if the given email is already associated with an account', async () => {
      const existingUser = userGenerator({ email: users[0].email });
      const { statusCode } = await request(app).post(path).send(existingUser);

      expect(statusCode).toBe(400);
    });

    it('should return 400 if a first name, last name, email or new password are not provided', async () => {
      const noFirstName = userGenerator({ firstName: '' });
      const noLastName = userGenerator({ lastName: '' });
      const noEmail = userGenerator({ email: '' });
      const noPassword = userGenerator({ newPassword: '' });

      await Promise.all(
        [noFirstName, noLastName, noEmail, noPassword].map(async (body) => {
          const { statusCode } = await request(app).post(path).send(body);
          expect(statusCode).toBe(400);
        })
      );
    });

    it('should return 400 if a weak password is provided', async () => {
      const weakPassword = 'password';
      const userData = userGenerator({ newPassword: weakPassword });

      const { statusCode } = await request(app).post(path).send(userData);

      expect(statusCode).toBe(400);
    });

    it('should return 200 if valid input is provided', async () => {
      const userData = userGenerator();
      const { statusCode } = await request(app).post(path).send(userData);

      expect(statusCode).toBe(200);
    });

    it('should return json if valid input is provided', async () => {
      const userData = userGenerator();
      const { headers } = await request(app).post(path).send(userData);

      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return access token and set refresh token cookie if valid input is provided', async () => {
      const userData = userGenerator();
      const { body, headers } = await request(app).post(path).send(userData);

      expect(body.accessToken).toEqual(expect.any(String));
      expect(headers['set-cookie'][0]).toMatch(
        /refreshToken=.*; Max-Age=86400; Path=\/; Expires=.*; HttpOnly/
      );
    });
  });

  describe('POST /api/auth/login', () => {
    const path = '/api/auth/login';

    it('should return 401 if the given email is not already associated with an account', async () => {
      const login = {
        email: 'notfound@test.com',
        currentPassword: auth.password,
      };

      const { statusCode } = await request(app).post(path).send(login);

      expect(statusCode).toBe(401);
    });

    it('should return 400 if an email is not provided', async () => {
      const { statusCode } = await request(app)
        .post(path)
        .send({ currentPassword: auth.password });

      // fails validation
      expect(statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      const { statusCode } = await request(app)
        .post(path)
        .send({ email: auth.user.email });

      // fails validation
      expect(statusCode).toBe(400);
    });

    it('should return 401 if an incorrect password is provided', async () => {
      const { statusCode } = await request(app).post(path).send({
        email: auth.user.email,
        currentPassword: 'WrongPassword.123',
      });

      expect(statusCode).toBe(401);
    });

    it('should return 200 if valid email and password provided', async () => {
      const { statusCode } = await request(app).post(path).send({
        email: auth.user.email,
        currentPassword: auth.password,
      });

      expect(statusCode).toBe(200);
    });

    it('should return json if valid input is provided', async () => {
      const { statusCode, headers } = await request(app).post(path).send({
        email: auth.user.email,
        currentPassword: auth.password,
      });

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return access token and set refresh token cookie if valid input is provided', async () => {
      const { statusCode, body, headers } = await request(app).post(path).send({
        email: auth.user.email,
        currentPassword: auth.password,
      });

      expect(statusCode).toBe(200);
      expect(body.accessToken).toEqual(expect.any(String));
      expect(headers['set-cookie'][0]).toMatch(
        /refreshToken=.*; Max-Age=86400; Path=\/; Expires=.*; HttpOnly/
      );
    });
  });

  describe('POST /api/auth/logout', () => {
    const path = '/api/auth/logout';

    it('should clear refresh token cookie', async () => {
      const { statusCode, headers } = await request(app)
        .post(path)
        .set('Cookie', [`refreshToken=${auth.refreshToken}; Path=/; HttpOnly`]);

      expect(statusCode).toBe(204);
      expect(headers['set-cookie'][0]).toMatch(
        /refreshToken=; Path=\/; Expires=.*; HttpOnly/
      );
    });
  });

  describe('GET /api/auth/refresh', () => {
    const path = '/api/auth/refresh';

    it('should provide a new access token and rotate the refresh token if refresh token is valid', async () => {
      const { statusCode, body, headers } = await request(app)
        .get(path)
        .set('Cookie', [`refreshToken=${auth.refreshToken}; Path=/; HttpOnly`]);

      expect(statusCode).toBe(200);
      expect(body.accessToken).toEqual(expect.any(String));
      expect(headers['set-cookie'][0]).toMatch(
        /refreshToken=.*; Max-Age=86400; Path=\/; Expires=.*; HttpOnly/
      );
    });

    it('should return 401 and clear the refresh token cookie if the refresh token is invalid', async () => {
      const { statusCode, headers } = await request(app)
        .get(path)
        .set('Cookie', [`refreshToken=invalidtokenstring; Path=/; HttpOnly`]);

      expect(statusCode).toBe(401);
      expect(headers['set-cookie'][0]).toMatch(
        /refreshToken=; Path=\/; Expires=.*; HttpOnly/
      );
    });
  });

  describe('GET /api/auth/user', () => {
    const path = '/api/auth/user';

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get(path);
      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { statusCode } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return auth user', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);
      expect(body.id).toBe(auth.user.id);
    });

    it('should return correct user fields', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: auth.user.id,
        createdAt: expect.any(String),
        email: auth.user.email,
        firstName: auth.user.firstName,
        id: auth.user.id,
        isAdmin: false,
        lastName: auth.user.lastName,
        name: auth.user.name,
        role: auth.user.role,
        updatedAt: expect.any(String),
      });
    });
  });

  describe('PATCH /api/auth/user', () => {
    const path = '/api/auth/user';
    let update;

    beforeEach(() => {
      update = userGenerator({
        newPassword: 'Newpassword.123',
        currentPassword: auth.password,
      });
    });

    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).patch(path).send(update);
      expect(statusCode).toBe(401);
    });

    it('should return 401 if the current password is not provided', async () => {
      const { currentPassword, ...noPassword } = update;

      const { statusCode } = await request(app)
        .patch(path)
        .set('Authorization', `bearer ${auth.accessToken}`)
        .send(noPassword);

      // input validation error
      expect(statusCode).toBe(400);
    });

    it('should return 401 if the current password is incorrect', async () => {
      const { statusCode } = await request(app)
        .patch(path)
        .set('Authorization', `bearer ${auth.accessToken}`)
        .send({ ...update, currentPassword: 'wrongPassword.123' });

      expect(statusCode).toBe(401);
    });

    it('should return 200 when authorization token and correct password are given', async () => {
      const { statusCode } = await request(app)
        .patch(path)
        .set('Authorization', `bearer ${auth.accessToken}`)
        .send(update);

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { statusCode, headers } = await request(app)
        .patch(path)
        .set('Authorization', `bearer ${auth.accessToken}`)
        .send(update);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should allow individual user fields to be updated', async () => {
      const { currentPassword, ...rest } = update;
      const updateFields = Object.entries(rest);

      await Promise.all(
        updateFields.map(async ([key, val]) => {
          const { statusCode, body } = await request(app)
            .patch(path)
            .set('Authorization', `bearer ${auth.accessToken}`)
            .send({
              currentPassword,
              [key]: val,
            });
          expect(statusCode).toBe(200);
          if (key !== 'newPassword') {
            expect(body[key]).toBe(val);
          }
        })
      );
    });

    it('should return updated user', async () => {
      const { statusCode, body } = await request(app)
        .patch(path)
        .set('Authorization', `bearer ${auth.accessToken}`)
        .send(update);

      expect(statusCode).toBe(200);
      expect(body).toEqual({
        __v: 0,
        _id: auth.user.id,
        createdAt: expect.any(String),
        email: update.email,
        firstName: update.firstName,
        id: auth.user.id,
        isAdmin: false,
        lastName: update.lastName,
        name: update.firstName + ' ' + update.lastName,
        role: auth.user.role,
        updatedAt: expect.any(String),
      });
    });
  });
});
