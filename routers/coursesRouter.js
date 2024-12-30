const { Router } = require('express');
const { coursesController } = require('../controllers/coursesController');

const coursesRouter = new Router();

module.exports = { coursesRouter };