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

// Seed database with sample tests (for deployment)
router.post('/seed', async (req, res) => {
  try {
    const SkillTest = require('../models/SkillTest');
    
    // Clear existing tests
    await SkillTest.deleteMany({});
    
    const sampleTests = [
      {
        skillName: 'JavaScript',
        category: 'Programming',
        difficulty: 'Intermediate',
        duration: 20,
        passingScore: 80,
        questions: [
          {
            question: 'What is the output of: console.log(typeof null);',
            options: ['"null"', '"undefined"', '"object"', '"number"'],
            correctAnswer: 2,
            explanation: 'typeof null returns "object" - this is a known JavaScript quirk'
          },
          {
            question: 'Which method adds an element to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 0,
            explanation: 'push() adds elements to the end of an array'
          },
          {
            question: 'What does "===" do in JavaScript?',
            options: ['Assigns value', 'Compares value and type', 'Checks if null', 'Creates object'],
            correctAnswer: 1,
            explanation: '=== compares both value and type (strict equality)'
          },
          {
            question: 'Which keyword declares a constant?',
            options: ['var', 'let', 'const', 'function'],
            correctAnswer: 2,
            explanation: 'const declares a constant variable in JavaScript'
          },
          {
            question: 'What is a closure in JavaScript?',
            options: ['A loop', 'A function with access to outer scope variables', 'An array method', 'A type of object'],
            correctAnswer: 1,
            explanation: 'A closure is a function that has access to variables in its outer scope'
          }
        ]
      },
      {
        skillName: 'React',
        category: 'Frontend Framework',
        difficulty: 'Intermediate',
        duration: 25,
        passingScore: 80,
        questions: [
          {
            question: 'What hook is used for side effects in functional components?',
            options: ['useState', 'useEffect', 'useContext', 'useReducer'],
            correctAnswer: 1,
            explanation: 'useEffect is used for side effects in React functional components'
          },
          {
            question: 'What is the purpose of the key prop in React?',
            options: [
              'To style components',
              'To identify elements in lists',
              'To pass data',
              'To handle events'
            ],
            correctAnswer: 1,
            explanation: 'Keys help React identify which items have changed in lists'
          },
          {
            question: 'Which hook returns a stateful value and a function to update it?',
            options: ['useEffect', 'useContext', 'useState', 'useReducer'],
            correctAnswer: 2,
            explanation: 'useState is the primary hook for managing component state'
          },
          {
            question: 'What is JSX?',
            options: [
              'JavaScript XML',
              'A styling language',
              'A database query',
              'A testing framework'
            ],
            correctAnswer: 0,
            explanation: 'JSX is a syntax extension for JavaScript that looks like XML'
          },
          {
            question: 'How do you pass props to a component?',
            options: [
              'With parentheses',
              'With curly braces',
              'With quotes',
              'With angle brackets'
            ],
            correctAnswer: 1,
            explanation: 'Props are passed to components using curly braces: {propName}'
          }
        ]
      },
      {
        skillName: 'Node.js',
        category: 'Backend',
        difficulty: 'Intermediate',
        duration: 20,
        passingScore: 80,
        questions: [
          {
            question: 'What is npm?',
            options: [
              'Node Package Manager',
              'New Program Manager',
              'Node Programming Module',
              'Network Protocol Manager'
            ],
            correctAnswer: 0,
            explanation: 'npm stands for Node Package Manager'
          },
          {
            question: 'Which module is used to create a web server?',
            options: ['http', 'fs', 'path', 'url'],
            correctAnswer: 0,
            explanation: 'The http module is used to create web servers in Node.js'
          },
          {
            question: 'What is Express.js?',
            options: [
              'A database',
              'A web framework',
              'A frontend library',
              'A testing tool'
            ],
            correctAnswer: 1,
            explanation: 'Express.js is a web application framework for Node.js'
          },
          {
            question: 'How do you handle asynchronous operations in Node.js?',
            options: ['Callbacks', 'Promises', 'Async/await', 'All of the above'],
            correctAnswer: 3,
            explanation: 'Node.js supports callbacks, promises, and async/await for async operations'
          },
          {
            question: 'What is the event loop in Node.js?',
            options: [
              'A type of loop statement',
              'A mechanism for handling asynchronous operations',
              'A database connection',
              'A security feature'
            ],
            correctAnswer: 1,
            explanation: 'The event loop allows Node.js to handle non-blocking I/O operations'
          }
        ]
      },
      {
        skillName: 'HTML/CSS',
        category: 'Frontend',
        difficulty: 'Beginner',
        duration: 15,
        passingScore: 80,
        questions: [
          {
            question: 'Which HTML tag is used for the largest heading?',
            options: ['<h6>', '<heading>', '<h1>', '<header>'],
            correctAnswer: 2,
            explanation: '<h1> is used for the largest heading in HTML'
          },
          {
            question: 'Which CSS property changes the text color?',
            options: ['text-color', 'color', 'font-color', 'text-style'],
            correctAnswer: 1,
            explanation: 'The color property changes the text color in CSS'
          },
          {
            question: 'What does CSS stand for?',
            options: [
              'Computer Style Sheets',
              'Creative Style Sheets',
              'Cascading Style Sheets',
              'Colorful Style Sheets'
            ],
            correctAnswer: 2,
            explanation: 'CSS stands for Cascading Style Sheets'
          },
          {
            question: 'Which HTML element is used for links?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctAnswer: 1,
            explanation: 'The <a> (anchor) tag is used for creating hyperlinks'
          },
          {
            question: 'Which CSS property adds space inside an element?',
            options: ['margin', 'padding', 'border', 'spacing'],
            correctAnswer: 1,
            explanation: 'padding adds space inside an element, margin adds space outside'
          }
        ]
      },
      {
        skillName: 'MongoDB',
        category: 'Database',
        difficulty: 'Intermediate',
        duration: 20,
        passingScore: 80,
        questions: [
          {
            question: 'What type of database is MongoDB?',
            options: [
              'Relational',
              'NoSQL',
              'Graph',
              'Time Series'
            ],
            correctAnswer: 1,
            explanation: 'MongoDB is a NoSQL, document-oriented database'
          },
          {
            question: 'What is the basic unit of data in MongoDB?',
            options: ['Table', 'Row', 'Document', 'Column'],
            correctAnswer: 2,
            explanation: 'Documents are the basic unit of data in MongoDB'
          },
          {
            question: 'Which method is used to connect to MongoDB in Node.js?',
            options: ['connect()', 'mongoose.connect()', 'db.connect()', 'mongo.connect()'],
            correctAnswer: 1,
            explanation: 'mongoose.connect() is used to connect to MongoDB using Mongoose'
          },
          {
            question: 'What is a schema in Mongoose?',
            options: [
              'A database table',
              'A document structure blueprint',
              'A query method',
              'An index'
            ],
            correctAnswer: 1,
            explanation: 'A schema defines the structure of documents in a collection'
          },
          {
            question: 'Which operator matches documents where a field equals a specific value?',
            options: ['$eq', '$in', '$gt', '$lt'],
            correctAnswer: 0,
            explanation: '$eq matches documents where the field equals the specified value'
          }
        ]
      }
    ];
    
    await SkillTest.insertMany(sampleTests);
    
    res.json({ 
      message: 'Database seeded successfully',
      testsAdded: sampleTests.length
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ 
      message: 'Error seeding database', 
      error: error.message 
    });
  }
});

module.exports = router;
