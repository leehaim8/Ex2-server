const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

const courseSchema = new Schema({
    courseName: { type: String, required: true },
    lecturer: { type: String, required: true },
    creditPoints: { type: Number, required: true },
    maxStudents: { type: Number, required: true },
    currentStudents: [String]
}, { collection: "courses" });

const Course = mongoose.model("courses", courseSchema);
module.exports = Course;