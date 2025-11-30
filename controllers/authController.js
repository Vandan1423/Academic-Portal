const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

module.exports.renderLogin = (req, res) => {
    const { message, error } = req.query;
    res.render("login.ejs", { message, error });
};

module.exports.renderSignup = (req, res) => {
    const { error } = req.query;
    res.render("signup.ejs", { error });
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt:', { email, passwordLength: password?.length });
        
        // Check if student
        let student = await Student.findOne({ email });
        console.log('Student found:', !!student);
        
        if (student) {
            const isMatch = await student.comparePassword(password);
            console.log('Password match:', isMatch);
            
            if (isMatch) {
                req.session.user = {
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    role: "student"
                };
                console.log('Session set:', req.session.user);
                return res.redirect("/home");
            }
        }
        
        // Check if faculty
        let faculty = await Faculty.findOne({ email });
        console.log('Faculty found:', !!faculty);
        
        if (faculty) {
            const isMatch = await faculty.comparePassword(password);
            console.log('Password match:', isMatch);
            
            if (isMatch) {
                req.session.faculty = {
                    id: faculty._id,
                    name: faculty.name,
                    email: faculty.email,
                    role: "faculty"
                };
                console.log('Session set:', req.session.faculty);
                return res.redirect("/home");
            }
        }
        
        console.log('Login failed - redirecting with error');
        res.redirect("/?error=Invalid email or password");
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

module.exports.signup = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        if (!name || !email || !password || !confirmPassword) {
            return res.redirect("/signup?error=All fields are required");
        }
        
        if (password !== confirmPassword) {
            return res.redirect("/signup?error=Passwords do not match");
        }
        
        if (password.length < 6) {
            return res.redirect("/signup?error=Password must be at least 6 characters");
        }
        
        const existingStudent = await Student.findOne({ email });
        const existingFaculty = await Faculty.findOne({ email });
        
        if (existingStudent || existingFaculty) {
            return res.redirect("/signup?error=Email already registered");
        }
        
        const newStudent = new Student({ name, email, password });
        await newStudent.save();
        
        res.redirect("/?message=Account created successfully! Please login.");
    } catch (error) {
        next(error);
    }
};

module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.redirect("/home");
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
};
