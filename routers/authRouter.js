const { Router } = require('express');
const { authController } = require('../controllers/authController');

const authRouter = new Router();

module.exports = { authRouter };