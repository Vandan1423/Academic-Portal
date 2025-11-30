const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    room: String,
    grade: {
        type: String,
        enum: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    },
}, { timestamps: true });

module.exports = mongoose.model("Timetable", timetableSchema);
