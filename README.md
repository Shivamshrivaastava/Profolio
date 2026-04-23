# Resume + Portfolio Builder with Skill Verification

A full-stack MERN application that allows users to create professional resumes, verify their skills through assessments, and generate shareable portfolios with verified badges.

## 🚀 Features

- **Resume Builder**: Create and edit professional resumes with live preview
- **Skill Verification**: Take MCQ tests to verify your skills and earn badges
- **Verified Badges**: Display verified skills on your resume and portfolio
- **Public Portfolio**: Shareable portfolio link showcasing verified skills
- **Dashboard Analytics**: Track test performance and skill progress
- **JWT Authentication**: Secure user authentication system

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd resume-portfolio-builder
```

### 2. Backend Setup

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-portfolio
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Seed the Database with Sample Tests

```bash
cd server
node seedData.js
```

### 5. Start the Backend Server

```bash
cd server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 6. Frontend Setup

```bash
cd client
npm install
```

### 7. Start the Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 📱 Usage

1. **Register/Login**: Create an account or login to your existing account
2. **Build Resume**: Navigate to Resume Builder to create your professional resume
3. **Verify Skills**: Take skill tests to earn verified badges
4. **View Portfolio**: See your portfolio with verified skills
5. **Share Portfolio**: Copy your portfolio link to share with recruiters

## 🗂 Project Structure

```
resume-portfolio-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main App component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── seedData.js        # Database seeding script
│   └── index.js           # Server entry point
└── README.md
```

## 🎯 Available Skill Tests

The application comes with pre-loaded skill tests for:

- **JavaScript** (Intermediate)
- **React** (Intermediate) 
- **Node.js** (Intermediate)
- **HTML/CSS** (Beginner)
- **MongoDB** (Intermediate)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Resume
- `GET /api/resume` - Get user's resume
- `POST /api/resume` - Create/update resume
- `PUT /api/resume/:section` - Update specific section
- `GET /api/resume/public/:userId` - Get public portfolio

### Skill Tests
- `GET /api/test` - Get all available tests
- `GET /api/test/:skill` - Get specific test
- `POST /api/test/submit` - Submit test answers
- `GET /api/test/results/my-results` - Get user's test results

### Results
- `GET /api/results` - Get all user results
- `GET /api/results/analytics` - Get user analytics
- `GET /api/results/verified-skills` - Get verified skills

## 🔧 Development

### Adding New Skill Tests

1. Create a new test object in `server/seedData.js`
2. Run the seeding script to add it to the database

### Customizing the UI

- Modify Tailwind CSS classes in `client/src/index.css`
- Update component styles in individual component files

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend: `cd client && npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables for API URL

### Backend (Heroku/Render)

1. Set environment variables for production
2. Deploy the server directory
3. Ensure MongoDB is accessible from production

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, please open an issue in the repository or contact the development team.
