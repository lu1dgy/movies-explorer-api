const express = require('express');
const { updateUser, getMyself } = require('../controllers/users');

const router = express.Router();

router.get('/me', getMyself);
router.patch('/me', updateUser);

module.exports = router;
