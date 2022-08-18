import { authHandlers } from './auth';
import { usersHandlers } from './users';
import { eventsHandlers } from './events';

export const handlers = [...authHandlers, ...usersHandlers, ...eventsHandlers];
