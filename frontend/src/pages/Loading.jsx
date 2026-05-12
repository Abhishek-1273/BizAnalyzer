import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBusinessData } from '../context/BusinessContext'
import { getRecommendations, getCharts, getPredictions } from '../api'
import './Loading.css'

const STEPS = [
  { label: 'Processing data file' },
  { label: 'Calculating KPIs' },
  { label: 'Generating ML predictions' },
  { label: 'Getting AI recommendations' },
]

const FACTS = [
  'Companies using data analytics are 5× more likely to make faster decisions.',
  'Businesses that track KPIs are 3× more likely to achieve their goals.',
  '80% of business failures are due to poor cash flow management.',
  'AI can process months of business data in just seconds.',
  'Indian startups raised over $25 billion in funding in 2023.',
]

export default function Loading() {
  const navigate = useNavigate()
  const { businessData, setBusinessData } = useBusinessData()
  const [completedSteps, setCompletedSteps] = useState([])
  const [progress, setProgress] = useState(0)
  const [fact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)])

  useEffect(() => {
    if (!businessData?.kpis) { navigate('/'); return }

    const run = async () => {
      const updated = { ...businessData }
      setCompletedSteps([0, 1])
      setProgress(40)

      try {
        const pred = await getPredictions(businessData.filename)
        updated.predictions = pred
      } catch (e) { console.warn('Predictions:', e) }
      setCompletedSteps([0, 1, 2])
      setProgress(70)

      try {
        const rec = await getRecommendations(businessData.kpis, businessData.profile)
        updated.recommendations = rec.recommendations
      } catch (e) { console.warn('Recommendations:', e) }

      try {
        const ch = await getCharts(businessData.filename)
        updated.charts = ch.charts
      } catch (e) { console.warn('Charts:', e) }

      setCompletedSteps([0, 1, 2, 3])
      setProgress(100)
      setBusinessData(updated)
      setTimeout(() => navigate('/dashboard'), 800)
    }

    setTimeout(run, 1000)
  }, [])

  return (
    <div className="loading-page">
      <div className="loading-bg" />
      <div className="loading-blob" />

      <div className="loading-container">
        <div className="loading-wordmark">
          <div className="loading-wordmark-icon">
            <svg viewBox="0 0 16 16">
              <path d="M2 12 L5 8 L8 10 L11 5 L14 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="loading-wordmark-text">BizAnalyzer AI</span>
        </div>

        <h1 className="loading-title">Analyzing your business</h1>
        <p className="loading-subtitle">Our models are processing your data...</p>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-label">{progress}%</div>

        <div className="steps-list">
          {STEPS.map((s, i) => {
            const done = completedSteps.includes(i)
            const active = i === completedSteps.length && !done
            return (
              <div key={i}
                className={`step-item ${done ? 'done' : active ? 'active' : ''}`}
                style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="step-dot" />
                <span className="step-label">{s.label}</span>
                <span className="step-status">{done ? 'done' : active ? 'running' : 'queued'}</span>
              </div>
            )
          })}
        </div>

        <div className="fact-box">
          <div className="fact-label">Did you know</div>
          <div className="fact-text">{fact}</div>
        </div>
      </div>
    </div>
  )
}
