const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  customerType: {
    type: String,
    enum: ['supplier', 'buyer', 'both'],
    default: 'buyer'
  },
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [200, 'Street address too long']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City name too long']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State name too long']
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [20, 'ZIP code too long']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country name too long']
    }
  },
  contacts: [{
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'prospect', 'blacklisted'],
    default: 'prospect'
  },
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalOrders: {
    type: Number,
    default: 0
  },
  totalValue: {
    type: Number,
    default: 0
  },
  lastOrderDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

customerSchema.index({ email: 1 });
customerSchema.index({ name: 'text', 'contacts.name': 'text', 'contacts.email': 'text' });

module.exports = mongoose.model('Customer', customerSchema);