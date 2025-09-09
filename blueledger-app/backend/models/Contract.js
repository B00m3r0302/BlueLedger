const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  contractNumber: {
    type: String,
    required: [true, 'Contract number is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Contract number too long']
  },
  title: {
    type: String,
    required: [true, 'Contract title is required'],
    trim: true,
    maxlength: [200, 'Contract title too long']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description too long']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  type: {
    type: String,
    enum: ['supply', 'purchase', 'service', 'partnership'],
    required: [true, 'Contract type is required']
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'active', 'completed', 'cancelled', 'expired'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  dates: {
    created: {
      type: Date,
      default: Date.now
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    signed: Date,
    renewed: Date
  },
  terms: {
    paymentTerms: {
      type: String,
      enum: ['net_30', 'net_60', 'net_90', 'advance', 'cod', 'other'],
      default: 'net_30'
    },
    deliveryTerms: {
      type: String,
      enum: ['fob', 'cif', 'exw', 'dap', 'ddp', 'other'],
      default: 'fob'
    },
    currency: {
      type: String,
      default: 'USD',
      maxlength: [3, 'Currency code too long']
    },
    minimumOrder: {
      value: Number,
      unit: String
    },
    maximumOrder: {
      value: Number,
      unit: String
    }
  },
  products: [{
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    quantity: {
      value: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0.01, 'Quantity must be positive']
      },
      unit: {
        type: String,
        required: [true, 'Unit is required'],
        trim: true
      }
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    totalPrice: {
      type: Number,
      min: [0, 'Total price cannot be negative']
    },
    specifications: [{
      parameter: {
        type: String,
        required: true,
        trim: true
      },
      value: {
        type: String,
        required: true,
        trim: true
      },
      unit: {
        type: String,
        trim: true
      }
    }],
    compliance: [{
      standard: {
        type: String,
        required: true,
        trim: true
      },
      certificate: {
        type: String,
        trim: true
      },
      expiryDate: Date
    }]
  }],
  financial: {
    totalValue: {
      type: Number,
      default: 0,
      min: [0, 'Total value cannot be negative']
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative']
    },
    outstandingAmount: {
      type: Number,
      default: 0,
      min: [0, 'Outstanding amount cannot be negative']
    }
  },
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['contract', 'amendment', 'certificate', 'specification', 'other'],
      required: true
    },
    version: {
      type: String,
      default: '1.0',
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isSigned: {
      type: Boolean,
      default: false
    }
  }],
  milestones: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    completedDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'overdue'],
      default: 'pending'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  renewalOptions: {
    autoRenewal: {
      type: Boolean,
      default: false
    },
    renewalPeriod: {
      type: Number,
      default: 12
    },
    renewalNotice: {
      type: Number,
      default: 30
    }
  },
  approvals: [{
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    comments: {
      type: String,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

contractSchema.index({ contractNumber: 1 });
contractSchema.index({ customer: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ 'dates.endDate': 1 });
contractSchema.index({ createdAt: -1 });

contractSchema.pre('save', function(next) {
  if (this.products && this.products.length > 0) {
    let totalValue = 0;
    this.products.forEach(product => {
      const productTotal = product.quantity.value * product.unitPrice;
      product.totalPrice = productTotal;
      totalValue += productTotal;
    });
    this.financial.totalValue = totalValue;
    this.financial.outstandingAmount = totalValue - this.financial.paidAmount;
  }
  next();
});

contractSchema.virtual('isExpiring').get(function() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return this.dates.endDate <= thirtyDaysFromNow && this.status === 'active';
});

contractSchema.virtual('daysUntilExpiry').get(function() {
  const now = new Date();
  const expiry = new Date(this.dates.endDate);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Contract', contractSchema);