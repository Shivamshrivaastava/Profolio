const express = require('express');
const Result = require('../models/Result');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all results for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .sort({ testDate: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get results by skill
router.get('/skill/:skill', auth, async (req, res) => {
  try {
    const results = await Result.find({ 
      userId: req.user._id, 
      skillName: req.params.skill 
    }).sort({ testDate: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get verified skills for user
router.get('/verified-skills', auth, async (req, res) => {
  try {
    const verifiedResults = await Result.find({ 
      userId: req.user._id, 
      verified: true 
    }).sort({ testDate: -1 });
    
    const verifiedSkills = verifiedResults.map(result => ({
      skillName: result.skillName,
      score: result.score,
      testDate: result.testDate
    }));
    
    res.json(verifiedSkills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get analytics for user
router.get('/analytics', auth, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id });
    
    const totalTests = results.length;
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalTests || 0;
    const verifiedSkills = results.filter(result => result.verified).length;
    
    const skillBreakdown = {};
    results.forEach(result => {
      if (!skillBreakdown[result.skillName]) {
        skillBreakdown[result.skillName] = {
          attempts: 0,
          bestScore: 0,
          verified: false
        };
      }
      skillBreakdown[result.skillName].attempts++;
      skillBreakdown[result.skillName].bestScore = Math.max(
        skillBreakdown[result.skillName].bestScore, 
        result.score
      );
      if (result.verified) {
        skillBreakdown[result.skillName].verified = true;
      }
    });
    
    res.json({
      totalTests,
      averageScore: Math.round(averageScore),
      verifiedSkills,
      skillBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
