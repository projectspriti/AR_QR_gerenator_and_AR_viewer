import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  // Original file information
  filename: {
    type: String,
    required: true,
  },
  originalFilename: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  
  // URLs
  modelUrl: {
    type: String,
    required: true,
    unique: true,
  },
  arViewUrl: {
    type: String,
    required: true,
    unique: true,
  },
  qrCodeUrl: {
    type: String,
    required: true,
  },
  
  // QR Code data for matching
  qrCodeData: {
    type: String,
    required: true,
    unique: true,
  },
  
  // QR Code ID (short unique identifier)
  qrCodeId: {
    type: String,
    required: true,
    unique: true,
  },
  
  // Metadata
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  accessCount: {
    type: Number,
    default: 0,
  },
  
  // Additional metadata
  description: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Index for faster queries
// Note: qrCodeId and qrCodeData already have indexes from unique: true
// Only add index for isActive since it doesn't have unique constraint
modelSchema.index({ isActive: 1 });

// Method to update access count
modelSchema.methods.incrementAccess = async function() {
  this.accessCount += 1;
  this.lastAccessed = new Date();
  await this.save();
};

// Static method to find by QR code data or ID
modelSchema.statics.findByQRCode = async function(qrDataOrId) {
  try {
    // Try to find by QR code ID first (shorter, more likely)
    let model = await this.findOne({ 
      qrCodeId: qrDataOrId,
      isActive: true 
    });
    
    // If not found, try by QR code data (full URL)
    if (!model) {
      model = await this.findOne({ 
        qrCodeData: qrDataOrId,
        isActive: true 
      });
    }
    
    // If still not found, try partial match on QR code data
    if (!model) {
      model = await this.findOne({ 
        qrCodeData: { $regex: qrDataOrId, $options: 'i' },
        isActive: true 
      });
    }
    
    return model;
  } catch (error) {
    throw error;
  }
};

const Model = mongoose.model('Model', modelSchema);

export default Model;

