const express = require('express');
const SkillTest = require('../models/SkillTest');
const Result = require('../models/Result');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all available tests
router.get('/', async (req, res) => {
  try {
    const tests = await SkillTest.find({ isActive: true })
      .select('-questions.correctAnswer -questions.explanation');
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ 
      message: 'Server error while fetching tests', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get specific test by skill name
router.get('/:skill', async (req, res) => {
  try {
    const test = await SkillTest.findOne({ 
      skillName: req.params.skill, 
      isActive: true 
    }).select('-questions.correctAnswer -questions.explanation');
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit test answers
router.post('/submit', auth, async (req, res) => {
  try {
    const { skillName, answers, timeTaken } = req.body;
    
    // Get the test with correct answers
    const test = await SkillTest.findOne({ skillName, isActive: true });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const isCorrect = answer === test.questions[index].correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: index,
        selectedAnswer: answer,
        isCorrect
      };
    });
    
    const score = Math.round((correctAnswers / test.questions.length) * 100);
    const verified = score >= 80; // Updated to 80% minimum
    
    // Save result
    const result = new Result({
      userId: req.user._id,
      skillName,
      score,
      totalQuestions: test.questions.length,
      correctAnswers,
      verified,
      answers: processedAnswers,
      timeTaken,
      attempts: 1
    });
    
    await result.save();
    
    // Update resume if skill is verified
    if (verified) {
      const resume = await Resume.findOne({ userId: req.user._id });
      if (resume) {
        const skillIndex = resume.skills.findIndex(skill => skill.name === skillName);
        if (skillIndex !== -1) {
          resume.skills[skillIndex].verified = true;
          resume.skills[skillIndex].verifiedScore = score;
          await resume.save();
        }
      }
    }
    
    res.json({
      message: 'Test submitted successfully',
      result: {
        score,
        correctAnswers,
        totalQuestions: test.questions.length,
        verified,
        passingScore: 80 // Updated to 80%
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's test results
router.get('/results/my-results', auth, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .sort({ testDate: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
