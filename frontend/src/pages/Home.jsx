import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useBusinessData } from '../context/BusinessContext'
import { uploadFile, submitProfile, analyzeData } from '../api'
import './Home.css'

const CONCERNS = [
  'Cash Flow Management', 'Customer Acquisition', 'Market Competition',
  'Operational Efficiency', 'Talent Retention', 'Technology Adoption',
  'Regulatory Compliance', 'Scaling Challenges'
]

const FEATURES = [
  {
    title: 'KPI Analysis',
    desc: '20+ metrics calculated automatically from your data',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12 L4 8 L7 10 L10 5 L15 7"/>
      </svg>
    )
  },
  {
    title: 'AI Insights',
    desc: 'Groq-powered recommendations for your industry',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/>
      </svg>
    )
  },
  {
    title: 'ML Predictions',
    desc: 'Forecast future revenue with scikit-learn models',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 14 L6 8 L10 11 L14 4"/><circle cx="14" cy="4" r="1.5"/>
      </svg>
    )
  },
  {
    title: 'Visual Reports',
    desc: 'Charts, dashboards and downloadable PDF reports',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="12" height="12" rx="2"/>
        <path d="M5 10 V8 M8 10 V6 M11 10 V7"/>
      </svg>
    )
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { businessData, setBusinessData } = useBusinessData()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    business_name: '', industry: '', business_type: '',
    primary_goal: '', seeking_funding: '', product_count: '',
    monthly_revenue: '', concerns: []
  })
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const toggleConcern = (c) => setForm(f => ({
    ...f,
    concerns: f.concerns.includes(c) ? f.concerns.filter(x => x !== c) : [...f.concerns, c]
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select a CSV file.'); return }
    setError(''); setLoading(true)
    try {
      setStatus('Uploading your data file...')
      const uploadData = await uploadFile(file)
      setStatus('Creating your business profile...')
      const profileData = await submitProfile(form)
      setStatus('Running KPI analysis...')
      const analyzeData2 = await analyzeData(uploadData.filename)
      const initial = {
        business_id: profileData.business_id,
        profile: profileData.profile,
        kpis: analyzeData2.kpis,
        filename: uploadData.filename,
      }
      setBusinessData(initial)
      setStatus('Analysis complete — redirecting...')
      setTimeout(() => navigate('/loading'), 500)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      setStatus('')
    }
  }

  return (
    <div className="home-page">
      <Navbar />

      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-accent-blob" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            AI-Powered Business Intelligence
          </div>
          <h1 className="hero-title">
            Analyze your business<br />
            with <em>AI precision</em>
          </h1>
          <p className="hero-subtitle">
            Upload your CSV data and get instant KPI analysis, AI-powered recommendations,
            and ML revenue forecasts tailored for your business.
          </p>
          <div className="hero-features">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon-wrap">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {businessData && (
        <div className="form-section" style={{ paddingBottom: 0, marginBottom: 24 }}>
          <div className="prev-banner">
            <span>You have a saved analysis ready to view</span>
            <div className="prev-banner-actions">
              <button className="btn-primary" style={{padding:'7px 16px', fontSize:'0.85rem'}}
                onClick={() => navigate('/dashboard')}>View Dashboard</button>
              <button className="btn-secondary" style={{padding:'7px 16px', fontSize:'0.85rem'}}
                onClick={() => { if(confirm('Start fresh?')) { setBusinessData(null); window.location.reload() }}}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="form-section">
        <div className="section-label">Get started</div>
        <h2 className="section-heading">Start your analysis</h2>
        <p className="section-sub">Fill in your business details and upload your sales CSV</p>

        <form className="form-card" onSubmit={handleSubmit}>

          <div className="form-group-section">
            <div className="group-header">
              <div className="group-icon">
                <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="12" height="12" rx="2"/>
                  <path d="M5 8h6 M5 11h4"/>
                </svg>
              </div>
              <span className="group-title">Business Information</span>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Business Name <span className="req">*</span></label>
                <input name="business_name" value={form.business_name} onChange={handleChange}
                  placeholder="e.g. Sharma Enterprises" required />
              </div>
              <div className="form-group">
                <label>Industry <span className="req">*</span></label>
                <select name="industry" value={form.industry} onChange={handleChange} required>
                  <option value="">Select industry</option>
                  <option>Retail / E-commerce</option>
                  <option>Food & Beverage</option>
                  <option>Technology / SaaS</option>
                  <option>Manufacturing</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Real Estate</option>
                  <option>Finance / Fintech</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Business Stage <span className="req">*</span></label>
                <select name="business_type" value={form.business_type} onChange={handleChange} required>
                  <option value="">Select stage</option>
                  <option>Startup (0–2 years)</option>
                  <option>Growing SME (2–5 years)</option>
                  <option>Established (5+ years)</option>
                  <option>Enterprise</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Revenue</label>
                <select name="monthly_revenue" value={form.monthly_revenue} onChange={handleChange}>
                  <option value="">Select range</option>
                  <option>Under ₹1 Lakh</option>
                  <option>₹1L – ₹5L</option>
                  <option>₹5L – ₹20L</option>
                  <option>₹20L – ₹1Cr</option>
                  <option>Above ₹1Cr</option>
                </select>
              </div>
              <div className="form-group">
                <label>Primary Goal</label>
                <select name="primary_goal" value={form.primary_goal} onChange={handleChange}>
                  <option value="">Select goal</option>
                  <option>Increase Revenue</option>
                  <option>Reduce Costs</option>
                  <option>Expand to New Markets</option>
                  <option>Improve Profitability</option>
                  <option>Prepare for Funding</option>
                  <option>IPO Readiness</option>
                </select>
              </div>
              <div className="form-group">
                <label>Seeking Funding?</label>
                <select name="seeking_funding" value={form.seeking_funding} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Yes — Angel Funding</option>
                  <option>Yes — VC Funding</option>
                  <option>Yes — Bank Loan</option>
                  <option>No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Products / Services</label>
                <input type="number" name="product_count" value={form.product_count}
                  onChange={handleChange} placeholder="e.g. 5" min="1" />
              </div>
            </div>
          </div>

          <div className="form-group-section">
            <div className="group-header">
              <div className="group-icon">
                <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v4l2 2"/><circle cx="8" cy="8" r="6"/>
                </svg>
              </div>
              <span className="group-title">Key Business Concerns</span>
            </div>
            <div className="concerns-grid">
              {CONCERNS.map(c => (
                <label key={c} className={`concern-chip ${form.concerns.includes(c) ? 'selected' : ''}`}>
                  <input type="checkbox" hidden checked={form.concerns.includes(c)} onChange={() => toggleConcern(c)} />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group-section">
            <div className="group-header">
              <div className="group-icon">
                <svg viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12V6l5-4 5 4v6"/><rect x="6" y="9" width="4" height="3" rx="0.5"/>
                </svg>
              </div>
              <span className="group-title">Upload Business Data</span>
            </div>
            <div className={`file-zone ${file ? 'has-file' : ''}`}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) setFile(f) }}>
              <input type="file" ref={fileRef} accept=".csv" hidden onChange={(e) => setFile(e.target.files[0])} />
              <div className="file-zone-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                  {file
                    ? <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    : <><path d="M12 15V3m0 0L8 7m4-4l4 4"/><path d="M2 17l.621 2.485A2 2 0 004.561 21h14.879a2 2 0 001.939-1.515L22 17"/></>
                  }
                </svg>
              </div>
              <div className="file-zone-text">
                {file ? file.name : 'Click to upload or drag & drop'}
              </div>
              <div className="file-zone-hint">
                {file ? `${(file.size / 1024).toFixed(1)} KB · CSV file` : 'CSV with Revenue, Cost, Product columns'}
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger" style={{marginBottom:16}}>{error}</div>}
          {status && (
            <div className="alert alert-info" style={{marginBottom:16}}>
              <span className="spinner" /> {status}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}
              style={{width:'100%', padding:'13px', justifyContent:'center', fontSize:'0.95rem'}}>
              {loading ? <><span className="spinner" /> Processing...</> : 'Analyze My Business'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
