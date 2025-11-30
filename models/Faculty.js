const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const facultySchema = new mongoose.Schema({
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
    subjects: [{
        type: String,
    }],
    department: String,
}, { timestamps: true });

facultySchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

facultySchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Faculty", facultySchema);
