import { Routes, Route, Navigate } from 'react-router-dom'
import PersonalDetails from './pages/PersonalDetails'
import Education from './pages/Education'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import ResumePreview from './pages/ResumePreview'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CV Builder</h1>
        <p>Create your professional resume in minutes</p>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/personal" replace />} />
        <Route path="/personal" element={<PersonalDetails />} />
        <Route path="/education" element={<Education />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/preview" element={<ResumePreview />} />
      </Routes>
    </div>
  )
}

export default App
