import cors from 'cors';

let origin;
if (process.env.NODE_ENV === 'development') {
  origin = ['http://localhost:3000']
} else {
  origin = false // disallow all cors requests
}

const corsOptions = {
  origin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
