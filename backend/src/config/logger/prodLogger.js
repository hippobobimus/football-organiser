import winston from 'winston';

const buildProdLogger = () => {
  // TODO
  return winston.createLogger({
    level: process.env.LOG_LEVEL,
    transports: [new winston.transports.Console()],
  });
};

export { buildProdLogger };

