import { buildDevLogger } from './devLogger';
import { buildProdLogger } from './prodLogger';

const logger =
  process.env.NODE_ENV === 'development' ? buildDevLogger() : buildProdLogger();

export default logger;
