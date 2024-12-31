const Course = require("../models/courseModel");

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

        try {
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
        const { courseName, lecturer, creditPoints, maxStudents, numberOfRegister, currentStudents} = req.body;
        if (!courseName || !lecturer || !creditPoints || !maxStudents) {
            return res.status(401).json({ message: "One of the fields is missing. Please enter all fields." });
        }

        try {
            const updateCourse = await Course.findByIdAndUpdate(courseID, { courseName, lecturer, creditPoints, maxStudents, numberOfRegister, currentStudents },{ new: true });
            if (!updateCourse) {
                return res.status(404).json({ message: "Course not found" });
            }

            res.status(200).json({ message: "Course updated successfully", course: updateCourse });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

};

module.exports = { coursesController };
