const User = require("../models/userModel");
const Course = require('../models/courseModel');

const usersController = {
    async getCoursesOfUser(req, res) {
        const { userID } = req.params;
        try {
            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user.courses);
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    },
    async addCoursesToUser(req, res) {
        const { userID, courseID } = req.params;
        try {
            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const course = await Course.findById(courseID);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            const userIsRegister = await User.findOne({ _id: userID, "courses._id": courseID });
            if (userIsRegister) {
                return res.status(400).json({ message: "User is already enrolled in this course." });
            }

            if (course.numberOfRegister + 1 > course.maxStudents) {
                return res.status(400).json({ message: "Student cannot register for this course. The course is full." });
            }

            const creditPointsSum = user.courses.reduce((sum, course) => sum + course.creditPoints, 0);

            if (creditPointsSum + course.creditPoints > 20) {
                return res.status(400).json({ message: "Student cannot register for this course. Maximum allowed credit points is 20." });
            }

            const updatedCourses = [...user.courses, {
                _id: course._id,
                courseName: course.courseName,
                creditPoints: course.creditPoints
            }];

            user.courses = updatedCourses;
            await user.save();

            course.numberOfRegister += 1;
            await course.save();

            res.status(200).json({ message: "Course added successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

module.exports = { usersController };