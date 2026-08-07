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

function Education() {
  const { education, addEducation, updateEducation, removeEducation } = useResume()
  const navigate = useNavigate()

  const handleNext = (e) => {
    e.preventDefault()
    navigate('/experience')
  }

  const handleBack = () => {
    navigate('/personal')
  }

  return (
    <>
      <StepIndicator currentStep={2} />

      <div className="form-card">
        <h2>Education</h2>

        <form onSubmit={handleNext}>
          {education.map((edu, index) => (
            <div key={index} className="entry-card">
              <div className="entry-header">
                <h3>Education #{index + 1}</h3>
                {education.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeEducation(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  required
                />
              </div>

              <div className="form-group">
                <label>University</label>
                <input
                  type="text"
                  value={edu.university}
                  onChange={(e) => updateEducation(index, 'university', e.target.value)}
                  placeholder="e.g. MIT"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Year</label>
                  <input
                    type="number"
                    value={edu.start_year}
                    onChange={(e) => updateEducation(index, 'start_year', e.target.value)}
                    placeholder="2020"
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Year</label>
                  <input
                    type="number"
                    value={edu.end_year}
                    onChange={(e) => updateEducation(index, 'end_year', e.target.value)}
                    placeholder="2024"
                    min="1950"
                    max="2030"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={edu.cgpa}
                  onChange={(e) => updateEducation(index, 'cgpa', e.target.value)}
                  placeholder="3.75"
                  min="0"
                  max="10"
                />
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-add" onClick={addEducation}>
            + Add Education
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

export default Education
