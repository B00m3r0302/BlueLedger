const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Customer = require('./models/Customer');
const Contract = require('./models/Contract');
const Shipment = require('./models/Shipment');

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

    // Seed customers with comprehensive data
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
        }, {
          name: 'Lisa Williams',
          title: 'Quality Control Manager',
          email: 'l.williams@chemcorp.com',
          phone: '+1-555-0103',
          isPrimary: false
        }],
        status: 'active',
        totalOrders: 24,
        totalValue: 2450000,
        lastOrderDate: new Date('2025-08-15'),
        notes: [{
          content: 'Preferred customer for specialty chemicals. Always requires COA documents.',
          createdBy: adminUser._id,
          createdAt: new Date('2025-07-01')
        }],
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
        totalOrders: 18,
        totalValue: 1800000,
        lastOrderDate: new Date('2025-08-20'),
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
        totalOrders: 0,
        totalValue: 0,
        createdBy: adminUser._id
      },
      {
        name: 'PetroSynth Corporation',
        email: 'purchasing@petrosynth.com',
        phone: '+1-555-0401',
        website: 'https://petrosynth.com',
        industry: 'Petrochemicals',
        customerType: 'buyer',
        address: {
          street: '2500 Refinery Road',
          city: 'Baton Rouge',
          state: 'LA',
          zipCode: '70801',
          country: 'USA'
        },
        contacts: [{
          name: 'Robert Martinez',
          title: 'Senior Buyer',
          email: 'r.martinez@petrosynth.com',
          phone: '+1-555-0402',
          isPrimary: true
        }],
        status: 'active',
        totalOrders: 32,
        totalValue: 4200000,
        lastOrderDate: new Date('2025-08-25'),
        createdBy: adminUser._id
      },
      {
        name: 'Pharma Innovations Inc',
        email: 'supply@pharmainnovations.com',
        phone: '+1-555-0501',
        website: 'https://pharmainnovations.com',
        industry: 'Pharmaceutical',
        customerType: 'buyer',
        address: {
          street: '1001 Research Park Dr',
          city: 'Cambridge',
          state: 'MA',
          zipCode: '02139',
          country: 'USA'
        },
        contacts: [{
          name: 'Dr. Amanda Foster',
          title: 'Head of Procurement',
          email: 'a.foster@pharmainnovations.com',
          phone: '+1-555-0502',
          isPrimary: true
        }],
        status: 'active',
        totalOrders: 15,
        totalValue: 890000,
        lastOrderDate: new Date('2025-08-10'),
        createdBy: adminUser._id
      },
      {
        name: 'AgriTech Solutions',
        email: 'orders@agritech.com',
        phone: '+1-555-0601',
        website: 'https://agritech.com',
        industry: 'Agriculture',
        customerType: 'buyer',
        address: {
          street: '500 Farm Technology Way',
          city: 'Des Moines',
          state: 'IA',
          zipCode: '50309',
          country: 'USA'
        },
        contacts: [{
          name: 'Jennifer Davis',
          title: 'Chemical Procurement Lead',
          email: 'j.davis@agritech.com',
          phone: '+1-555-0602',
          isPrimary: true
        }],
        status: 'active',
        totalOrders: 28,
        totalValue: 1650000,
        lastOrderDate: new Date('2025-08-22'),
        createdBy: adminUser._id
      },
      {
        name: 'Nordic Chemicals AB',
        email: 'info@nordicchem.se',
        phone: '+46-8-555-0701',
        website: 'https://nordicchem.se',
        industry: 'Chemical Manufacturing',
        customerType: 'both',
        address: {
          street: 'Industrivägen 15',
          city: 'Stockholm',
          state: 'Stockholm County',
          zipCode: '11451',
          country: 'Sweden'
        },
        contacts: [{
          name: 'Erik Andersson',
          title: 'Business Development Manager',
          email: 'e.andersson@nordicchem.se',
          phone: '+46-8-555-0702',
          isPrimary: true
        }],
        status: 'active',
        totalOrders: 12,
        totalValue: 950000,
        lastOrderDate: new Date('2025-08-18'),
        createdBy: adminUser._id
      },
      {
        name: 'Asian Pacific Polymers',
        email: 'trade@appoly.com.sg',
        phone: '+65-6555-0801',
        website: 'https://appoly.com.sg',
        industry: 'Plastics & Polymers',
        customerType: 'supplier',
        address: {
          street: '50 Jurong Gateway Road',
          city: 'Singapore',
          state: '',
          zipCode: '608549',
          country: 'Singapore'
        },
        contacts: [{
          name: 'Lee Wei Ming',
          title: 'Export Manager',
          email: 'w.lee@appoly.com.sg',
          phone: '+65-6555-0802',
          isPrimary: true
        }],
        status: 'active',
        totalOrders: 8,
        totalValue: 1200000,
        lastOrderDate: new Date('2025-08-12'),
        createdBy: adminUser._id
      }
    ];

    await Customer.deleteMany({});
    const createdCustomers = await Customer.create(customers);
    console.log('Created customers:', createdCustomers.map(c => c.name));

    // Get manager user for assignments
    const managerUser = createdUsers.find(u => u.role === 'manager');
    const employeeUser = createdUsers.find(u => u.role === 'employee');

    // Seed contracts with detailed chemical products
    const contracts = [
      {
        contractNumber: 'CNT-2025-001',
        title: 'Specialty Chemicals Supply Agreement',
        description: 'Annual supply contract for pharmaceutical grade chemicals',
        customer: createdCustomers.find(c => c.name === 'Pharma Innovations Inc')._id,
        type: 'supply',
        status: 'active',
        priority: 'high',
        dates: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-12-31'),
          signed: new Date('2024-12-15')
        },
        terms: {
          paymentTerms: 'net_30',
          deliveryTerms: 'fob',
          currency: 'USD'
        },
        products: [{
          name: 'Acetonitrile HPLC Grade',
          description: 'High purity acetonitrile for pharmaceutical analysis',
          quantity: { value: 1000, unit: 'L' },
          unitPrice: 45.50,
          specifications: [{
            parameter: 'Purity',
            value: '99.9',
            unit: '%'
          }, {
            parameter: 'Water Content',
            value: '<50',
            unit: 'ppm'
          }],
          compliance: [{
            standard: 'USP Grade',
            certificate: 'USP-ACN-2025',
            expiryDate: new Date('2025-12-31')
          }]
        }, {
          name: 'Methanol HPLC Grade',
          description: 'Ultra-pure methanol for chromatography',
          quantity: { value: 500, unit: 'L' },
          unitPrice: 38.75,
          specifications: [{
            parameter: 'Purity',
            value: '99.95',
            unit: '%'
          }]
        }],
        financial: {
          paidAmount: 15000
        },
        milestones: [{
          name: 'Q1 Delivery',
          description: 'First quarter chemical delivery',
          dueDate: new Date('2025-03-31'),
          status: 'completed',
          completedDate: new Date('2025-03-28'),
          assignedTo: managerUser._id
        }, {
          name: 'Q2 Delivery',
          description: 'Second quarter chemical delivery',
          dueDate: new Date('2025-06-30'),
          status: 'completed',
          completedDate: new Date('2025-06-25'),
          assignedTo: employeeUser._id
        }, {
          name: 'Q3 Delivery',
          description: 'Third quarter chemical delivery',
          dueDate: new Date('2025-09-30'),
          status: 'in_progress',
          assignedTo: employeeUser._id
        }],
        notes: [{
          content: 'Customer requires batch certificates with each delivery',
          createdBy: adminUser._id,
          createdAt: new Date('2025-01-15')
        }],
        createdBy: adminUser._id,
        assignedTo: managerUser._id
      },
      {
        contractNumber: 'CNT-2025-002',
        title: 'Industrial Polymer Raw Materials',
        description: 'Bulk supply of polymer precursors and additives',
        customer: createdCustomers.find(c => c.name === 'Global Polymers Ltd')._id,
        type: 'supply',
        status: 'active',
        priority: 'medium',
        dates: {
          startDate: new Date('2025-03-01'),
          endDate: new Date('2026-02-28'),
          signed: new Date('2025-02-20')
        },
        terms: {
          paymentTerms: 'net_60',
          deliveryTerms: 'cif',
          currency: 'USD'
        },
        products: [{
          name: 'Styrene Monomer',
          description: 'Industrial grade styrene for polymer production',
          quantity: { value: 50, unit: 'MT' },
          unitPrice: 1250.00,
          specifications: [{
            parameter: 'Purity',
            value: '99.5',
            unit: '%'
          }, {
            parameter: 'Inhibitor Content',
            value: '10-15',
            unit: 'ppm'
          }]
        }, {
          name: 'Polyethylene Glycol 400',
          description: 'PEG 400 for plasticizer applications',
          quantity: { value: 25, unit: 'MT' },
          unitPrice: 890.00
        }],
        financial: {
          paidAmount: 45000
        },
        createdBy: adminUser._id,
        assignedTo: managerUser._id
      },
      {
        contractNumber: 'CNT-2025-003',
        title: 'Agricultural Chemical Supply',
        description: 'Seasonal supply of agricultural chemicals and fertilizers',
        customer: createdCustomers.find(c => c.name === 'AgriTech Solutions')._id,
        type: 'supply',
        status: 'active',
        priority: 'medium',
        dates: {
          startDate: new Date('2025-04-01'),
          endDate: new Date('2025-10-31'),
          signed: new Date('2025-03-25')
        },
        terms: {
          paymentTerms: 'net_30',
          deliveryTerms: 'fob',
          currency: 'USD'
        },
        products: [{
          name: 'Ammonium Sulfate',
          description: 'Crystalline ammonium sulfate fertilizer',
          quantity: { value: 100, unit: 'MT' },
          unitPrice: 285.00,
          specifications: [{
            parameter: 'Nitrogen Content',
            value: '21',
            unit: '%'
          }, {
            parameter: 'Sulfur Content',
            value: '24',
            unit: '%'
          }]
        }],
        createdBy: adminUser._id,
        assignedTo: employeeUser._id
      },
      {
        contractNumber: 'CNT-2025-004',
        title: 'Petrochemical Feedstock Agreement',
        description: 'Long-term supply of petrochemical raw materials',
        customer: createdCustomers.find(c => c.name === 'PetroSynth Corporation')._id,
        type: 'supply',
        status: 'active',
        priority: 'critical',
        dates: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2027-12-31'),
          signed: new Date('2024-11-30')
        },
        terms: {
          paymentTerms: 'net_30',
          deliveryTerms: 'fob',
          currency: 'USD'
        },
        products: [{
          name: 'Benzene Technical Grade',
          description: 'High purity benzene for chemical synthesis',
          quantity: { value: 200, unit: 'MT' },
          unitPrice: 1100.00,
          specifications: [{
            parameter: 'Purity',
            value: '99.85',
            unit: '%'
          }]
        }, {
          name: 'Toluene Industrial Grade',
          description: 'Technical grade toluene solvent',
          quantity: { value: 150, unit: 'MT' },
          unitPrice: 950.00
        }],
        financial: {
          paidAmount: 180000
        },
        createdBy: adminUser._id,
        assignedTo: adminUser._id
      }
    ];

    await Contract.deleteMany({});
    const createdContracts = await Contract.create(contracts);
    console.log('Created contracts:', createdContracts.map(c => c.contractNumber));

    // Seed shipments with realistic tracking data
    const shipments = [
      {
        trackingNumber: 'SNM-2025-001',
        type: 'export',
        status: 'delivered',
        priority: 'high',
        customer: createdCustomers.find(c => c.name === 'Pharma Innovations Inc')._id,
        contract: createdContracts.find(c => c.contractNumber === 'CNT-2025-001')._id,
        origin: {
          address: 'Sinamoa Chemical Plant, 1500 Industrial Blvd',
          city: 'Houston',
          country: 'USA',
          coordinates: { latitude: 29.7604, longitude: -95.3698 }
        },
        destination: {
          address: '1001 Research Park Dr',
          city: 'Cambridge',
          country: 'USA',
          coordinates: { latitude: 42.3601, longitude: -71.0589 }
        },
        items: [{
          description: 'Acetonitrile HPLC Grade',
          quantity: 250,
          unit: 'L',
          unitPrice: 45.50,
          totalPrice: 11375,
          hsCode: '2926.90.30',
          weight: { value: 197.5, unit: 'kg' },
          dimensions: { length: 120, width: 80, height: 100, unit: 'cm' }
        }],
        carrier: {
          name: 'ChemLogistics Express',
          service: 'Ground Expedited',
          awbNumber: 'CLE123456789'
        },
        dates: {
          shipped: new Date('2025-08-20'),
          estimatedArrival: new Date('2025-08-23'),
          actualArrival: new Date('2025-08-22'),
          customsClearance: new Date('2025-08-21')
        },
        tracking: [{
          status: 'Package picked up',
          location: 'Houston, TX',
          timestamp: new Date('2025-08-20T08:00:00Z'),
          notes: 'Hazmat certified driver assigned'
        }, {
          status: 'In transit',
          location: 'Dallas, TX',
          timestamp: new Date('2025-08-20T15:30:00Z')
        }, {
          status: 'Customs clearance complete',
          location: 'Border Crossing',
          timestamp: new Date('2025-08-21T10:00:00Z')
        }, {
          status: 'Out for delivery',
          location: 'Cambridge, MA',
          timestamp: new Date('2025-08-22T07:00:00Z')
        }, {
          status: 'Delivered',
          location: 'Research Park Dr, Cambridge, MA',
          timestamp: new Date('2025-08-22T14:30:00Z'),
          notes: 'Delivered to receiving dock, signed by A. Foster'
        }],
        currency: 'USD',
        insurance: {
          required: true,
          value: 15000,
          provider: 'ChemCover Insurance'
        },
        notes: 'Temperature-controlled transport required. Customer notified of early delivery.',
        createdBy: managerUser._id
      },
      {
        trackingNumber: 'SNM-2025-002',
        type: 'export',
        status: 'in_transit',
        priority: 'medium',
        customer: createdCustomers.find(c => c.name === 'Global Polymers Ltd')._id,
        contract: createdContracts.find(c => c.contractNumber === 'CNT-2025-002')._id,
        origin: {
          address: 'Sinamoa Chemical Plant, 1500 Industrial Blvd',
          city: 'Houston',
          country: 'USA'
        },
        destination: {
          address: '456 Manufacturing Blvd',
          city: 'Detroit',
          country: 'USA'
        },
        items: [{
          description: 'Styrene Monomer',
          quantity: 10,
          unit: 'MT',
          unitPrice: 1250.00,
          totalPrice: 12500,
          hsCode: '2902.50.00',
          weight: { value: 10000, unit: 'kg' }
        }],
        carrier: {
          name: 'Industrial Transport LLC',
          service: 'Standard Freight',
          awbNumber: 'ITL987654321'
        },
        dates: {
          shipped: new Date('2025-08-26'),
          estimatedArrival: new Date('2025-08-28')
        },
        tracking: [{
          status: 'Package picked up',
          location: 'Houston, TX',
          timestamp: new Date('2025-08-26T09:00:00Z')
        }, {
          status: 'In transit',
          location: 'Memphis, TN',
          timestamp: new Date('2025-08-27T12:00:00Z')
        }],
        currency: 'USD',
        createdBy: employeeUser._id
      },
      {
        trackingNumber: 'SNM-2025-003',
        type: 'import',
        status: 'customs',
        priority: 'medium',
        customer: createdCustomers.find(c => c.name === 'Nordic Chemicals AB')._id,
        origin: {
          address: 'Industrivägen 15',
          city: 'Stockholm',
          country: 'Sweden'
        },
        destination: {
          address: 'Sinamoa Chemical Plant, 1500 Industrial Blvd',
          city: 'Houston',
          country: 'USA'
        },
        items: [{
          description: 'Specialty Catalyst',
          quantity: 500,
          unit: 'kg',
          unitPrice: 125.00,
          totalPrice: 62500,
          hsCode: '3815.12.00',
          weight: { value: 500, unit: 'kg' }
        }],
        carrier: {
          name: 'Nordic Shipping Co',
          service: 'Ocean Freight',
          awbNumber: 'NSC555444333'
        },
        dates: {
          shipped: new Date('2025-08-15'),
          estimatedArrival: new Date('2025-08-30')
        },
        tracking: [{
          status: 'Departed origin port',
          location: 'Port of Gothenburg, Sweden',
          timestamp: new Date('2025-08-15T16:00:00Z')
        }, {
          status: 'In transit - ocean',
          location: 'North Atlantic',
          timestamp: new Date('2025-08-20T12:00:00Z')
        }, {
          status: 'Arrived destination port',
          location: 'Port of Houston, TX',
          timestamp: new Date('2025-08-27T08:00:00Z')
        }, {
          status: 'Customs processing',
          location: 'Houston Customs Facility',
          timestamp: new Date('2025-08-27T14:00:00Z'),
          notes: 'Additional documentation requested'
        }],
        currency: 'USD',
        createdBy: adminUser._id
      },
      {
        trackingNumber: 'SNM-2025-004',
        type: 'export',
        status: 'pending',
        priority: 'low',
        customer: createdCustomers.find(c => c.name === 'EcoClean Solutions')._id,
        origin: {
          address: 'Sinamoa Chemical Plant, 1500 Industrial Blvd',
          city: 'Houston',
          country: 'USA'
        },
        destination: {
          address: '789 Green Street',
          city: 'Portland',
          country: 'USA'
        },
        items: [{
          description: 'Biodegradable Surfactant',
          quantity: 2500,
          unit: 'L',
          unitPrice: 12.50,
          totalPrice: 31250,
          hsCode: '3402.13.00',
          weight: { value: 2375, unit: 'kg' }
        }],
        currency: 'USD',
        notes: 'Awaiting customer pickup authorization',
        createdBy: employeeUser._id
      }
    ];

    await Shipment.deleteMany({});
    const createdShipments = await Shipment.create(shipments);
    console.log('Created shipments:', createdShipments.map(s => s.trackingNumber));

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