import {
  generatePassword,
  issueAccessToken,
  issueRefreshToken,
} from '../utils/password';
import { Attendee, User, AppEvent } from '../models';
import { eventGenerator, userGenerator } from './dataGenerators';

export const createUser = async (overrides) => {
  const userData = userGenerator(overrides);

  let user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: generatePassword(userData.newPassword),
    role: overrides?.role || 'user',
  });

  return user.save();
};

export const createAuthUser = async (overrides) => {
  const password = overrides?.newPassword || 'Password.123';

  const user = await createUser({ newPassword: password, ...overrides });

  const accessToken = issueAccessToken(user.id);
  const refreshToken = issueRefreshToken(user.id);

  return { accessToken, refreshToken, user, password };
};

export const createUsers = async (qty, overrides) => {
  let userPromises = [];

  for (let i = 0; i < qty; i += 1) {
    userPromises.push(createUser(overrides));
  }

  return Promise.all(userPromises);
};

export const createEvent = async (options) => {
  const eventData = eventGenerator(options);

  let event = new AppEvent({
    name: eventData.name,
    category: eventData.category,
    time: {
      buildUp: eventData.buildUpTime,
      start: eventData.startTime,
      end: eventData.endTime,
    },
    location: {
      name: eventData.locationName,
      line1: eventData.locationLine1,
      line2: eventData.locationLine2,
      town: eventData.locationTown,
      postcode: eventData.locationPostcode,
    },
    capacity: eventData.capacity,
    isCancelled: options?.overrides?.isCancelled || false,
  });

  return event.save();
};

export const createEvents = async (qty, options) => {
  let eventPromises = [];

  for (let i = 0; i < qty; i += 1) {
    eventPromises.push(createEvent(options));
  }

  return Promise.all(eventPromises);
};

export const fillEvent = async (event) => {
  const users = await createUsers(event.capacity);
  await Promise.all(
    users.map((u) =>
      new Attendee({
        user: u.id,
        event: event.id,
      }).save()
    )
  );

  return event;
};

export const createAttendee = async (event, user) => {
  return new Attendee({
    event: event.id,
    user: user.id,
  }).save();
};
