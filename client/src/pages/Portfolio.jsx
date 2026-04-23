import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Portfolio = () => {
  const [resume, setResume] = useState(null);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const [resumeResponse, skillsResponse] = await Promise.all([
        axios.get('/api/resume'),
        axios.get('/api/results/verified-skills')
      ]);
      
      setResume(resumeResponse.data);
      setVerifiedSkills(skillsResponse.data);
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShareableLink = () => {
    const portfolioUrl = `${window.location.protocol}//${window.location.host}/portfolio/${user?.id}`;
    return portfolioUrl;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareableLink());
    // Show success message (you could add a toast notification here)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Portfolio</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Share Your Portfolio</h3>
                <p className="text-blue-700 text-sm">
                  Share this link with recruiters and potential employers
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareableLink()}
                    className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-md text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="btn-primary text-sm"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!resume ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Resume Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your resume to build your portfolio
            </p>
            <Link to="/resume" className="btn-primary">
              Create Resume
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="card">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {resume.personalInfo.name || 'Your Name'}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {resume.personalInfo.summary || 'Professional summary will appear here'}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  {resume.personalInfo.email && (
                    <a href={`mailto:${resume.personalInfo.email}`} className="text-blue-600 hover:underline">
                      {resume.personalInfo.email}
                    </a>
                  )}
                  {resume.personalInfo.phone && (
                    <span>{resume.personalInfo.phone}</span>
                  )}
                  {resume.personalInfo.location && (
                    <span>{resume.personalInfo.location}</span>
                  )}
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  {resume.personalInfo.website && (
                    <a href={resume.personalInfo.website} className="text-blue-600 hover:underline">
                      Website
                    </a>
                  )}
                  {resume.personalInfo.linkedin && (
                    <a href={resume.personalInfo.linkedin} className="text-blue-600 hover:underline">
                      LinkedIn
                    </a>
                  )}
                  {resume.personalInfo.github && (
                    <a href={resume.personalInfo.github} className="text-blue-600 hover:underline">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Verified Skills Section */}
            {verifiedSkills.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Verified Skills</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {verifiedSkills.map((skill, index) => (
                    <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-green-900">{skill.skillName}</h3>
                        <span className="verified-badge">Verified</span>
                      </div>
                      <div className="text-sm text-green-700">
                        <div className="flex items-center justify-between mb-1">
                          <span>Score:</span>
                          <span className="font-bold">{skill.score}%</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${skill.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        Verified on {new Date(skill.testDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Skills Section */}
            {resume.skills.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-2 rounded-full text-sm font-medium ${
                        skill.verified
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {skill.name} ({skill.level})
                      {skill.verified && ' ✓'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {resume.experience.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-gray-600 mb-2">
                        {exp.startDate} - {exp.endDate}
                      </p>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {resume.education.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                <div className="space-y-6">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-lg text-purple-600 font-medium">{edu.institution}</p>
                      <p className="text-gray-600 mb-2">
                        {edu.startDate} - {edu.endDate}
                      </p>
                      {edu.gpa && <p className="text-gray-700">GPA: {edu.gpa}</p>}
                      {edu.description && <p className="text-gray-700">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {resume.projects.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{project.startDate} - {project.endDate}</span>
                        <div className="space-x-2">
                          {project.url && (
                            <a href={project.url} className="text-blue-600 hover:underline">
                              Live
                            </a>
                          )}
                          {project.github && (
                            <a href={project.github} className="text-blue-600 hover:underline">
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Link to="/resume" className="btn-secondary">
                Edit Resume
              </Link>
              <Link to="/skill-tests" className="btn-primary">
                Verify More Skills
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
