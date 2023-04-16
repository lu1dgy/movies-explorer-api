const token = require('jsonwebtoken');
const { NEED_AUTORIZATION } = require('../utils/constants');

const { SECRET_JWT, NODE_ENV } = process.env;
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');

module.exports = (req, _, next) => {
  const { jwt } = req.cookies;
  if (!token) {
    return next(new UnauthorizedError(NEED_AUTORIZATION));
  }
  let payload;
  try {
    payload = token.verify(jwt, NODE_ENV === 'production' ? SECRET_JWT : 'test');
  } catch (err) {
    return next(new UnauthorizedError(NEED_AUTORIZATION));
  }
  req.user = { _id: payload._id };
  return next();
};
