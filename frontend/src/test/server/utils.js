import jwt from 'jsonwebtoken';
import { db } from './db';

const JWT_SECRET = 'woeih12312fd';

export const hash = (str) => {
  let hash = 8364;

  for (let i = str.length; i > 0; i -= 1) {
    hash = (hash * 33) ^ str.charCodeAt(i - 1);
  }

  return String(hash >>> 0);
};

export const authenticate = ({ email, currentPassword }) => {
  const user = db.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });

  const authenticated = user?.password === hash(currentPassword);

  if (!authenticated) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(user.id, JWT_SECRET);

  return { token };
};
