import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';

const models = {
  user: {
    id: primaryKey(faker.datatype.uuid),
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    name: String,
    isAdmin: Boolean,
  },
  event: {
    id: primaryKey(faker.datatype.uuid),
    name: String,
    category: String,
    time: {
      buildUp: Date,
      start: Date,
      end: Date,
    },
    location: {
      name: String,
      line1: String,
      line2: String,
      town: String,
      postcode: String,
    },
    capacity: Number,
    isCancelled: Boolean,
    attendees: manyOf('attendee'),
    numAttendees: Number,
    isFinished: Boolean,
    isFull: Boolean,
  },
  attendee: {
    id: primaryKey(faker.datatype.uuid),
    event: oneOf('event'),
    user: oneOf('user'),
    guests: Number,
  },
};

export const db = factory(models);
