const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['patient', 'doctor'],
    default: 'patient'
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    full: {
      type: String,
      required: true
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  allergies: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // Patient-specific fields
  disease: {
    type: String,
    required: false
  },
  // Doctor-specific fields
  specialization: {
    type: String,
    required: function() { return this.userType === 'doctor'; }
  },
  experience: {
    type: Number,
    default: 0
  },
  consultationFee: {
    type: Number,
    default: 500
  },
  education: [String],
  languages: [String],
  // Location field for distance calculation
  location: {
    type: String
  },
  // OTP fields
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

userSchema.methods.verifyOTP = function(candidateOTP) {
  return this.otp === candidateOTP && this.otpExpiry > new Date();
};

module.exports = mongoose.model('User', userSchema);