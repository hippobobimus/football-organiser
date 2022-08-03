import { faker } from '@faker-js/faker';

export const userGenerator = (overrides) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const name = firstName + ' ' + lastName;

  return {
    id: faker.datatype.uuid(),
    firstName,
    lastName,
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: 'admin',
    name,
    isAdmin: Boolean,

    ...overrides,
  };
};
