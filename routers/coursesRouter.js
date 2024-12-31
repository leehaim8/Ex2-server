const { Router } = require('express');
const { coursesController } = require('../controllers/coursesController');
const { authController } = require('../controllers/authController');
const coursesRouter = new Router();

coursesRouter.get('/', authController.authToken, authController.authRole("staff"), coursesController.getCourses);
coursesRouter.post('/addCourse', authController.authToken, authController.authRole("staff"), coursesController.addCourse);
coursesRouter.put('/updateCourse/:courseID', authController.authToken, authController.authRole("staff"), coursesController.updateCourse);
coursesRouter.delete('/deleteCourse/:courseID', authController.authToken, authController.authRole("staff"), coursesController.deleteCourse);

module.exports = { coursesRouter };