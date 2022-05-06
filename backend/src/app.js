import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import morgan from 'morgan';

import db from './config/db';
import { errorHandler } from './middleware/errorMiddleware';
import { eventsRouter, usersRouter } from './routes';

const app = express();

/*
 * Connect to database
 */

db.connect();

/*
 * Middleware
 */

app.use(cors());

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
