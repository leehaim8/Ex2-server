const { Router } = require('express');
const { usersController } = require('../controllers/usersController');

const usersRouter = new Router();

module.exports = { usersRouter };