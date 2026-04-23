const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  timeTaken: {
    type: Number,
    required: true
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  attempts: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Result', resultSchema);
