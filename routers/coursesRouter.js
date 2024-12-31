const { Router } = require('express');
const { coursesController } = require('../controllers/coursesController');
const { authController } = require('../controllers/authController');
const coursesRouter = new Router();

coursesRouter.get('/', authController.authToken, authController.authRole("staff"), coursesController.getUsers);

module.exports = { coursesRouter };