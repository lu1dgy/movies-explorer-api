const mongoose = require('mongoose');
const Movie = require('../models/movie');
const {
  INCORRECT_FILM_DATA,
  INVALID_FILM_ID,
  NOT_FOUND_FILM,
  FORBIDDEN_DELETE_FILM,
  FILM_DELETED,
} = require('../utils/constants');
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
        next(new BadRequestError(INCORRECT_FILM_DATA));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    throw new BadRequestError(INVALID_FILM_ID);
  }
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_FILM);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(FORBIDDEN_DELETE_FILM);
      }
      return movie.remove();
    })
    .then(() => {
      res.send({ message: FILM_DELETED });
    })
    .catch((err) => {
      next(err);
    });
};
