import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'

function StepIndicator({ currentStep }) {
  const steps = [1, 2, 3, 4]
  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div
          key={step}
          className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
        >
          {step}
        </div>
      ))}
    </div>
  )
}

function Projects() {
  const { projects, addProject, updateProject, removeProject, submitResume, loading, error } = useResume()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')

  const handleGenerate = async (e) => {
    e.preventDefault()
    setSubmitError('')

    try {
      await submitResume()
      navigate('/preview')
    } catch (err) {
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : 'Failed to generate resume.'
      setSubmitError(msg)
    }
  }

  const handleBack = () => {
    navigate('/experience')
  }

  return (
    <>
      <StepIndicator currentStep={4} />

      <div className="form-card">
        <h2>Projects</h2>

        {(submitError || error) && (
          <div className="error-message">{submitError || error}</div>
        )}

        <form onSubmit={handleGenerate}>
          {projects.map((proj, index) => (
            <div key={index} className="entry-card">
              <div className="entry-header">
                <h3>Project #{index + 1}</h3>
                {projects.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeProject(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={proj.project_name}
                  onChange={(e) => updateProject(index, 'project_name', e.target.value)}
                  placeholder="e.g. E-Commerce Platform"
                  required
                />
              </div>

              <div className="form-group">
                <label>Technology</label>
                <input
                  type="text"
                  value={proj.technology}
                  onChange={(e) => updateProject(index, 'technology', e.target.value)}
                  placeholder="e.g. React, Node.js, MongoDB"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={proj.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  placeholder="Describe the project..."
                  required
                />
              </div>

              <div className="form-group">
                <label>GitHub Link</label>
                <input
                  type="url"
                  value={proj.github_link}
                  onChange={(e) => updateProject(index, 'github_link', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-add" onClick={addProject}>
            + Add Project
          </button>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Resume'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Projects
