import mongoose from 'mongoose';
import { add, sub } from 'date-fns';

import pwUtils from './utils/password';
import { Attendee, Event, User } from './models';

export const standardUser = () => {
  return new User({
    firstName: 'Fred',
    lastName: 'Testington',
    email: 'test@test.com',
    password: pwUtils.generatePassword('Password.123'),
  });
};

export const adminUser = () => {
  return new User({
    firstName: 'Wilma',
    lastName: 'Atest',
    email: 'testadmin@test.com',
    password: pwUtils.generatePassword('Password.123'),
    role: 'admin',
  });
};

export const users = () => {
  return [
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
};

export const requiredEventInput = () => {
  const now = new Date();

  return {
    category: 'match',
    buildUpTime: add(now, { days: 1 }),
    startTime: add(now, { days: 1, minutes: 15 }),
    endTime: add(now, { days: 1, hours: 1, minutes: 15 }),
    locationLine1: 'Location test line1',
    locationTown: 'Location test town',
    locationPostcode: 'W1A 1AA',
  };
};

export const fullEventInput = () => {
  const now = new Date();

  return {
    name: 'Test Event',
    category: 'match',
    buildUpTime: add(now, { days: 1 }),
    startTime: add(now, { days: 1, minutes: 15 }),
    endTime: add(now, { days: 1, hours: 1, minutes: 15 }),
    locationName: 'Location test name',
    locationLine1: 'Location test line1',
    locationLine2: 'Location test line2',
    locationTown: 'Location test town',
    locationPostcode: 'W1A 1AA',
    capacity: 10,
  };
};

export const events = () => {
  const now = new Date();

  return [
    new Event({
      name: 'Future Event A',
      category: 'match',
      time: {
        buildUp: add(now, { days: 1 }),
        start: add(now, { days: 1, minutes: 15 }),
        end: add(now, { days: 1, hours: 1, minutes: 15 }),
      },
      location: {
        name: 'Location name A',
        line1: 'Location line1 A',
        line2: 'Location line2 A',
        town: 'Location town A',
        postcode: 'Location postcode A',
      },
      capacity: 10,
      isCancelled: false,
    }),
    new Event({
      name: 'Future Event B',
      category: 'match',
      time: {
        buildUp: add(now, { hours: 1 }),
        start: add(now, { hours: 1, minutes: 15 }),
        end: add(now, { hours: 2, minutes: 15 }),
      },
      location: {
        name: 'Location name B',
        line1: 'Location line1 B',
        line2: 'Location line2 B',
        town: 'Location town B',
        postcode: 'Location postcode B',
      },
      capacity: -1,
      isCancelled: false,
    }),
    new Event({
      name: 'Future Event C',
      category: 'match',
      time: {
        buildUp: add(now, { days: 2 }),
        start: add(now, { days: 2, minutes: 5 }),
        end: add(now, { days: 2, hours: 1, minutes: 5 }),
      },
      location: {
        name: 'Location name C',
        line1: 'Location line1 C',
        line2: 'Location line2 C',
        town: 'Location town C',
        postcode: 'Location postcode C',
      },
      capacity: 12,
      isCancelled: true,
    }),
    new Event({
      name: 'Future Event D',
      category: 'social',
      time: {
        buildUp: sub(now, { minutes: 10 }),
        start: sub(now, { minutes: 5 }),
        end: add(now, { hours: 1 }),
      },
      location: {
        name: 'Location name D',
        line1: 'Location line1 D',
        line2: 'Location line2 D',
        town: 'Location town D',
        postcode: 'Location postcode D',
      },
      capacity: 20,
      isCancelled: true,
    }),
    new Event({
      name: 'Future Event E',
      category: 'match',
      time: {
        buildUp: sub(now, { minutes: 10 }),
        start: add(now, { minutes: 5 }),
        end: add(now, { hours: 1, minutes: 1 }),
      },
      location: {
        name: 'Location name E',
        line1: 'Location line1 E',
        line2: 'Location line2 E',
        town: 'Location town E',
        postcode: 'Location postcode E',
      },
      capacity: 8,
      isCancelled: false,
    }),
    new Event({
      name: 'Past Event A',
      category: 'match',
      time: {
        buildUp: sub(now, { days: 1, hours: 1, minutes: 15 }),
        start: sub(now, { days: 1, hours: 1 }),
        end: sub(now, { days: 1 }),
      },
      location: {
        name: 'Location name A',
        line1: 'Location line1 A',
        line2: 'Location line2 A',
        town: 'Location town A',
        postcode: 'Location postcode A',
      },
      capacity: 10,
      isCancelled: false,
    }),
    new Event({
      name: 'Past Event B',
      category: 'match',
      time: {
        buildUp: sub(now, { hours: 2, minutes: 15 }),
        start: sub(now, { hours: 2 }),
        end: sub(now, { hours: 1 }),
      },
      location: {
        name: 'Location name B',
        line1: 'Location line1 B',
        line2: 'Location line2 B',
        town: 'Location town B',
        postcode: 'Location postcode B',
      },
      capacity: -1,
      isCancelled: false,
    }),
    new Event({
      name: 'Past Event C',
      category: 'match',
      time: {
        buildUp: sub(now, { days: 3, hours: 1, minutes: 5 }),
        start: sub(now, { days: 3, hours: 1 }),
        end: sub(now, { days: 3 }),
      },
      location: {
        name: 'Location name C',
        line1: 'Location line1 C',
        line2: 'Location line2 C',
        town: 'Location town C',
        postcode: 'Location postcode C',
      },
      capacity: 12,
      isCancelled: true,
    }),
    new Event({
      name: 'Past Event D',
      category: 'match',
      time: {
        buildUp: sub(now, { hours: 1, minutes: 15 }),
        start: sub(now, { hours: 1 }),
        end: sub(now, { seconds: 1 }),
      },
      location: {
        name: 'Location name D',
        line1: 'Location line1 D',
        line2: 'Location line2 D',
        town: 'Location town D',
        postcode: 'Location postcode D',
      },
      capacity: 20,
      isCancelled: true,
    }),
    new Event({
      name: 'Past Event E',
      category: 'match',
      time: {
        buildUp: sub(now, { hours: 3, minutes: 10 }),
        start: sub(now, { hours: 3 }),
        end: sub(now, { hours: 2 }),
      },
      location: {
        name: 'Location name E',
        line1: 'Location line1 E',
        line2: 'Location line2 E',
        town: 'Location town E',
        postcode: 'Location postcode E',
      },
      capacity: 8,
      isCancelled: false,
    }),
  ];
};
