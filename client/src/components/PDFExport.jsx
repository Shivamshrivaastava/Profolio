import React from 'react';

const PDFExport = ({ resume }) => {
  const generatePDF = () => {
    // Check if resume has content
    if (!resume || Object.keys(resume).length === 0) {
      alert('Please add content to your resume before exporting to PDF');
      return;
    }

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    
    // Write the resume content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resume.personalInfo.name || 'Resume'} - Resume</title>
        <style>
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.3;
            color: #333;
            max-width: 100%;
            margin: 0;
            padding: 0.3in;
            font-size: 10px;
            background: white;
            height: 100vh;
            box-sizing: border-box;
          }
          
          @media print {
            body { 
              margin: 0;
              padding: 0.25in;
              -webkit-print-color-adjust: exact;
              height: 100vh;
              box-sizing: border-box;
            }
            @page {
              size: A4;
              margin: 0.25in;
              size: portrait;
            }
          }
          
          .resume-container {
            max-width: 100%;
            margin: 0;
            padding: 0;
            height: calc(100vh - 0.5in);
            box-sizing: border-box;
          }
          
          .header {
            border-bottom: 2px solid #333;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          
          .name {
            font-size: 22px;
            font-weight: bold;
            margin: 0;
            color: #333;
          }
          
          .contact-info {
            font-size: 9px;
            margin: 3px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }
          
          .contact-item {
            margin: 0;
          }
          
          .section {
            margin-bottom: 8px;
          }
          
          .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #ccc;
            padding-bottom: 1px;
            margin-bottom: 5px;
            color: #333;
          }
          
          .summary {
            font-size: 9px;
            line-height: 1.2;
            margin-bottom: 8px;
          }
          
          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 8px;
          }
          
          .skill-item {
            font-size: 8px;
            background: #f5f5f5;
            padding: 2px 4px;
            border-radius: 2px;
            border: 1px solid #ddd;
          }
          
          .verified {
            color: #28a745;
            font-weight: bold;
            font-size: 7px;
          }
          
          .experience-item, .education-item, .project-item {
            margin-bottom: 6px;
            font-size: 9px;
          }
          
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1px;
          }
          
          .item-title {
            font-weight: bold;
            font-size: 10px;
          }
          
          .item-company, .item-institution {
            font-style: italic;
            font-size: 9px;
            color: #555;
          }
          
          .item-date {
            font-size: 8px;
            color: #666;
            white-space: nowrap;
          }
          
          .item-description {
            font-size: 8px;
            line-height: 1.2;
            margin-top: 1px;
          }
          
          .tech-list {
            font-size: 8px;
            color: #666;
            margin-top: 1px;
          }
          
          .two-column {
            display: flex;
            gap: 15px;
          }
          
          .column {
            flex: 1;
          }
          
          a {
            color: #0066cc;
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          <!-- Header Section -->
          <div class="header">
            <h1 class="name">${resume.personalInfo.name || 'Your Name'}</h1>
            <div class="contact-info">
              ${resume.personalInfo.email ? `<span class="contact-item">📧 ${resume.personalInfo.email}</span>` : ''}
              ${resume.personalInfo.phone ? `<span class="contact-item">📱 ${resume.personalInfo.phone}</span>` : ''}
              ${resume.personalInfo.location ? `<span class="contact-item">📍 ${resume.personalInfo.location}</span>` : ''}
              ${resume.personalInfo.linkedin ? `<span class="contact-item">💼 ${resume.personalInfo.linkedin}</span>` : ''}
              ${resume.personalInfo.github ? `<span class="contact-item">🔗 ${resume.personalInfo.github}</span>` : ''}
              ${resume.personalInfo.website ? `<span class="contact-item">🌐 ${resume.personalInfo.website}</span>` : ''}
            </div>
          </div>

          ${resume.personalInfo.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${resume.personalInfo.summary}</div>
          </div>
          ` : ''}

          <!-- Two Column Layout -->
          <div class="two-column">
            <!-- Left Column -->
            <div class="column">
              ${resume.skills.length > 0 ? `
              <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-container">
                  ${resume.skills.map(skill => `
                    <div class="skill-item">
                      ${skill.name} ${skill.level}
                      ${skill.verified ? `<span class="verified">✓ ${skill.verifiedScore || 0}%</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}

              ${resume.education.length > 0 ? `
              <div class="section">
                <div class="section-title">Education</div>
                ${resume.education.map(edu => `
                  <div class="education-item">
                    <div class="item-header">
                      <div>
                        <div class="item-title">${edu.degree} in ${edu.field}</div>
                        <div class="item-institution">${edu.institution}</div>
                      </div>
                      <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
                    </div>
                    ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
                    ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
              ` : ''}
            </div>

            <!-- Right Column -->
            <div class="column">
              ${resume.experience.length > 0 ? `
              <div class="section">
                <div class="section-title">Work Experience</div>
                ${resume.experience.map(exp => `
                  <div class="experience-item">
                    <div class="item-header">
                      <div>
                        <div class="item-title">${exp.position}</div>
                        <div class="item-company">${exp.company}</div>
                      </div>
                      <div class="item-date">${exp.startDate} - ${exp.endDate}</div>
                    </div>
                    <div class="item-description">${exp.description}</div>
                  </div>
                `).join('')}
              </div>
              ` : ''}

              ${resume.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Projects</div>
                ${resume.projects.map(project => `
                  <div class="project-item">
                    <div class="item-header">
                      <div class="item-title">${project.name}</div>
                      <div class="item-date">${project.startDate} - ${project.endDate}</div>
                    </div>
                    <div class="item-description">${project.description}</div>
                    <div class="tech-list">Technologies: ${project.technologies.join(', ')}</div>
                    ${project.url || project.github ? `
                      <div class="tech-list">
                        ${project.url ? `🌐 <a href="${project.url}">${project.url}</a>` : ''}
                        ${project.github ? `🔗 <a href="${project.github}">${project.github}</a>` : ''}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    
    // Wait for content to load, then print
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <button
      onClick={generatePDF}
      className="btn-primary"
      disabled={!resume || Object.keys(resume || {}).length === 0}
    >
      Export to PDF
    </button>
  );
};

export default PDFExport;
