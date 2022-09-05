import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const mongod = await MongoMemoryServer.create();

export const connect = async () => {
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

export const close = async () => {
  await mongoose.connection.close();
  await mongod.stop();
};

export const clear = async () => {
  await mongoose.connection.dropDatabase();
};
