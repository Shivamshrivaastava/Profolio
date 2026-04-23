const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    summary: String
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
    description: String
  }],
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedScore: Number
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    startDate: String,
    endDate: String,
    url: String,
    github: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    achievements: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
