import { usersHandlers } from './users';
import { eventsHandlers } from './events';

export const handlers = [...usersHandlers, ...eventsHandlers];
