const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');
const University = require('./models/University');
const Application = require('./models/Application');

const seed = async () => {
  try {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to local MongoDB for seeding...');
    } catch (err) {
      console.log('Local MongoDB unavailable, using Memory Server fallback for seeding...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      console.log('Connected to MongoDB Memory Server!');
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      University.deleteMany({}),
      Application.deleteMany({}),
    ]);

    // 1. Create Admin User
    const admin = await User.create({
      firstName: 'Tarek',
      lastName: 'Baloush',
      email: 'admin@resturant.com',
      password: 'admin123',
      role: 'admin',
    });

    // 2. Create Universities
    const unis = await University.insertMany([
      {
        name: 'University of Toronto',
        country: 'Canada',
        city: 'Toronto',
        website: 'https://utoronto.ca',
        programs: [
          { name: 'Computer Science', degree: 'master', fieldOfStudy: 'CS', durationMonths: 24, tuitionFee: 35000, currency: 'CAD' },
          { name: 'MBA', degree: 'master', fieldOfStudy: 'Business', durationMonths: 18, tuitionFee: 60000, currency: 'CAD' }
        ]
      },
      {
        name: 'Stanford University',
        country: 'USA',
        city: 'Stanford',
        website: 'https://stanford.edu',
        programs: [
          { name: 'Artificial Intelligence', degree: 'master', fieldOfStudy: 'CS', durationMonths: 24, tuitionFee: 55000, currency: 'USD' }
        ]
      }
    ]);

    // 3. Create Students
    const students = await Student.insertMany([
      {
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        email: 'ahmed@example.com',
        nationality: 'Saudi Arabia',
        status: 'active',
        assignedTo: admin._id,
      },
      {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya@example.com',
        nationality: 'India',
        status: 'applied',
        assignedTo: admin._id,
      }
    ]);

    // 4. Create Applications
    await Application.create({
      studentId: students[1]._id,
      universityId: unis[0]._id,
      programId: unis[0].programs[0]._id,
      intake: { semester: 'Fall', year: 2024 },
      status: 'submitted',
      assignedTo: admin._id,
    });

    console.log('Seeding complete!');
    console.log('Admin Email: admin@resturant.com');
    console.log('Admin Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
