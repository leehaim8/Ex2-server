const Course = require("../models/courseModel");

const coursesController = {
    async getUsers(req, res) {
        try {
            const courses = await Course.find();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

module.exports = { coursesController };