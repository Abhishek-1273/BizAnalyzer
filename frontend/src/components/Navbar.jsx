import { useNavigate } from 'react-router-dom'
import { useBusinessData } from '../context/BusinessContext'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { businessData, clearData } = useBusinessData()

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <div className="nav-brand-icon">
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12 L5 8 L8 10 L11 5 L14 7" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="nav-brand-name">BizAnalyzer</span>
        <span className="nav-brand-badge">AI</span>
      </div>

      <div className="nav-actions">
        {businessData && (
          <>
            <button className="nav-btn" onClick={() => navigate('/dashboard')}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
              Dashboard
            </button>
            <div className="nav-divider" />
            <button className="nav-btn danger" onClick={() => {
              if (confirm('Clear all data and start fresh?')) { clearData(); navigate('/') }
            }}>
              Clear data
            </button>
          </>
        )}
        <button className="nav-btn primary" onClick={() => navigate('/')}>
          New Analysis
        </button>
      </div>
    </nav>
  )
}
