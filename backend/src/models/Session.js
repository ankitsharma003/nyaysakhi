import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    deviceInfo: {
      type: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet'],
        required: true,
      },
      os: {
        type: String,
        required: true,
      },
      browser: {
        type: String,
        required: true,
      },
      location: String,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Index for better query performance
sessionSchema.index({ user: 1 })
sessionSchema.index({ isActive: 1 })

// TTL index to automatically delete expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Pre-save middleware to update lastActivity
sessionSchema.pre('save', function (next) {
  this.lastActivity = new Date()
  next()
})

// Static method to find active sessions for a user
sessionSchema.statics.findActiveByUser = function (userId) {
  return this.find({
    user: userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  })
}

// Static method to revoke all sessions for a user
sessionSchema.statics.revokeAllForUser = function (userId) {
  return this.updateMany({ user: userId, isActive: true }, { isActive: false })
}

// Instance method to revoke session
sessionSchema.methods.revoke = function () {
  this.isActive = false
  return this.save()
}

// Instance method to check if session is expired
sessionSchema.methods.isExpired = function () {
  return this.expiresAt < new Date()
}

export default mongoose.model('Session', sessionSchema)
