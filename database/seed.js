const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../backend/models/User');
const Customer = require('../backend/models/Customer');
const Contract = require('../backend/models/Contract');
const Shipment = require('../backend/models/Shipment');

const seedUsers = async () => {
  try {
    // Check if mongoose is already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/sinamoa-chemicals?authSource=admin');
      console.log('Connected to MongoDB');
    }

    // Check if users already exist to avoid re-seeding
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seeding');
      return;
    }

    await User.deleteMany({});
    console.log('Cleared existing users');

    const users = [
      {
        firstName: 'John',
        lastName: 'Admin',
        email: 'admin@sinamoa.com',
        password: 'Admin123!@#',
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
        password: 'Manager123!@#',
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
        password: 'Employee123!@#',
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

    // Get admin user for creating other records
    const adminUser = createdUsers.find(u => u.role === 'admin');

    // Seed customers
    const customers = [
      {
        name: 'ChemCorp Industries',
        email: 'contact@chemcorp.com',
        phone: '+1-555-0101',
        website: 'https://chemcorp.com',
        industry: 'Chemical Manufacturing',
        customerType: 'buyer',
        address: {
          street: '123 Industrial Ave',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        contacts: [{
          name: 'John Smith',
          title: 'Procurement Manager',
          email: 'j.smith@chemcorp.com',
          phone: '+1-555-0102',
          isPrimary: true
        }],
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'Global Polymers Ltd',
        email: 'info@globalpolymers.com',
        phone: '+1-555-0201',
        website: 'https://globalpolymers.com',
        industry: 'Plastics & Polymers',
        customerType: 'buyer',
        address: {
          street: '456 Manufacturing Blvd',
          city: 'Detroit',
          state: 'MI',
          zipCode: '48201',
          country: 'USA'
        },
        contacts: [{
          name: 'Sarah Johnson',
          title: 'Supply Chain Director',
          email: 's.johnson@globalpolymers.com',
          phone: '+1-555-0202',
          isPrimary: true
        }],
        status: 'active',
        createdBy: adminUser._id
      },
      {
        name: 'EcoClean Solutions',
        email: 'orders@ecoclean.com',
        phone: '+1-555-0301',
        website: 'https://ecoclean.com',
        industry: 'Environmental Services',
        customerType: 'buyer',
        address: {
          street: '789 Green Street',
          city: 'Portland',
          state: 'OR',
          zipCode: '97201',
          country: 'USA'
        },
        contacts: [{
          name: 'Mike Chen',
          title: 'Operations Manager',
          email: 'm.chen@ecoclean.com',
          phone: '+1-555-0302',
          isPrimary: true
        }],
        status: 'prospect',
        createdBy: adminUser._id
      }
    ];

    await Customer.deleteMany({});
    const createdCustomers = await Customer.create(customers);
    console.log('Created customers:', createdCustomers.map(c => c.name));

    // Only disconnect if this script was run directly
    if (require.main === module) {
      mongoose.disconnect();
      console.log('Database seeding completed');
    }
    
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@sinamoa.com / Admin123!@#');
    console.log('Manager: manager@sinamoa.com / Manager123!@#');
    console.log('Employee: employee@sinamoa.com / Employee123!@#');
    console.log('========================\n');
    
  } catch (error) {
    console.error('Seeding error:', error);
    if (require.main === module) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;