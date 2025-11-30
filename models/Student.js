const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    grade: {
        type: String,
        enum: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    },
    enrolledSubjects: [{
        type: String,
    }],
    performance: {
        type: Number,
        default: 0,
    },
    attendance: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Hash password before saving
studentSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
