const mongoose = require('mongoose');
const User = require('../models/user');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { BadRequestError } = require('../utils/errors/BadRequestError');
const { USER_NOT_FOUND, USER_ID_NOT_FOUND, INCORRECT_DATA } = require('../utils/constants');

module.exports.getMyself = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  const update = { name, email };
  User.findByIdAndUpdate(userId, update, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_ID_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(INCORRECT_DATA));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = updateUserProfile;
