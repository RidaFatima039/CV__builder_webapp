import { createContext, useContext, useState } from 'react'
import axios from 'axios'

// API base URL - uses Vite env var or defaults to /api (proxied in dev)
const API_URL = import.meta.env.VITE_API_URL || '/api'

const ResumeContext = createContext()

// Default empty form values
const emptyPersonal = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  github: '',
  professional_summary: '',
  profile_image: null,
  profile_image_preview: '',
}

const emptyEducation = {
  degree: '',
  university: '',
  start_year: '',
  end_year: '',
  cgpa: '',
}

const emptyExperience = {
  company: '',
  job_title: '',
  start_date: '',
  end_date: '',
  description: '',
}

const emptyProject = {
  project_name: '',
  technology: '',
  description: '',
  github_link: '',
}

export function ResumeProvider({ children }) {
  const [personal, setPersonal] = useState({ ...emptyPersonal })
  const [education, setEducation] = useState([{ ...emptyEducation }])
  const [experience, setExperience] = useState([{ ...emptyExperience }])
  const [projects, setProjects] = useState([{ ...emptyProject }])
  const [resumeId, setResumeId] = useState(null)
  const [savedResume, setSavedResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Update personal details field
  const updatePersonal = (field, value) => {
    setPersonal((prev) => ({ ...prev, [field]: value }))
  }

  // Handle profile image selection with preview
  const setProfileImage = (file) => {
    if (file) {
      const preview = URL.createObjectURL(file)
      setPersonal((prev) => ({
        ...prev,
        profile_image: file,
        profile_image_preview: preview,
      }))
    }
  }

  // Education list helpers
  const addEducation = () => {
    setEducation((prev) => [...prev, { ...emptyEducation }])
  }

  const updateEducation = (index, field, value) => {
    setEducation((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index))
  }

  // Experience list helpers
  const addExperience = () => {
    setExperience((prev) => [...prev, { ...emptyExperience }])
  }

  const updateExperience = (index, field, value) => {
    setExperience((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeExperience = (index) => {
    setExperience((prev) => prev.filter((_, i) => i !== index))
  }

  // Project list helpers
  const addProject = () => {
    setProjects((prev) => [...prev, { ...emptyProject }])
  }

  const updateProject = (index, field, value) => {
    setProjects((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index))
  }

  // Submit all data to backend on final page
  const submitResume = async () => {
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()

      // Append personal details
      formData.append('first_name', personal.first_name)
      formData.append('last_name', personal.last_name)
      formData.append('email', personal.email)
      formData.append('phone', personal.phone)
      formData.append('address', personal.address)
      formData.append('linkedin', personal.linkedin)
      formData.append('github', personal.github)
      formData.append('professional_summary', personal.professional_summary)

      // Append profile image if selected
      if (personal.profile_image) {
        formData.append('profile_image', personal.profile_image)
      }

      // Append nested arrays as JSON strings
      formData.append('education', JSON.stringify(
        education.map((e) => ({
          degree: e.degree,
          university: e.university,
          start_year: parseInt(e.start_year) || 0,
          end_year: parseInt(e.end_year) || 0,
          cgpa: e.cgpa ? parseFloat(e.cgpa) : null,
        }))
      ))

      formData.append('experience', JSON.stringify(
        experience.map((e) => ({
          company: e.company,
          job_title: e.job_title,
          start_date: e.start_date,
          end_date: e.end_date || null,
          description: e.description,
        }))
      ))

      formData.append('projects', JSON.stringify(
        projects.map((p) => ({
          project_name: p.project_name,
          technology: p.technology,
          description: p.description,
          github_link: p.github_link,
        }))
      ))

      let response
      if (resumeId) {
        response = await axios.put(`${API_URL}/resume/${resumeId}/`, formData)
      } else {
        response = await axios.post(`${API_URL}/resume/`, formData)
      }

      setResumeId(response.data.id)
      setSavedResume(response.data)
      setLoading(false)
      return response.data
    } catch (err) {
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : 'Failed to save resume. Please try again.'
      setError(msg)
      setLoading(false)
      throw err
    }
  }

  // Fetch saved resume from backend
  const fetchResume = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/resume/`)
      if (response.data.length > 0) {
        const resume = response.data[0]
        setSavedResume(resume)
        setResumeId(resume.id)
        setLoading(false)
        return resume
      }
      setLoading(false)
      return null
    } catch (err) {
      setError('Failed to load resume.')
      setLoading(false)
      return null
    }
  }

  const value = {
    personal,
    updatePersonal,
    setProfileImage,
    education,
    addEducation,
    updateEducation,
    removeEducation,
    experience,
    addExperience,
    updateExperience,
    removeExperience,
    projects,
    addProject,
    updateProject,
    removeProject,
    resumeId,
    savedResume,
    loading,
    error,
    submitResume,
    fetchResume,
    API_URL,
  }

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}
