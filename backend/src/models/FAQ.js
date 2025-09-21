import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Index for better query performance
faqSchema.index({ category: 1 })
faqSchema.index({ language: 1 })
faqSchema.index({ isActive: 1 })
faqSchema.index({ order: 1 })

// Text index for search functionality
faqSchema.index({
  question: 'text',
  answer: 'text',
  tags: 'text',
})

// Static method to find FAQs by category
faqSchema.statics.findByCategory = function (category, language = 'en') {
  return this.find({ category, language, isActive: true }).sort({ order: 1 })
}

// Static method to search FAQs
faqSchema.statics.searchFAQs = function (query, language = 'en', limit = 10) {
  return this.find({
    $text: { $search: query },
    language,
    isActive: true,
  })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
}

// Static method to get categories
faqSchema.statics.getCategories = function (language = 'en') {
  return this.aggregate([
    { $match: { language, isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
}

export default mongoose.model('FAQ', faqSchema)
