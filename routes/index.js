const express = require('express');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { NotFoundError } = require('../utils/errors/NotFoundError');

const router = express.Router();

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Этот адрес не найден. Путь неправильный')));
