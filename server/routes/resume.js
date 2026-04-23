const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's resume
router.get('/', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ 
      message: 'Server error while fetching resume', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create or update resume
router.post('/', auth, async (req, res) => {
  try {
    const { personalInfo, education, skills, projects, experience } = req.body;
    
    // Basic validation
    if (!personalInfo && !education && !skills && !projects && !experience) {
      return res.status(400).json({ 
        message: 'At least one section must be provided',
        required: ['personalInfo', 'education', 'skills', 'projects', 'experience']
      });
    }

    // Validate email format if provided
    if (personalInfo?.email && !personalInfo.email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    let resume = await Resume.findOne({ userId: req.user._id });
    
    if (resume) {
      // Update existing resume
      resume.personalInfo = personalInfo || resume.personalInfo;
      resume.education = education || resume.education;
      resume.skills = skills || resume.skills;
      resume.projects = projects || resume.projects;
      resume.experience = experience || resume.experience;
      resume.updatedAt = Date.now();
    } else {
      // Create new resume
      resume = new Resume({
        userId: req.user._id,
        personalInfo,
        education,
        skills,
        projects,
        experience
      });
    }
    
    await resume.save();
    res.json(resume);
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ 
      message: 'Server error while saving resume', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update specific section
router.put('/:section', auth, async (req, res) => {
  try {
    const { section } = req.params;
    const allowedSections = ['personalInfo', 'education', 'skills', 'projects', 'experience'];
    
    if (!allowedSections.includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    
    let resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    resume[section] = req.body[section];
    resume.updatedAt = Date.now();
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete resume
router.delete('/', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get public portfolio by user ID
router.get('/public/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user information
    const User = require('../models/User');
    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get resume
    const resume = await Resume.findOne({ userId }).lean();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Get verified skills
    const Result = require('../models/Result');
    const verifiedSkills = await Result.find({ 
      userId, 
      verified: true 
    }).select('skillName score testDate');
    
    res.json({
      user,
      resume,
      verifiedSkills
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
