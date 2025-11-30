const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ClassroomData",
        touchAfter: 24 * 3600, // Lazy session update (in seconds)
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
});
