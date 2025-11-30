const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { isStudent } = require("../middlewares/auth");

router.use(isStudent);

router.get("/home", studentController.getHome);
router.get("/timetable", studentController.getTimetable);
router.get("/subjects", studentController.getSubjects);
router.get("/study", studentController.getStudy);
router.get("/dailyroutine", studentController.getDailyRoutine);
router.get("/profile", studentController.getProfile);

module.exports = router;
