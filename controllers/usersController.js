const User = require("../models/userModel");
const Course = require('../models/courseModel');
const jwt = require("jsonwebtoken");

const usersController = {
    async register(req, res) {
        const { fullName, username, password, role, address, academicYear } = req.body;
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists, please try again." });
            }

            if (!(role === "student" || role === "staff")) {
                return res.status(400).json({ message: "The role is not valid, please try again." });
            }

            const newUser = new User({
                fullName,
                username,
                password,
                role,
                address,
                academicYear,
                courses: []
            });

            await newUser.save();
            res.status(200).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    },
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (password !== user.password) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const payload = { username: user.username, role: user.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });

            res.header('Authorization', `Bearer ${token}`);
            res.status(200).json({
                message: "User logged in successfully",
                token,
                user: { username: user.username, role: user.role }
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    },
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
            course.currentStudents = [...course.currentStudents, {
                _id: user._id,
                fullName: user.fullName
            }];
            await course.save();

            res.status(200).json({ message: "Course added successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    },
    async deleteCoursesToUser(req, res) {
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
            if (!userIsRegister) {
                return res.status(400).json({ message: "User is not enrolled in this course." });
            }

            user.courses = user.courses.filter(c => c.courseName !== course.courseName);
            await user.save();

            if (course.numberOfRegister > 0){
                course.numberOfRegister -= 1;
            }
            course.currentStudents = course.currentStudents.filter(student => student._id.toString() !== userID.toString());
            await course.save();

            res.status(200).json({ message: "Course deleted successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

module.exports = { usersController };