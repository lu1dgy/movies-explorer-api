const express = require('express');
const { updateUser, getMyself } = require('../controllers/users');
const { userValidator } = require('../utils/validators/userValidation');

const router = express.Router();

router.get('/me', getMyself);
router.patch('/me', userValidator, updateUser);

module.exports = router;
