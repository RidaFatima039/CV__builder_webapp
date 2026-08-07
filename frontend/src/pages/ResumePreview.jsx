import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import './ResumePreview.css'

function ResumePreview() {
  const { savedResume, fetchResume, loading } = useResume()
  const navigate = useNavigate()

  useEffect(() => {
    if (!savedResume) {
      fetchResume()
    }
  }, [savedResume, fetchResume])

  if (loading) {
    return <div className="loading">Loading resume...</div>
  }

  if (!savedResume) {
    return (
      <div className="form-card">
        <h2>No Resume Found</h2>
        <p>Please fill out the form to create your resume.</p>
        <button className="btn btn-primary" onClick={() => navigate('/personal')}>
          Start Building
        </button>
      </div>
    )
  }

  const resume = savedResume

  // Profile image URL - works with Vite proxy (dev) and Azure Blob (prod)
  const profileImageUrl = resume.profile_image || null

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="resume-preview">
      <div className="resume-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/personal')}>
          Edit Resume
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print / Download PDF
        </button>
      </div>

      <div className="resume-document">
        {/* Header with personal details */}
        <div className="resume-header">
          {profileImageUrl && (
            <img src={profileImageUrl} alt="Profile" className="resume-photo" />
          )}
          <div className="resume-header-text">
            <h1>{resume.first_name} {resume.last_name}</h1>
            <div className="resume-contact">
              <span>{resume.email}</span>
              <span>{resume.phone}</span>
              <span>{resume.address}</span>
            </div>
            <div className="resume-links">
              {resume.linkedin && (
                <a href={resume.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              )}
              {resume.github && (
                <a href={resume.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {resume.professional_summary && (
          <section className="resume-section">
            <h2>Professional Summary</h2>
            <p>{resume.professional_summary}</p>
          </section>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <section className="resume-section">
            <h2>Education</h2>
            {resume.education.map((edu) => (
              <div key={edu.id} className="resume-item">
                <div className="resume-item-header">
                  <h3>{edu.degree}</h3>
                  <span className="resume-date">{edu.start_year} - {edu.end_year}</span>
                </div>
                <p className="resume-subtitle">{edu.university}</p>
                {edu.cgpa && <p className="resume-detail">CGPA: {edu.cgpa}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Work Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <section className="resume-section">
            <h2>Work Experience</h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="resume-item">
                <div className="resume-item-header">
                  <h3>{exp.job_title}</h3>
                  <span className="resume-date">
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="resume-subtitle">{exp.company}</p>
                <p className="resume-detail">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <section className="resume-section">
            <h2>Projects</h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} className="resume-item">
                <div className="resume-item-header">
                  <h3>{proj.project_name}</h3>
                  {proj.github_link && (
                    <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className="resume-link">
                      GitHub
                    </a>
                  )}
                </div>
                <p className="resume-subtitle">{proj.technology}</p>
                <p className="resume-detail">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

export default ResumePreview
