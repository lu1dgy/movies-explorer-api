const DEFAULT_ALLOWED_METHODS = 'GET,PUT,PATCH,POST,DELETE,HEAD';

const allowedCors = [
  'http://localhost:3100',
  'localhost:3100',
  'https://localhost:3100',
  'http://localhost:3000',
  'localhost:3000',
  'https://localhost:3000',
  'http://localhost:3001',
  'localhost:3001',
  'https://localhost:3001',
  'http://movies.lapkes.nomoredomains.monster',
  'https://movies.lapkes.nomoredomains.monster',
  'movies.lapkes.nomoredomains.monster',
];

module.exports.cors = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
