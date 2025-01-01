const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const { authController } = require('../controllers/authController');

const usersRouter = new Router();

usersRouter.get('/:userID', authController.authToken, authController.authRole("student"), usersController.getCoursesOfUser);
usersRouter.post('/:userID/:courseID', authController.authToken, authController.authRole("student"), usersController.addCoursesToUser);

module.exports = { usersRouter };