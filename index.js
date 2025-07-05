const express = require("express");
const app = express();
const path = require("path");
const port = 2000;
const ExpressError = require("./ExpressError.js");
const mongoose = require("mongoose");
const User = require("./models/Users.js");
const Admin = require("./models/Admin.js");

let user;
let admin;

main()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/ClassroomData");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

app.get("/", (req, res) => {
    const message = req.query.message;
    res.render("login.ejs", { message });
});

app.get("/signup", (req, res) => {
    const error = req.query.error;
    res.render("signup.ejs", { error });
});

app.post("/home", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        user = await User.findOne({ email });
        admin = await Admin.findOne({ email });

        if (!user && !admin) {
            return res.status(404).send("User or Admin not found");
        }

        if (user) {
            if (password === user.password) {
                return res.render("home.ejs", { user, admin: null });
            } else {
                return res.status(401).send("Incorrect password for user");
            }
        }

        if (admin) {
            if (password === admin.password) {
                return res.render("home.ejs", { user: null, admin });
            } else {
                return res.status(401).send("Incorrect password for admin");
            }
        }
    } catch (error) {
        next(error);
    }
});

app.post("/signup", async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validate input
        if (!name || !email || !password || !confirmPassword) {
            return res.redirect("/signup?error=All fields are required");
        }

        if (password !== confirmPassword) {
            return res.redirect("/signup?error=Passwords do not match");
        }

        if (password.length < 6) {
            return res.redirect("/signup?error=Password must be at least 6 characters long");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect("/signup?error=User with this email already exists");
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();
        
        // Redirect to login page with success message
        res.redirect("/?message=Account created successfully! Please login.");
    } catch (error) {
        next(error);
    }
});
app.get("/home", (req, res) => {
    if (user) {
        res.render("home.ejs", { user, admin: null });
    }
    if (admin) {
        res.render("home.ejs", { user: null, admin });
    }
});
app.get("/timetable", (req, res) => {
    if (user) {
        res.render("timetable.ejs", { user, admin: null });
    }
    if (admin) {
        res.render("timetable.ejs", { user: null, admin });
    }
});
app.get("/study", (req, res) => {
    if (user) {
        res.render("study.ejs", { user, admin: null });
    }
    if (admin) {
        res.render("study.ejs", { user: null, admin });
    }
});
app.get("/activities", (req, res) => {
    if (user) {
        res.render("activities.ejs", { user, admin: null });
    }
    if (admin) {
        res.render("activities.ejs", { user: null, admin });
    }
});

app.get("/dailyroutine", (req, res) => {
    if (user) {
        res.render("dailyroutine.ejs", { user, admin: null });
    }
    if (admin) {
        res.render("dailyroutine.ejs", { user: null, admin });
    }
});

// Faculty Routes
app.get("/faculty/timetable", (req, res) => {
    if (admin) {
        res.render("faculty-timetable.ejs", { user: null, admin });
    } else {
        res.redirect("/");
    }
});

app.get("/faculty/students", (req, res) => {
    if (admin) {
        res.render("faculty-students.ejs", { user: null, admin });
    } else {
        res.redirect("/");
    }
});

app.get("/faculty/resources", (req, res) => {
    if (admin) {
        res.render("faculty-resources.ejs", { user: null, admin });
    } else {
        res.redirect("/");
    }
});

app.get("/faculty/analytics", (req, res) => {
    if (admin) {
        res.render("faculty-analytics.ejs", { user: null, admin });
    } else {
        res.redirect("/");
    }
});

app.get("/logout", (req, res) => {
    user = null;
    admin = null;
    res.redirect("/");
});
app.get("/subjects", (req, res) => {
    if (user) {
        res.render("subjects.ejs", { user, admin: null });
    }
    if (admin) {
        res.render("subjects.ejs", { user: null, admin });
    }
    if (!admin && !user) {
        res.status(404).send("Please login");
    }
});

function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
}
app.use((err, req, res, next) => {
    let { status = 500, message = "Some error Occured" } = err;
    res.status(status).send(message);
});

app.listen(port, () => {
    console.log(`Listning port ${port}`);
});
