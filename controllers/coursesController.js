const Course = require("../models/courseModel");
const User = require("../models/userModel");

const coursesController = {
    async getCourses(req, res) {
        try {
            const courses = await Course.find();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    },
    async addCourse(req, res) {
        const { courseName, lecturer, creditPoints, maxStudents } = req.body;
        if (!courseName || !lecturer || !creditPoints || !maxStudents) {
            return res.status(401).json({ message: "One of the fields is missing. Please enter all fields." });
        }

        if (creditPoints < 3 || creditPoints > 5) {
            return res.status(400).json({ message: "The creditPoint should be be between 3 to 5." });
        }

        try {
            const user = await User.findOne({ fullName: lecturer, role: "staff" });
            if (!user) {
                return res.status(400).json({ message: "Lecturer does not exist in the system." });
            }

            const existingCourse = await Course.findOne({ courseName });
            if (existingCourse) {
                return res.status(400).json({ message: "A course with this name already exists, please try again." });
            }

            const numberOfRegister = 0;
            const currentStudents = [];
            const newCourse = new Course({
                courseName,
                lecturer,
                creditPoints,
                maxStudents,
                numberOfRegister,
                currentStudents
            });

            await newCourse.save();
            res.status(200).json({ message: "Course added successfully", course: newCourse });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    },
    async updateCourse(req, res) {
        const courseID = req.params.courseID;
        const { courseName, lecturer, creditPoints, maxStudents, numberOfRegister } = req.body;
        if (!courseName || !lecturer || !creditPoints || !maxStudents) {
            return res.status(401).json({ message: "One of the fields is missing. Please enter all fields." });
        }

        if (creditPoints < 3 || creditPoints > 5) {
            return res.status(400).json({ message: "The credit points should be between 3 and 5." });
        }

        try {
            const existingCourse = await Course.findOne({ courseName });
            if (existingCourse) {
                return res.status(400).json({ message: "A course with this name already exists, please try again." });
            }

            const updateCourse = await Course.findByIdAndUpdate(courseID, { courseName, lecturer, creditPoints, maxStudents, numberOfRegister }, { new: true });
            if (!updateCourse) {
                return res.status(404).json({ message: "Course not found" });
            }

            const usersWithCourse = await User.find({ "courses._id": courseID });
            for (const user of usersWithCourse) {
                const course = user.courses.find(course => course._id === courseID);
                if (course) {
                    course.creditPoints = creditPoints;
                    course.courseName = courseName;
                    await user.save();
                }
            }

            res.status(200).json({ message: "Course updated successfully", course: updateCourse });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    },
    async deleteCourse(req, res) {
        const courseID = req.params.courseID;

        try {
            const course = await Course.findById(courseID);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            const deletedCourse = await Course.findByIdAndDelete(courseID);

            const usersWithCourse = await User.find({ "courses._id": courseID });
            for (const user of usersWithCourse) {
                user.courses = user.courses.filter(course => course._id !== courseID);
                await user.save();
            }

            res.status(200).json({ message: "Course deleted successfully", course });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

};

module.exports = { coursesController };
