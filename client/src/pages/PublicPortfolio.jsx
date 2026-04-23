import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PublicPortfolio = () => {
  const { userId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicPortfolio();
  }, [userId]);

  const fetchPublicPortfolio = async () => {
    try {
      const response = await axios.get(`/api/resume/public/${userId}`);
      setPortfolioData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Portfolio not found');
      } else {
        setError('Failed to load portfolio');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{error}</h3>
          <p className="text-gray-600">
            This portfolio may not exist or may not be publicly available.
          </p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Not Found</h3>
          <p className="text-gray-600">
            This portfolio may not exist or may not be publicly available.
          </p>
        </div>
      </div>
    );
  }

  const { resume, verifiedSkills, user } = portfolioData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Public Portfolio
            </div>
            <div className="text-sm text-gray-500">
              Powered by ResumeBuilder Pro
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Header Section */}
          <div className="card">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {resume.personalInfo.name || 'Professional Portfolio'}
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
          {verifiedSkills && verifiedSkills.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">✓ Verified Skills</h2>
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

          {/* Footer */}
          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              This portfolio was created using ResumeBuilder Pro
            </p>
            <p className="text-xs text-gray-400">
              Skills marked with ✓ have been verified through skill assessment tests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;
