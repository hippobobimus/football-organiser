import request from 'supertest';

import app from '../app';
import * as db from '../config/testDb';
import pwUtils from '../utils/password';
import { User } from '../models';

describe('users', () => {
  let testUsers;
  let users;

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
    await db.clear();
  });

  // TODO
  //
  // POST /api/users
  // GET /api/users/me
  // PUT /api/users/me
  // POST /api/users/login

  describe('GET /api/users', () => {
    it('should return 401 without authorization', async () => {
      const { statusCode } = await request(app).get('/api/users');
      expect(statusCode).toBe(401);
    });

    it('should return 200 with authorization', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode } = await request(app)
        .get('/api/users')
        .set('Authorization', token);

      expect(statusCode).toBe(200);
    });

    it('should return json', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode, headers } = await request(app)
        .get('/api/users')
        .set('Authorization', token);

      expect(statusCode).toBe(200);
      expect(headers['content-type']).toMatch(/json/);
    });

    it('should return all users in database', async () => {
      const { token } = pwUtils.issueJWT(users[0].id);

      const { statusCode, body } = await request(app)
        .get('/api/users')
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
        .get('/api/users')
        .set('Authorization', token);

      expect(statusCode).toBe(200);

      body.forEach((userJson, idx) => {
        const user = users.find((user) => user.id === userJson.id);
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
