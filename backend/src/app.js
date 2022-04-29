import express from 'express';
import morgan from 'morgan';

import { eventsRouter } from './routes';

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

export default app;
