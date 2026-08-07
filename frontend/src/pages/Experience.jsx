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

function Experience() {
  const { experience, addExperience, updateExperience, removeExperience } = useResume()
  const navigate = useNavigate()

  const handleNext = (e) => {
    e.preventDefault()
    navigate('/projects')
  }

  const handleBack = () => {
    navigate('/education')
  }

  return (
    <>
      <StepIndicator currentStep={3} />

      <div className="form-card">
        <h2>Work Experience</h2>

        <form onSubmit={handleNext}>
          {experience.map((exp, index) => (
            <div key={index} className="entry-card">
              <div className="entry-header">
                <h3>Experience #{index + 1}</h3>
                {experience.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeExperience(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="e.g. Google"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={exp.job_title}
                    onChange={(e) => updateExperience(index, 'job_title', e.target.value)}
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={exp.start_date}
                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={exp.end_date}
                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  required
                />
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-add" onClick={addExperience}>
            + Add Experience
          </button>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
            <button type="submit" className="btn btn-primary">Next</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Experience
