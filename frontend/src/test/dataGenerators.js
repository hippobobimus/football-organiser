import { faker } from '@faker-js/faker';
import { add, sub, format } from 'date-fns';

const formatDate = (date) => {
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

export const userGenerator = (overrides) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const name = firstName + ' ' + lastName;
  const role = overrides?.role || 'admin';

  return {
    firstName,
    lastName,
    email: faker.internet.email(),
    password: faker.internet.password(),
    role,
    name,
    isAdmin: role === 'admin',

    ...overrides,
  };
};

export const eventGenerator = (options) => {
  let times;
  if (options?.past) {
    const now = sub(new Date(), { minutes: 1 });
    times = faker.date.betweens(faker.date.recent(0, now), now, 3);
  } else {
    const now = add(new Date(), { minutes: 1 });
    times = faker.date.betweens(now, faker.date.soon(0, now), 3);
  }

  if (options?.formatTime) {
    times = times.map((time) => formatDate(time));
  }

  const [buildUp, start, end] = times;

  return {
    name: `${faker.word.adjective(5)} Event`,
    category: 'match',
    time: {
      buildUp,
      start,
      end,
    },
    location: {
      name: faker.word.noun(),
      line1: faker.address.streetAddress(),
      line2: faker.address.secondaryAddress(),
      town: faker.address.city(),
      postcode: `${faker.random.alpha(1)}${faker.random.alpha({
        count: 1,
        bannedChars: ['i', 'z'],
      })}${faker.random.numeric(1)} ${faker.random.numeric(
        1
      )}${faker.random.alpha(2)}`,
    },
    isCancelled: false,
    capacity: faker.random.numeric(1, { bannedDigits: ['0', '1'] }),
    ...options?.overrides,
  };
};
