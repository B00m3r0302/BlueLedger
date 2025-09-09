const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, 'Tracking number is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Tracking number too long']
  },
  type: {
    type: String,
    enum: ['import', 'export'],
    required: [true, 'Shipment type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'customs', 'delivered', 'cancelled', 'delayed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  origin: {
    address: {
      type: String,
      required: [true, 'Origin address is required'],
      trim: true,
      maxlength: [200, 'Origin address too long']
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Origin country is required'],
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  destination: {
    address: {
      type: String,
      required: [true, 'Destination address is required'],
      trim: true,
      maxlength: [200, 'Destination address too long']
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Destination country is required'],
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  items: [{
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
      maxlength: [200, 'Item description too long']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be positive']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
      maxlength: [20, 'Unit name too long']
    },
    unitPrice: {
      type: Number,
      min: [0, 'Unit price cannot be negative']
    },
    totalPrice: {
      type: Number,
      min: [0, 'Total price cannot be negative']
    },
    hsCode: {
      type: String,
      trim: true
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lb', 'ton'],
        default: 'kg'
      }
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'inch', 'm'],
        default: 'cm'
      }
    }
  }],
  carrier: {
    name: {
      type: String,
      trim: true
    },
    service: {
      type: String,
      trim: true
    },
    awbNumber: {
      type: String,
      trim: true
    }
  },
  dates: {
    shipped: Date,
    estimatedArrival: Date,
    actualArrival: Date,
    customsClearance: Date
  },
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['invoice', 'packing_list', 'certificate', 'permit', 'insurance', 'other'],
      required: true
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
    }
  }],
  tracking: [{
    status: {
      type: String,
      required: true
    },
    location: {
      type: String,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  totalValue: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: [3, 'Currency code too long']
  },
  insurance: {
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      min: [0, 'Insurance value cannot be negative']
    },
    provider: {
      type: String,
      trim: true
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes too long']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ customer: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ type: 1 });
shipmentSchema.index({ createdAt: -1 });

shipmentSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalValue = this.items.reduce((total, item) => {
      return total + (item.totalPrice || (item.quantity * (item.unitPrice || 0)));
    }, 0);
  }
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);