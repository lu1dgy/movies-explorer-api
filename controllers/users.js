const mongoose = require('mongoose');
const User = require('../models/user');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { BadRequestError } = require('../utils/errors/BadRequestError');

module.exports.getMyself = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
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
        throw new NotFoundError(`Пользователь по указанному id=${userId} не найден. `);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = updateUserProfile;
