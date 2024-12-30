require('dotenv').config();
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
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' })
            res.status(200).json({ 
                message: "User logged in successfully", 
                token, 
                user: { username: user.username, role: user.role } 
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }
};

module.exports = { authController };