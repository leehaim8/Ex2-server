const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

const courseSchema = new Schema({
    _id: { type: ObjectId },
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

// const usersWithCourse = await User.find({ "courses._id": courseID });
// for (const user of usersWithCourse) {
//     const course = user.courses.find(course => course._id.toString() === courseID);
//     if (course) {
//         course.creditPoints = creditPoints;
//         await user.save();
//     }
// }
