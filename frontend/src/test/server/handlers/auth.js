import { rest } from 'msw';
import uniqid from 'uniqid';

import { db } from '../db';
import { authenticate, hash } from '../utils';
import { API_URL } from '../../../config';

export const authHandlers = [
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    try {
      const credentials = req.body;
      const result = authenticate(credentials);
      return res(ctx.json(result));
    } catch (err) {
      return res(
        ctx.status(401),
        ctx.json({ message: err?.message || 'Server error' })
      );
    }
  }),

  rest.post(`${API_URL}/auth/register`, (req, res, ctx) => {
    try {
      const userData = req.body;

      const foundUser = db.user.findFirst({
        where: {
          email: {
            equals: userData.email,
          },
        },
      });

      if (foundUser) {
        throw new Error('A user with this email address already exists');
      }

      db.user.create({
        ...userData,
        id: uniqid(),
        password: hash(userData.newPassword),
        role: 'user',
        isAdmin: false,
      });

      const result = authenticate({
        email: userData.email,
        currentPassword: userData.newPassword,
      });

      return res(ctx.json(result));
    } catch (err) {
      return res(
        ctx.status(400),
        ctx.json({ message: err?.message || 'Server error' })
      );
    }
  }),

  rest.get(`${API_URL}/auth/refresh`, (req, res, ctx) => {
    return res(ctx.status(401), ctx.json({ message: 'Unauthorised' }));
  }),
];
