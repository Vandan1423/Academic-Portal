const mongoose = require('mongoose');
const faker = require('@faker-js/faker').faker;
const Admin = require('./models/Admin');
const User = require('./models/Users');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ClassroomData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to ClassroomData');

  // Optional: Clear old data
  await Admin.deleteMany({});
  await User.deleteMany({});

  // Generate 100 Admins
  const adminData = [];
  for (let i = 0; i < 100; i++) {
    adminData.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 8 })
    });
  }

  // Generate 100 Users
  const userData = [];
  for (let i = 0; i < 100; i++) {
    userData.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 8 })
    });
  }

  await Admin.insertMany(adminData);
  await User.insertMany(userData);

  console.log("✅ 100 Admins and 100 Users inserted successfully.");
  mongoose.disconnect();
})
.catch(err => {
  console.error("❌ Error inserting data:", err);
  mongoose.disconnect();
});
