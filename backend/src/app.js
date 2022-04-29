import express from 'express';
import httpErrors from 'http-errors';
import morgan from 'morgan';

import { errorHandler } from './middleware/errorMiddleware';
import { eventsRouter, usersRouter } from './routes';

const { createError } = httpErrors;

const app = express();

/*
 * Middleware
 */

// logging
app.use(morgan('dev'));

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
 * Routing
 */

app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);

// Forward 404 requests to error handler
app.use((req, res, next) => {
  next(createError(404, 'Bad URI: This resource does not exist'));
});

/*
 * Error handling
 */

app.use(errorHandler);

export default app;
