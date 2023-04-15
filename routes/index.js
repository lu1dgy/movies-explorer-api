const express = require('express');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { logout, login, register } = require('../controllers/auth');
const auth = require('../middlewares/auth');
const { loginValidator, registrationValidator } = require('../utils/validators/authValidator');

const router = express.Router();

router.post('/signin', loginValidator, login);
router.post('/signup', registrationValidator, register);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.get('/signout', logout);

router.use('*', (req, res, next) => next(new NotFoundError('Этот адрес не найден. Путь неправильный')));

module.exports = router;
