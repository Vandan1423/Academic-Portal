const Faculty = require("../models/Faculty");
const Student = require("../models/Student");
const Timetable = require("../models/Timetable");
const Resource = require("../models/Resource");

module.exports.getTimetable = async (req, res, next) => {
    try {
        const faculty = await Faculty.findById(req.session.faculty.id);
        
        if (!faculty) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        // Get all timetable entries for this faculty
        const timetable = await Timetable.find({ faculty: req.session.faculty.id })
            .sort({ day: 1, startTime: 1 });
        
        res.render("faculty-timetable.ejs", { faculty, timetable });
    } catch (error) {
        next(error);
    }
};

module.exports.getStudents = async (req, res, next) => {
    try {
        const students = await Student.find({}).select("-password");
        res.render("faculty-students.ejs", { students });
    } catch (error) {
        next(error);
    }
};

module.exports.getResources = async (req, res, next) => {
    try {
        const faculty = await Faculty.findById(req.session.faculty.id);
        
        if (!faculty) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        // Get all resources uploaded by this faculty
        const resources = await Resource.find({ uploadedBy: req.session.faculty.id })
            .sort({ createdAt: -1 });
        
        res.render("faculty-resources.ejs", { faculty, resources });
    } catch (error) {
        next(error);
    }
};

module.exports.getAnalytics = async (req, res, next) => {
    try {
        const faculty = await Faculty.findById(req.session.faculty.id);
        
        if (!faculty) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        // Get students count by grade
        const studentsByGrade = await Student.aggregate([
            {
                $group: {
                    _id: "$grade",
                    count: { $sum: 1 },
                    avgPerformance: { $avg: "$performance" },
                    avgAttendance: { $avg: "$attendance" }
                }
            }
        ]);

        // Get total students
        const totalStudents = await Student.countDocuments();
        
        // Get faculty's resources count
        const resourcesCount = await Resource.countDocuments({ uploadedBy: req.session.faculty.id });
        
        // Get faculty's classes count
        const classesCount = await Timetable.countDocuments({ faculty: req.session.faculty.id });

        res.render("faculty-analytics.ejs", { 
            faculty, 
            studentsByGrade, 
            totalStudents, 
            resourcesCount, 
            classesCount 
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getProfile = async (req, res, next) => {
    try {
        const faculty = await Faculty.findById(req.session.faculty.id);
        
        if (!faculty) {
            req.session.destroy();
            return res.redirect("/?error=Session expired. Please login again");
        }
        
        res.render("faculty-profile.ejs", { faculty });
    } catch (error) {
        next(error);
    }
};
