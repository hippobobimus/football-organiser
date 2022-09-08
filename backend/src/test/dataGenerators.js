import { faker } from '@faker-js/faker';
import { add, sub } from 'date-fns';

faker.setLocale('en');

export const userGenerator = (overrides) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    newPassword: 'Password.123',
    ...overrides,
  };
};

export const eventGenerator = (options) => {
  let times;
  if (options?.past) {
    const now = sub(new Date(), { minutes: 1 });
    times = faker.date.betweens(faker.date.recent(0, now), now);
  } else {
    const now = add(new Date(), { minutes: 1 });
    times = faker.date.betweens(now, faker.date.soon(0, now));
  }

  const [buildUpTime, startTime, endTime] = times;

  return {
    name: `${faker.word.adjective(5)} Event`,
    category: 'match',
    buildUpTime,
    startTime,
    endTime,
    locationName: faker.word.noun(),
    locationLine1: faker.address.streetAddress(),
    locationLine2: faker.address.secondaryAddress(),
    locationTown: faker.address.city(),
    locationPostcode: `${faker.random.alpha(2)}${faker.random.numeric(
      1
    )} ${faker.random.numeric(1)}${faker.random.alpha(2)}`,
    capacity: faker.random.numeric(1, { bannedDigits: ['0', '1'] }),
    ...options?.overrides,
  };
};
