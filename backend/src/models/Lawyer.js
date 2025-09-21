import mongoose from 'mongoose'

const lawyerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    barCouncilNumber: {
      type: String,
      required: [true, 'Bar Council Number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    practiceAreas: [
      {
        type: String,
        trim: true,
        enum: [
          'Criminal Law',
          'Civil Law',
          'Family Law',
          'Corporate Law',
          'Tax Law',
          'Property Law',
          'Constitutional Law',
          'Labor Law',
          'Intellectual Property',
          'Environmental Law',
          'Banking Law',
          'Immigration Law',
          'Personal Injury',
          'Real Estate Law',
          'Immigration Law',
          'Consumer Protection',
          'Cyber Law',
          'Medical Malpractice',
          'Estate Planning',
          'Bankruptcy Law',
        ],
      },
    ],
    districts: [
      {
        type: String,
        trim: true,
      },
    ],
    languages: [
      {
        type: String,
        enum: [
          'en',
          'hi',
          'bn',
          'te',
          'mr',
          'ta',
          'ur',
          'gu',
          'kn',
          'ml',
          'pa',
          'or',
        ],
        default: ['en'],
      },
    ],
    experience: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    profileImage: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [
      {
        documentType: {
          type: String,
          enum: ['bar_certificate', 'id_proof', 'address_proof', 'photo'],
        },
        documentUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
      },
    ],
    consultationFee: {
      type: Number,
      default: 0,
      min: [0, 'Consultation fee cannot be negative'],
    },
    availability: {
      monday: [{ start: String, end: String }],
      tuesday: [{ start: String, end: String }],
      wednesday: [{ start: String, end: String }],
      thursday: [{ start: String, end: String }],
      friday: [{ start: String, end: String }],
      saturday: [{ start: String, end: String }],
      sunday: [{ start: String, end: String }],
    },
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
        grade: String,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        year: Number,
      },
    ],
    socialLinks: {
      website: String,
      linkedin: String,
      twitter: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    totalCases: {
      type: Number,
      default: 0,
    },
    successfulCases: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: Number, // in hours
      default: 24,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual for success rate
lawyerSchema.virtual('successRate').get(function () {
  if (this.totalCases === 0) return 0
  return Math.round((this.successfulCases / this.totalCases) * 100)
})

// Virtual for full name from user
lawyerSchema.virtual('name').get(function () {
  return this.user?.name
})

// Virtual for email from user
lawyerSchema.virtual('email').get(function () {
  return this.user?.email
})

// Virtual for phone from user
lawyerSchema.virtual('phone').get(function () {
  return this.user?.phone
})

// Indexes for better query performance
lawyerSchema.index({ practiceAreas: 1 })
lawyerSchema.index({ districts: 1 })
lawyerSchema.index({ languages: 1 })
lawyerSchema.index({ isVerified: 1 })
lawyerSchema.index({ isActive: 1 })
lawyerSchema.index({ rating: -1 })
lawyerSchema.index({ experience: -1 })

// Text index for search functionality
lawyerSchema.index({
  bio: 'text',
  specializations: 'text',
  'education.degree': 'text',
  'education.institution': 'text',
})

// Pre-save middleware to update lastActive
lawyerSchema.pre('save', function (next) {
  this.lastActive = new Date()
  next()
})

// Static method to find verified lawyers
lawyerSchema.statics.findVerified = function () {
  return this.find({ isVerified: true, isActive: true })
}

// Static method to find lawyers by practice area
lawyerSchema.statics.findByPracticeArea = function (practiceArea) {
  return this.find({
    practiceAreas: practiceArea,
    isVerified: true,
    isActive: true,
  })
}

// Static method to find lawyers by district
lawyerSchema.statics.findByDistrict = function (district) {
  return this.find({
    districts: district,
    isVerified: true,
    isActive: true,
  })
}

// Static method to search lawyers
lawyerSchema.statics.searchLawyers = function (query, filters = {}) {
  const searchQuery = {
    isVerified: true,
    isActive: true,
    ...filters,
  }

  if (query) {
    searchQuery.$text = { $search: query }
  }

  return this.find(searchQuery)
    .populate('user', 'name email phone')
    .sort({ score: { $meta: 'textScore' }, rating: -1 })
}

// Instance method to update rating
lawyerSchema.methods.updateRating = function (newRating) {
  const totalRating = this.rating * this.totalReviews + newRating
  this.totalReviews += 1
  this.rating = totalRating / this.totalReviews
  return this.save()
}

// Instance method to add case
lawyerSchema.methods.addCase = function (isSuccessful = false) {
  this.totalCases += 1
  if (isSuccessful) {
    this.successfulCases += 1
  }
  return this.save()
}

export default mongoose.model('Lawyer', lawyerSchema)
