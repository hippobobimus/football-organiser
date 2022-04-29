import winston from 'winston';

const buildDevLogger = () => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL,
    transports: [new winston.transports.Console()],
  });
};

export { buildDevLogger };
