require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
const connectDB = require('./config/database');
const generateDoctors = require('./generateDoctors');
const indianDoctors = generateDoctors();



const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Doctor.deleteMany({});
    await User.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert doctors
    console.log(`Inserting ${indianDoctors.length} doctors...`);
    await Doctor.insertMany(indianDoctors);
    console.log('Seeded doctors successfully');
    
    // Create a test user
    const testUser = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '+1-555-0199',
      address: {
        full: '123 Main Street, New York, NY 10001'
      }
    });
    
    await testUser.save();
    console.log('Created test user');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();