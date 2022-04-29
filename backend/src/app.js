import express from 'express';
import morgan from 'morgan';

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

app.get('/', (_, res) => res.send('Hello world'));

export default app;
