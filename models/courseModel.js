const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: { type: ObjectId },
    fullName: { type: String }
});

const courseSchema = new Schema({
    courseName: { type: String, required: true },
    lecturer: { type: String, required: true },
    creditPoints: { type: Number, required: true },
    maxStudents: { type: Number, required: true },
    numberOfRegister: { type: Number, required: true },
    currentStudents: [userSchema]
}, { collection: "courses" });

const Course = mongoose.model("courses", courseSchema);
module.exports = Course;