const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

const courseSchema = new Schema({
    courseName: { type: String },
    creditPoints: { type: Number }
});

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    academicYear: { type: Number },
    courses: [courseSchema]

}, { collection: "users" });

const User = mongoose.model("Users", userSchema);
module.exports = User;