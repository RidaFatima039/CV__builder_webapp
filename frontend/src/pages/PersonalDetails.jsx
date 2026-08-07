import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'

// Step indicator component showing current progress
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

function PersonalDetails() {
  const { personal, updatePersonal, setProfileImage } = useResume()
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    navigate('/education')
  }

  return (
    <>
      <StepIndicator currentStep={1} />

      <div className="form-card">
        <h2>Personal Details</h2>

        <form onSubmit={handleNext}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                value={personal.first_name}
                onChange={(e) => updatePersonal('first_name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                value={personal.last_name}
                onChange={(e) => updatePersonal('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                value={personal.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={personal.address}
              onChange={(e) => updatePersonal('address', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={personal.linkedin}
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="github">GitHub</label>
              <input
                type="url"
                id="github"
                placeholder="https://github.com/username"
                value={personal.github}
                onChange={(e) => updatePersonal('github', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="professional_summary">Professional Summary</label>
            <textarea
              id="professional_summary"
              value={personal.professional_summary}
              onChange={(e) => updatePersonal('professional_summary', e.target.value)}
              placeholder="Write a brief summary about yourself..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile_image">Profile Image</label>
            <input
              type="file"
              id="profile_image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {personal.profile_image_preview && (
              <div className="image-preview">
                <img src={personal.profile_image_preview} alt="Profile preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <div />
            <button type="submit" className="btn btn-primary">Next</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default PersonalDetails
