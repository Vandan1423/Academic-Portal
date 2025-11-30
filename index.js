require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const sessionConfig = require("./config/session");
const { setLocals } = require("./middlewares/auth");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

const PORT = process.env.PORT || 2000;

// Database Connection
mongoose.connect(process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ClassroomData")
    .then(() => console.log("✅ Connected to database"))
    .catch((err) => console.error("❌ Database connection error:", err));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionConfig);
app.use(setLocals);

// Routes
app.use("/", authRoutes);
app.use("/", studentRoutes);
app.use("/faculty", facultyRoutes);

// Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    console.error(err);
    res.status(status).send(message);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
