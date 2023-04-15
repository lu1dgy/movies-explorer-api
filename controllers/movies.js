const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { BadRequestError } = require('../utils/errors/BadRequestError');
const { ForbiddenError } = require('../utils/errors/ForbiddenError');
const { NotFoundError } = require('../utils/errors/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    throw new BadRequestError('Передан невалидный id фильма.');
  }
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Фильм с указанным id=${movieId} не найден.`);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          'Вы не можете удалить этот фильм, он добавлен другим пользователем',
        );
      }
      return movie.remove();
    })
    .then(() => {
      res.send({ message: 'Фильм удален' });
    })
    .catch((err) => {
      next(err);
    });
};
