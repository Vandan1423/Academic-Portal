const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ClassroomData')
.then(async () => {
  console.log('✅ Connected to ClassroomData');

  // Optional: Clear old data
  await Student.deleteMany({});
  await Faculty.deleteMany({});

  // Hash the password once
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Generate 100 Students
  const studentData = [];
  const grades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
  
  for (let i = 0; i < 100; i++) {
    studentData.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword, // Use pre-hashed password
      grade: faker.helpers.arrayElement(grades),
      enrolledSubjects: faker.helpers.arrayElements(subjects, { min: 3, max: 6 }),
      performance: faker.number.int({ min: 50, max: 100 }),
      attendance: faker.number.int({ min: 60, max: 100 })
    });
  }

  // Generate 20 Faculty members
  const facultyData = [];
  const departments = ["Science", "Mathematics", "Languages", "Social Studies", "Physical Education"];
  
  for (let i = 0; i < 20; i++) {
    facultyData.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword, // Use pre-hashed password
      subjects: faker.helpers.arrayElements(subjects, { min: 1, max: 3 }),
      department: faker.helpers.arrayElement(departments)
    });
  }

  await Student.insertMany(studentData);
  await Faculty.insertMany(facultyData);

  console.log("✅ 100 Students and 20 Faculty members inserted successfully.");
  console.log("📌 You can login with any email using password: password123");
  mongoose.disconnect();
})
.catch(err => {
  console.error("❌ Error inserting data:", err);
  mongoose.disconnect();
});
