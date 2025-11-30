const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Document", "Presentation", "Video", "Image", "Link", "Quiz"],
        required: true,
    },
    grade: {
        type: String,
        enum: ["All Grades", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    },
    description: String,
    url: String,
    fileName: String,
    filePath: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);
