const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../backend/models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sinamoa-chemicals');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const adminPassword = await bcrypt.hash('Admin123!@#', 12);
    const managerPassword = await bcrypt.hash('Manager123!@#', 12);
    const employeePassword = await bcrypt.hash('Employee123!@#', 12);

    const users = [
      {
        firstName: 'John',
        lastName: 'Admin',
        email: 'admin@sinamoa.com',
        password: adminPassword,
        role: 'admin',
        isActive: true,
        profile: {
          department: 'Management',
          position: 'System Administrator'
        }
      },
      {
        firstName: 'Jane',
        lastName: 'Manager',
        email: 'manager@sinamoa.com',
        password: managerPassword,
        role: 'manager',
        isActive: true,
        profile: {
          department: 'Operations',
          position: 'Operations Manager'
        }
      },
      {
        firstName: 'Bob',
        lastName: 'Employee',
        email: 'employee@sinamoa.com',
        password: employeePassword,
        role: 'employee',
        isActive: true,
        profile: {
          department: 'Logistics',
          position: 'Logistics Coordinator'
        }
      }
    ];

    const createdUsers = await User.create(users);
    console.log('Created users:', createdUsers.map(u => ({ email: u.email, role: u.role })));

    mongoose.disconnect();
    console.log('Database seeding completed');
    
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@sinamoa.com / Admin123!@#');
    console.log('Manager: manager@sinamoa.com / Manager123!@#');
    console.log('Employee: employee@sinamoa.com / Employee123!@#');
    console.log('========================\n');
    
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;