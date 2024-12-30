const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authController = {
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

            const academicYearValue = academicYear || null;
            const courses = [];
            const newUser = new User({
                fullName,
                username,
                password,
                role,
                address,
                academicYear: academicYearValue,
                courses
            });

            await newUser.save();
            res.status(200).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

module.exports = { authController };