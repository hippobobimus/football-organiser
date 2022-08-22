import { faker } from '@faker-js/faker';

export const userGenerator = (overrides) => {
  faker.setLocale('en');
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    newPassword: 'Password.123',
    ...overrides,
  };
};
