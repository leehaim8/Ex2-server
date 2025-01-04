const { Router } = require('express');
const { coursesController } = require('../controllers/coursesController');
const { authMiddleware } = require('../middleware/authMiddleware')
const coursesRouter = new Router();

coursesRouter.get('/', authMiddleware.authToken, authMiddleware.authRole("staff"), coursesController.getCourses);
coursesRouter.post('/addCourse', authMiddleware.authToken, authMiddleware.authRole("staff"), coursesController.addCourse);
coursesRouter.put('/updateCourse/:courseID', authMiddleware.authToken, authMiddleware.authRole("staff"), coursesController.updateCourse);
coursesRouter.delete('/deleteCourse/:courseID', authMiddleware.authToken, authMiddleware.authRole("staff"), coursesController.deleteCourse);

module.exports = { coursesRouter };