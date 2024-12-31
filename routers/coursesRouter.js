const { Router } = require('express');
const { coursesController } = require('../controllers/coursesController');
const { authController } = require('../controllers/authController');
const coursesRouter = new Router();

coursesRouter.get('/', authController.authToken, authController.authRole("staff"), coursesController.getCourses);
coursesRouter.post('/addCourse', authController.authToken, authController.authRole("staff"), coursesController.addCourse)

module.exports = { coursesRouter };