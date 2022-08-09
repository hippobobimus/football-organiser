import { rest } from 'msw';
import { authenticate } from '../utils';

const API_URL = '/api';

export const usersHandlers = [
  rest.post(`${API_URL}/users/login`, (req, res, ctx) => {
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
];
