import express from 'express';
import createError from 'http-errors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import corsMiddleware from './middleware/cors';
import { errorHandler } from './middleware/errorMiddleware';
import { authRouter, eventsRouter, usersRouter } from './routes';

const app = express();

/*
 * Middleware
 */

app.use(corsMiddleware);

// logging
app.use(morgan('dev'));

// parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
 * Routing
 */

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);

// frontend
if (process.env.NODE_ENV === 'production') {
  const buildDir = new URL('../../frontend/build', import.meta.url);
  const indexFile = new URL('../../frontend/build/index.html', import.meta.url);

  app.use(express.static(buildDir.pathname));

  app.get('*', (req, res) => {
    res.sendFile(indexFile.pathname);
  });
} else {
  app.get('/', (req, res) => res.send('Running in development mode'));
}

// Forward 404 requests to error handler
app.use((req, res, next) => {
  next(createError(404, 'Bad URI: This resource does not exist'));
});

/*
 * Error handling
 */

app.use(errorHandler);

export default app;
