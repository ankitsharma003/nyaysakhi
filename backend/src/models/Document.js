import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed'],
      default: 'uploaded',
    },
    extractedData: {
      caseType: String,
      caseNumber: String,
      courtName: String,
      judgeName: String,
      parties: [
        {
          name: String,
          type: {
            type: String,
            enum: [
              'plaintiff',
              'defendant',
              'petitioner',
              'respondent',
              'appellant',
              'respondent',
            ],
          },
        },
      ],
      caseDetails: String,
      importantDates: [
        {
          date: Date,
          description: String,
          type: {
            type: String,
            enum: ['hearing', 'filing', 'judgment', 'other'],
          },
        },
      ],
      legalIssues: [String],
      documents: [String],
      summary: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
    processingError: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    category: {
      type: String,
      enum: [
        'civil',
        'criminal',
        'family',
        'corporate',
        'tax',
        'property',
        'constitutional',
        'labor',
        'intellectual_property',
        'environmental',
        'banking',
        'immigration',
        'personal_injury',
        'real_estate',
        'consumer_protection',
        'cyber',
        'medical_malpractice',
        'estate_planning',
        'bankruptcy',
        'other',
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual for file URL
documentSchema.virtual('fileUrl').get(function () {
  return `/api/documents/${this._id}/download`
})

// Virtual for processing status
documentSchema.virtual('isProcessed').get(function () {
  return this.status === 'completed'
})

// Indexes for better query performance
documentSchema.index({ user: 1 })
documentSchema.index({ status: 1 })
documentSchema.index({ language: 1 })
documentSchema.index({ category: 1 })
documentSchema.index({ tags: 1 })
documentSchema.index({ createdAt: -1 })
documentSchema.index({ 'extractedData.caseType': 1 })

// Text index for search functionality
documentSchema.index({
  fileName: 'text',
  originalName: 'text',
  'extractedData.caseDetails': 'text',
  'extractedData.summary': 'text',
  tags: 'text',
})

// Pre-save middleware to set category based on extracted data
documentSchema.pre('save', function (next) {
  if (this.extractedData && this.extractedData.caseType && !this.category) {
    // Map case types to categories
    const caseTypeMapping = {
      Civil: 'civil',
      Criminal: 'criminal',
      Family: 'family',
      Corporate: 'corporate',
      Tax: 'tax',
      Property: 'property',
      Constitutional: 'constitutional',
      Labor: 'labor',
      'Intellectual Property': 'intellectual_property',
      Environmental: 'environmental',
      Banking: 'banking',
      Immigration: 'immigration',
      'Personal Injury': 'personal_injury',
      'Real Estate': 'real_estate',
      'Consumer Protection': 'consumer_protection',
      Cyber: 'cyber',
      'Medical Malpractice': 'medical_malpractice',
      'Estate Planning': 'estate_planning',
      Bankruptcy: 'bankruptcy',
    }

    this.category = caseTypeMapping[this.extractedData.caseType] || 'other'
  }
  next()
})

// Static method to find documents by user
documentSchema.statics.findByUser = function (userId, options = {}) {
  const query = { user: userId }

  if (options.status) {
    query.status = options.status
  }

  if (options.category) {
    query.category = options.category
  }

  if (options.language) {
    query.language = options.language
  }

  return this.find(query).populate('user', 'name email').sort({ createdAt: -1 })
}

// Static method to search documents
documentSchema.statics.searchDocuments = function (searchQuery, filters = {}) {
  const query = {
    ...filters,
  }

  if (searchQuery) {
    query.$text = { $search: searchQuery }
  }

  return this.find(query)
    .populate('user', 'name email')
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
}

// Static method to get document statistics
documentSchema.statics.getStats = function (userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])
}

// Instance method to update processing status
documentSchema.methods.updateStatus = function (status, error = null) {
  this.status = status
  if (error) {
    this.processingError = error
  }
  return this.save()
}

// Instance method to add extracted data
documentSchema.methods.addExtractedData = function (data) {
  this.extractedData = { ...this.extractedData, ...data }
  this.status = 'completed'
  return this.save()
}

export default mongoose.model('Document', documentSchema)
