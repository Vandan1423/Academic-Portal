const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { isFaculty } = require("../middlewares/auth");

router.use(isFaculty);

router.get("/timetable", facultyController.getTimetable);
router.get("/students", facultyController.getStudents);
router.get("/resources", facultyController.getResources);
router.get("/analytics", facultyController.getAnalytics);
router.get("/profile", facultyController.getProfile);

module.exports = router;
