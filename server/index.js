const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Resume + Portfolio Builder API' });
});

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/test', require('./routes/test'));
app.use('/api/results', require('./routes/results'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
