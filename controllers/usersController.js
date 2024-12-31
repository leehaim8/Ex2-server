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
    }
};

module.exports = { usersController };