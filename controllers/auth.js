const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const { WRONG_EMAIL, SUCCESSFULL_ENTER, SUCCESSFULL_EXIT } = require('../utils/constants');
const { BadRequestError } = require('../utils/errors/BadRequestError');
const { ConflictError } = require('../utils/errors/ConflictError');

const { SECRET_JWT, NODE_ENV } = process.env;

module.exports.register = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => User.create({
      name,
      email,
      password: hashedPassword,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError(WRONG_EMAIL));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.checkUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? SECRET_JWT : 'test', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 10,
          secure: NODE_ENV === 'production',
          sameSite: true,
          httpOnly: true,
        })
        .send({ message: SUCCESSFULL_ENTER });
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.logout = (req, res, next) => {
  res
    .clearCookie('jwt')
    .send({ message: SUCCESSFULL_EXIT })
    .catch((err) => {
      next(err);
    });
};
