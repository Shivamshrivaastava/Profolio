const mongoose = require('mongoose');
const SkillTest = require('./models/SkillTest');
require('dotenv').config();

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
        question: 'What does the "===" operator do?',
        options: ['Assigns a value', 'Compares value and type', 'Compares only value', 'Creates a new variable'],
        correctAnswer: 1,
        explanation: '=== is the strict equality operator that compares both value and type'
      },
      {
        question: 'Which keyword is used to declare a constant?',
        options: ['var', 'let', 'const', 'constant'],
        correctAnswer: 2,
        explanation: 'const is used to declare constants in JavaScript'
      },
      {
        question: 'What is a closure in JavaScript?',
        options: [
          'A way to close a program',
          'A function that has access to outer function variables',
          'A type of loop',
          'A way to declare variables'
        ],
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
          'To uniquely identify elements in a list',
          'To pass props to children',
          'To handle events'
        ],
        correctAnswer: 1,
        explanation: 'Keys help React identify which items have changed in a list'
      },
      {
        question: 'Which method is used to update state in functional components?',
        options: ['setState()', 'updateState()', 'useState setter function', 'modifyState()'],
        correctAnswer: 2,
        explanation: 'The setter function returned by useState is used to update state'
      },
      {
        question: 'What is JSX?',
        options: [
          'JavaScript XML',
          'Java Syntax Extension',
          'JavaScript Style Sheets',
          'JSON XML'
        ],
        correctAnswer: 0,
        explanation: 'JSX stands for JavaScript XML and allows writing HTML in React'
      },
      {
        question: 'What hook is used for managing component state?',
        options: ['useEffect', 'useContext', 'useState', 'useReducer'],
        correctAnswer: 2,
        explanation: 'useState is the primary hook for managing component state'
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
        explanation: 'npm is the Node Package Manager for managing dependencies'
      },
      {
        question: 'Which module is used for creating HTTP servers?',
        options: ['http', 'url', 'fs', 'path'],
        correctAnswer: 0,
        explanation: 'The http module is used to create HTTP servers in Node.js'
      },
      {
        question: 'What is the purpose of package.json?',
        options: [
          'To store application metadata',
          'To write JavaScript code',
          'To style the application',
          'To create database connections'
        ],
        correctAnswer: 0,
        explanation: 'package.json contains project metadata and dependencies'
      },
      {
        question: 'Which method reads a file asynchronously?',
        options: ['readFileSync()', 'readFile()', 'getFile()', 'loadFile()'],
        correctAnswer: 1,
        explanation: 'readFile() reads files asynchronously in Node.js'
      },
      {
        question: 'What is Express.js?',
        options: [
          'A database',
          'A frontend framework',
          'A web application framework',
          'A testing tool'
        ],
        correctAnswer: 2,
        explanation: 'Express.js is a web application framework for Node.js'
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
        question: 'Which HTML element is used for linking external CSS?',
        options: ['<css>', '<style>', '<link>', '<script>'],
        correctAnswer: 2,
        explanation: '<link> tag is used to link external CSS files'
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
        question: 'Which CSS property adds space inside an element?',
        options: ['margin', 'padding', 'border', 'spacing'],
        correctAnswer: 1,
        explanation: 'padding adds space inside an element'
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
        explanation: 'MongoDB is a NoSQL document database'
      },
      {
        question: 'What is the basic unit of data in MongoDB?',
        options: ['Table', 'Row', 'Document', 'Column'],
        correctAnswer: 2,
        explanation: 'Documents are the basic unit of data in MongoDB'
      },
      {
        question: 'Which method is used to find documents in a collection?',
        options: ['search()', 'find()', 'get()', 'query()'],
        correctAnswer: 1,
        explanation: 'find() method is used to query documents in MongoDB'
      },
      {
        question: 'What is Mongoose?',
        options: [
          'A MongoDB GUI tool',
          'An Object Data Modeling library',
          'A MongoDB driver',
          'A testing framework'
        ],
        correctAnswer: 1,
        explanation: 'Mongoose is an ODM library for MongoDB'
      },
      {
        question: 'Which operator matches values greater than a specified value?',
        options: ['$gt', '$lt', '$eq', '$ne'],
        correctAnswer: 0,
        explanation: '$gt operator matches values greater than the specified value'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-portfolio');
    console.log('Connected to MongoDB');

    // Clear existing tests
    await SkillTest.deleteMany({});
    console.log('Cleared existing skill tests');

    // Insert sample tests
    await SkillTest.insertMany(sampleTests);
    console.log('Sample skill tests inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
