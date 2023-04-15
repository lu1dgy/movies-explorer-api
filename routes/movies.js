const express = require('express');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { movieValidator, movieIdValidator } = require('../utils/validators/movieValidator');

const router = express.Router();

router.get('/', getMovies);
router.post('/', movieValidator, createMovie);
router.delete('/:movieId', movieIdValidator, deleteMovie);

module.exports = router;
