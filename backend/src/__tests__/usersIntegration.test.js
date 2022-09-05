import request from 'supertest';

import app from '../app';
import * as db from '../test/database';
import { createAuthUser, createUsers } from '../test/utils';

describe('users', () => {
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

  describe('GET /api/users', () => {
    const path = '/api/users';

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

    it('should return all users in database', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      // check number of users (+1 for auth user).
      expect(body.length).toBe(users.length + 1);

      // check uniqueness
      const ids = new Set(body.map((user) => user.id));
      expect(ids.size).toBe(users.length + 1);
    });

    it('should return correct user fields', async () => {
      const { statusCode, body } = await request(app)
        .get(path)
        .set('Authorization', `bearer ${auth.accessToken}`);

      expect(statusCode).toBe(200);

      const usersAndAuthUser = users.concat([auth.user]);

      body.forEach((userJson) => {
        const user = usersAndAuthUser.find((curr) => curr.id === userJson.id);
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
