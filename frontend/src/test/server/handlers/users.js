import { rest } from 'msw';

import { db } from '../db';
import { requireAuth } from '../utils';
import { API_URL } from '../../../config';

export const usersHandlers = [
  rest.get(`${API_URL}/users`, (req, res, ctx) => {
    try {
      requireAuth(req);

      const users = db.user.getAll();

      return res(ctx.json(users));
    } catch (err) {
      return res(
        ctx.status(400),
        ctx.json({ message: err?.message || 'Server error' })
      );
    }
  }),
];
