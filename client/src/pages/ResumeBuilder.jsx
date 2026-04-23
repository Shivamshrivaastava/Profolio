import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ResumeBuilder = () => {
  const [resume, setResume] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    education: [],
    skills: [],
    projects: [],
    experience: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personalInfo');
  const { user } = useAuth();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await axios.get('/api/resume');
      setResume(response.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch resume:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      await axios.post('/api/resume', resume);
      // Show success message
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, {
        name: '',
        level: 'Beginner',
        verified: false,
        verifiedScore: 0
      }]
    }));
  };

  const updateSkill = (index, field, value) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (index) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        startDate: '',
        endDate: '',
        url: '',
        github: ''
      }]
    }));
  };

  const updateProject = (index, field, value) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: []
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading resume...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resume Builder</h1>
          <button
            onClick={saveResume}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Resume'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            {/* Section Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['personalInfo', 'education', 'skills', 'projects', 'experience'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeSection === section
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Personal Info Section */}
            {activeSection === 'personalInfo' && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="input-field"
                    value={resume.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="input-field"
                    value={resume.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="input-field"
                    value={resume.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="input-field"
                    value={resume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="Website"
                    className="input-field"
                    value={resume.personalInfo.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn"
                    className="input-field"
                    value={resume.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="GitHub"
                    className="input-field"
                    value={resume.personalInfo.github}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  />
                  <textarea
                    placeholder="Professional Summary"
                    className="input-field"
                    rows={4}
                    value={resume.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Education</h2>
                  <button onClick={addEducation} className="btn-secondary">
                    Add Education
                  </button>
                </div>
                <div className="space-y-4">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <input
                          type="text"
                          placeholder="Institution"
                          className="input-field"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          className="input-field"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Field of Study"
                          className="input-field"
                          value={edu.field}
                          onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Start Date"
                            className="input-field"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            className="input-field"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="GPA"
                          className="input-field"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        />
                        <textarea
                          placeholder="Description"
                          className="input-field"
                          rows={2}
                          value={edu.description}
                          onChange={(e) => updateEducation(index, 'description', e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => removeEducation(index)}
                        className="mt-3 text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Skills</h2>
                  <button onClick={addSkill} className="btn-secondary">
                    Add Skill
                  </button>
                </div>
                <div className="space-y-4">
                  {resume.skills.map((skill, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <input
                          type="text"
                          placeholder="Skill Name"
                          className="input-field"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        />
                        <select
                          className="input-field"
                          value={skill.level}
                          onChange={(e) => updateSkill(index, 'level', e.target.value)}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        {skill.verified && (
                          <div className="verified-badge">
                            Verified ({skill.verifiedScore}%)
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeSkill(index)}
                        className="mt-3 text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {activeSection === 'projects' && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <button onClick={addProject} className="btn-secondary">
                    Add Project
                  </button>
                </div>
                <div className="space-y-4">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <input
                          type="text"
                          placeholder="Project Name"
                          className="input-field"
                          value={project.name}
                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                        />
                        <textarea
                          placeholder="Description"
                          className="input-field"
                          rows={2}
                          value={project.description}
                          onChange={(e) => updateProject(index, 'description', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Technologies (comma-separated)"
                          className="input-field"
                          value={project.technologies.join(', ')}
                          onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Start Date"
                            className="input-field"
                            value={project.startDate}
                            onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            className="input-field"
                            value={project.endDate}
                            onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                          />
                        </div>
                        <input
                          type="url"
                          placeholder="Project URL"
                          className="input-field"
                          value={project.url}
                          onChange={(e) => updateProject(index, 'url', e.target.value)}
                        />
                        <input
                          type="url"
                          placeholder="GitHub URL"
                          className="input-field"
                          value={project.github}
                          onChange={(e) => updateProject(index, 'github', e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => removeProject(index)}
                        className="mt-3 text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Work Experience</h2>
                  <button onClick={addExperience} className="btn-secondary">
                    Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <input
                          type="text"
                          placeholder="Company"
                          className="input-field"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          className="input-field"
                          value={exp.position}
                          onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Start Date"
                            className="input-field"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="End Date (or 'Current')"
                            className="input-field"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          />
                        </div>
                        <textarea
                          placeholder="Description"
                          className="input-field"
                          rows={3}
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => removeExperience(index)}
                        className="mt-3 text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[842px]">
                {/* Resume Preview Content */}
                <div className="text-sm">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {resume.personalInfo.name || 'Your Name'}
                    </h1>
                    <div className="text-gray-600 mt-2">
                      <p>{resume.personalInfo.email}</p>
                      <p>{resume.personalInfo.phone}</p>
                      <p>{resume.personalInfo.location}</p>
                      <div className="flex justify-center space-x-4 mt-2">
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

                  {/* Summary */}
                  {resume.personalInfo.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Summary</h2>
                      <p className="text-gray-700">{resume.personalInfo.summary}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {resume.skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              skill.verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {skill.name} ({skill.level})
                            {skill.verified && ' ✓'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {resume.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
                      {resume.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</p>
                          <p className="text-gray-700 mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {resume.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
                      {resume.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</p>
                          {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {resume.projects.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Projects</h2>
                      {resume.projects.map((project, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-gray-700">{project.description}</p>
                          <p className="text-gray-500 text-sm">
                            {project.technologies.join(', ')}
                          </p>
                          <p className="text-gray-500 text-sm">{project.startDate} - {project.endDate}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
