import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkillTests = () => {
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    let timer;
    if (testStarted && !testCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && testStarted && !testCompleted) {
      handleSubmitTest();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, testCompleted]);

  const fetchTests = async () => {
    try {
      const response = await axios.get('/api/test');
      setTests(response.data);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (test) => {
    try {
      const response = await axios.get(`/api/test/${test.skillName}`);
      setCurrentTest(response.data);
      setAnswers(new Array(response.data.questions.length).fill(null));
      setTimeLeft(response.data.duration * 60);
      setTestStarted(true);
      setTestCompleted(false);
      setResults(null);
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const timeTaken = (currentTest.duration * 60) - timeLeft;
      const response = await axios.post('/api/test/submit', {
        skillName: currentTest.skillName,
        answers,
        timeTaken
      });
      
      setResults(response.data.result);
      setTestCompleted(true);
    } catch (error) {
      console.error('Failed to submit test:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setAnswers([]);
    setTestStarted(false);
    setTestCompleted(false);
    setTimeLeft(0);
    setResults(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading skill tests...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Skill Verification Tests</h1>

        {!testStarted && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
              <p className="text-gray-600 mb-6">
                Take skill verification tests to earn verified badges on your resume.
              </p>
              
              {tests.length === 0 ? (
                <p className="text-gray-500">No tests available at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tests.map((test) => (
                    <div key={test._id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg">{test.skillName}</h3>
                      <p className="text-gray-600 text-sm mb-2">{test.category}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Difficulty: {test.difficulty}</span>
                        <span>Duration: {test.duration} min</span>
                        <span>Passing: {test.passingScore}%</span>
                      </div>
                      <button
                        onClick={() => startTest(test)}
                        className="btn-primary w-full"
                      >
                        Start Test
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {testStarted && currentTest && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{currentTest.skillName} Test</h2>
              <div className="flex items-center space-x-4">
                <div className={`text-lg font-medium ${
                  timeLeft < 60 ? 'text-red-600' : 'text-gray-700'
                }`}>
                  Time: {formatTime(timeLeft)}
                </div>
                <button
                  onClick={handleSubmitTest}
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
            </div>

            {!testCompleted ? (
              <div className="space-y-6">
                {currentTest.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-3">
                      Question {qIndex + 1}: {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <label key={oIndex} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            checked={answers[qIndex] === oIndex}
                            onChange={() => handleAnswerChange(qIndex, oIndex)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-4">Test Completed!</h3>
                {results && (
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {results.score}%
                      </div>
                      <p className="text-gray-600">
                        {results.correctAnswers} out of {results.totalQuestions} correct
                      </p>
                    </div>
                    
                    {results.verified ? (
                      <div className="mb-6">
                        <div className="verified-badge text-lg mb-2">🎉 Skill Verified!</div>
                        <p className="text-gray-600">
                          Your skill has been verified and added to your resume.
                        </p>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-2">
                          Not Verified
                        </div>
                        <p className="text-gray-600">
                          You need {results.passingScore}% or higher to verify this skill.
                          Try again after reviewing the material.
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={resetTest}
                      className="btn-primary"
                    >
                      Back to Tests
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTests;
