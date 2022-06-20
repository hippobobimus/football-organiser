import mongoose from 'mongoose';
import logger from '../config/logger';

mongoose.connection.on('error', (err) => logger.error(err));

mongoose.connection.on('connecting', () =>
  logger.info('MongoDB: Attempting connection...')
);

mongoose.connection.on('connected', () => logger.info('MongoDB: Connected'));

const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .catch((e) => logger.error('Initial connection attempt failed: ' + e));
};

export default { connect: connectDb };
