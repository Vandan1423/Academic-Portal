const Student = require("../models/Student");
const Timetable = require("../models/Timetable");
const Resource = require("../models/Resource");

module.exports.getHome = async (req, res, next) => {
    try {
        const student = await Student.findById(req.session.user.id).select("-password");
        
        if (!student) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        // Get today's timetable
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayClasses = await Timetable.find({
            day: today,
            grade: student.grade
        }).populate('faculty', 'name').sort({ startTime: 1 });

        // Get next class
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const nextClass = todayClasses.find(c => c.startTime > currentTime);

        res.render("home.ejs", { student, nextClass, todayClasses });
    } catch (error) {
        next(error);
    }
};

module.exports.getTimetable = async (req, res, next) => {
    try {
        const student = await Student.findById(req.session.user.id);
        
        if (!student) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        const timetable = await Timetable.find({ grade: student.grade })
            .populate('faculty', 'name')
            .sort({ day: 1, startTime: 1 });
        
        res.render("timetable.ejs", { student, timetable });
    } catch (error) {
        next(error);
    }
};

module.exports.getSubjects = async (req, res, next) => {
    try {
        const student = await Student.findById(req.session.user.id);
        
        if (!student) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        // Get all resources for student's grade
        const resources = await Resource.find({
            $or: [
                { grade: student.grade },
                { grade: "All Grades" }
            ]
        }).populate('uploadedBy', 'name').sort({ createdAt: -1 });

        // Get unique subjects from student's enrolled subjects
        const subjects = student.enrolledSubjects || [];
        
        res.render("subjects.ejs", { student, resources, subjects });
    } catch (error) {
        next(error);
    }
};

module.exports.getStudy = async (req, res, next) => {
    try {
        const student = await Student.findById(req.session.user.id);
        
        if (!student) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        // Get resources for study page
        const resources = await Resource.find({
            $or: [
                { grade: student.grade },
                { grade: "All Grades" }
            ]
        }).populate('uploadedBy', 'name').limit(10).sort({ createdAt: -1 });

        res.render("study.ejs", { student, resources });
    } catch (error) {
        next(error);
    }
};

module.exports.getDailyRoutine = async (req, res, next) => {
    try {
        const student = await Student.findById(req.session.user.id);
        
        if (!student) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        // Get today's classes
        const todayClasses = await Timetable.find({
            day: today,
            grade: student.grade
        }).populate('faculty', 'name').sort({ startTime: 1 });

        res.render("dailyroutine.ejs", { student, todayClasses });
    } catch (error) {
        next(error);
    }
};

module.exports.getProfile = async (req, res, next) => {
    try {
        const student = await Student.findById(req.session.user.id);
        
        if (!student) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        res.render("student-profile.ejs", { student });
    } catch (error) {
        next(error);
    }
};
