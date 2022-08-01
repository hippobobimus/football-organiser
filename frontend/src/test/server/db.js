import { factory, primaryKey } from '@mswjs/data';

const models = {
  user: {
    id: primaryKey(String),
    firstName: String,
    lastName: String,
    email: String,
    password: {
      hash: String,
      salt: String,
    },
    role: String,
    name: String,
    isAdmin: Boolean,
  },
};

export const db = factory(models);