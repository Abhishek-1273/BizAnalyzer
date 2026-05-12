import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useBusinessData } from '../context/BusinessContext'
import { generatePdf } from '../api'
import './Dashboard.css'

function formatNumber(num) {
  if (!num && num !== 0) return 'N/A'
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr'
  if (num >= 100000)   return (num / 100000).toFixed(2) + ' L'
  return Number(num).toLocaleString('en-IN')
}

// ─── Overview ───────────────────────────────────────

function OverviewSection({ businessData }) {
  const kpis = businessData.kpis || {}

  const cards = [
    { label: 'Total Revenue', value: `₹${formatNumber(kpis.total_revenue)}`, accent: 'blue' },
    { label: 'Net Profit', value: `₹${formatNumber(kpis.net_profit)}`,
      badge: kpis.profit_margin ? `${Number(kpis.profit_margin).toFixed(1)}%` : null,
      badgeType: kpis.net_profit > 0 ? 'positive' : 'negative', accent: kpis.net_profit > 0 ? 'green' : 'red' },
    { label: 'Profit Margin', value: `${Number(kpis.profit_margin || 0).toFixed(1)}%`, accent: 'blue' },
    { label: 'Growth Rate', value: `${kpis.revenue_growth_rate || 'N/A'}%`, accent: 'green' },
    { label: 'Shark Tank Score', value: `${kpis.shark_tank_score || 0} / 100`, accent: 'amber' },
    { label: 'IPO Readiness', value: `${kpis.ipo_readiness || 0} / 100`, accent: 'blue' },
    { label: 'Risk Score', value: `${kpis.risk_score || 0} / 100`, accent: kpis.risk_score > 70 ? 'red' : 'amber' },
    { label: 'ROI', value: `${kpis.roi || 0}%`, accent: 'green' },
  ]

  const alerts = []
  if (kpis.net_profit < 0) alerts.push({ type: 'danger', msg: 'Business is running at a loss. Focus on cost reduction.' })
  if (kpis.risk_score > 70) alerts.push({ type: 'warning', msg: `High risk score (${kpis.risk_score}/100). Review your financial strategy.` })
  if (kpis.growth_trajectory === 'Strong Growth') alerts.push({ type: 'success', msg: 'Strong growth trajectory detected.' })

  return (
    <div className="section-content">
      <div className="overview-grid">
        {cards.map(c => (
          <div key={c.label} className="ov-card">
            <div className={`ov-indicator ${c.accent}`} />
            <div className="ov-label">{c.label}</div>
            <div className="ov-value">{c.value}</div>
            {c.badge && <div className={`ov-badge ${c.badgeType}`}>{c.badge}</div>}
          </div>
        ))}
      </div>
      {alerts.length > 0 && (
        <div className="alerts-area">
          {alerts.map((a, i) => (
            <div key={i} className={`alert alert-${a.type}`}>{a.msg}</div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── KPIs ───────────────────────────────────────────

function KPISection({ kpis }) {
  if (!kpis) return <div className="alert alert-warning">No KPI data available.</div>

  const categories = {
    'Basic Metrics': [
      ['Total Revenue', `₹${formatNumber(kpis.total_revenue)}`, 'Sum of all revenue'],
      ['Total Costs', `₹${formatNumber(kpis.total_cost)}`, 'Sum of all expenses'],
      ['Net Profit', `₹${formatNumber(kpis.net_profit)}`, 'Revenue minus costs'],
      ['Profit Margin', `${Number(kpis.profit_margin||0).toFixed(2)}%`, 'Profit as % of revenue'],
      ['Gross Profit', `₹${formatNumber(kpis.gross_profit)}`, 'Revenue minus COGS'],
    ],
    'Advanced Financials': [
      ['EBITDA', `₹${formatNumber(kpis.ebitda)}`, 'Earnings before interest & tax'],
      ['Operating Profit', `₹${formatNumber(kpis.operating_profit)}`, 'Profit from core operations'],
      ['Burn Rate', `₹${formatNumber(kpis.burn_rate)}/mo`, 'Monthly cash spend'],
      ['Runway (Months)', kpis.runway_months || 'N/A', 'Months before cash runs out'],
      ['Break-even Point', `₹${formatNumber(kpis.break_even_point)}`, 'Revenue to cover all costs'],
    ],
    'Growth & Performance': [
      ['Revenue Growth Rate', `${kpis.revenue_growth_rate || 0}%`, 'Month-over-month growth'],
      ['ROI', `${kpis.roi || 0}%`, 'Return on investment'],
      ['Customer LTV', `₹${formatNumber(kpis.customer_lifetime_value)}`, 'Avg revenue per customer'],
      ['Avg Order Value', `₹${formatNumber(kpis.average_order_value)}`, 'Mean transaction size'],
      ['Growth Trajectory', kpis.growth_trajectory || 'N/A', 'Overall business trend'],
    ],
    'Business Scores': [
      ['Shark Tank Score', `${kpis.shark_tank_score || 0} / 100`, 'Investment attractiveness'],
      ['IPO Readiness', `${kpis.ipo_readiness || 0} / 100`, 'Readiness for public offering'],
      ['Risk Score', `${kpis.risk_score || 0} / 100`, 'Overall business risk level'],
      ['Scalability Score', `${kpis.scalability_score || 0} / 100`, 'Potential for growth at scale'],
    ],
  }

  return (
    <div className="section-content">
      {Object.entries(categories).map(([cat, items]) => (
        <div key={cat} className="kpi-category">
          <div className="kpi-cat-title">{cat}</div>
          <div className="kpi-list">
            {items.map(([name, val, desc]) => (
              <div key={name} className="kpi-box">
                <div className="kpi-header">
                  <span className="kpi-name">{name}</span>
                  <span className="kpi-value">{val}</span>
                </div>
                <div className="kpi-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Charts ─────────────────────────────────────────

function ChartsSection({ charts }) {
  if (!charts || Object.keys(charts).length === 0)
    return <div className="alert alert-warning">Charts unavailable. Backend chart generation may have failed.</div>

  const items = [
    { key: 'revenue_trend', title: 'Revenue Trend', badge: 'Time Series' },
    { key: 'product_comparison', title: 'Product Revenue', badge: 'Comparison' },
    { key: 'forecast', title: 'Sales Forecast', badge: 'ML Model', wide: true },
    { key: 'expense_breakdown', title: 'Expense Breakdown', badge: 'Distribution' },
  ]

  const available = items.filter(({ key }) => charts[key])

  return (
    <div className="section-content">
      <div className="charts-grid">
        {available.map(({ key, title, badge, wide }) => (
          <div key={key} className={`chart-card${wide ? ' chart-wide' : ''}`}>
            <div className="chart-card-header">
              <div className="chart-title">{title}</div>
              <div className="chart-badge">{badge}</div>
            </div>
            <img
              src={`data:image/png;base64,${charts[key]}`}
              alt={title}
              className="chart-img"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Predictions ─────────────────────────────────────

function PredictionsSection({ predictions }) {
  if (!predictions?.future_predictions)
    return <div className="alert alert-warning">Predictions unavailable. ML model requires more data.</div>

  return (
    <div className="section-content">
      <div className="predictions-header">
        <div className="pred-meta-item">
          <span className="pred-meta-label">Model</span>
          <span className="pred-meta-value">{predictions.model_name}</span>
        </div>
        <div className="pred-divider" />
        <div className="pred-meta-item">
          <span className="pred-meta-label">Accuracy</span>
          <span className="pred-meta-value">{(predictions.model_accuracy * 100).toFixed(1)}%</span>
        </div>
        <div className="pred-divider" />
        <div className="pred-meta-item">
          <span className="pred-meta-label">Periods</span>
          <span className="pred-meta-value">{predictions.future_predictions.length}</span>
        </div>
      </div>
      <div className="predictions-grid">
        {predictions.future_predictions.map((val, i) => (
          <div key={i} className="pred-card">
            <div className="pred-period">Period {i + 1}</div>
            <div className="pred-value">₹{formatNumber(val)}</div>
            <div className="pred-label">Predicted Revenue</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Recommendations ─────────────────────────────────

function RecommendationsSection({ recommendations }) {
  if (!recommendations)
    return <div className="alert alert-warning">Recommendations unavailable.</div>

  let data = recommendations
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch {
      return <div className="rec-card"><pre className="rec-raw">{recommendations}</pre></div>
    }
  }

  return (
    <div className="section-content">
      {data.executive_summary && (
        <div className="rec-card" style={{ borderLeftColor: 'var(--accent)' }}>
          <div className="rec-title">Executive Summary</div>
          <div className="rec-row"><strong>Stage:</strong> {data.executive_summary.business_stage}</div>
          <div className="rec-row">{data.executive_summary.overview}</div>
          <div className="rec-row" style={{marginTop:8}}>
            <span className="ov-badge positive">Health: {data.executive_summary.confidence_score}/100</span>
          </div>
        </div>
      )}

      {data.summary && (
        <>
          <div className="rec-card">
            <div className="rec-title">Business Health</div>
            <div className="rec-row">{data.summary.business_health}</div>
          </div>
          {data.summary.key_strengths?.length > 0 && (
            <div className="rec-card" style={{ borderLeftColor: 'var(--emerald)' }}>
              <div className="rec-title">Key Strengths</div>
              {data.summary.key_strengths.map((s, i) => <div key={i} className="rec-row">— {s}</div>)}
            </div>
          )}
          {data.summary.key_weaknesses?.length > 0 && (
            <div className="rec-card" style={{ borderLeftColor: 'var(--rose)' }}>
              <div className="rec-title">Areas to Improve</div>
              {data.summary.key_weaknesses.map((w, i) => <div key={i} className="rec-row">— {w}</div>)}
            </div>
          )}
        </>
      )}

      {data.strategic_recommendations && (
        <div className="rec-card" style={{ borderLeftColor: 'var(--accent)' }}>
          <div className="rec-title">Strategic Recommendations</div>
          {data.strategic_recommendations.short_term?.length > 0 && (<>
            <div className="rec-subtitle">Short-term (3–6 months)</div>
            {data.strategic_recommendations.short_term.map((a, i) => <div key={i} className="rec-row">{i+1}. {a}</div>)}
          </>)}
          {data.strategic_recommendations.mid_term?.length > 0 && (<>
            <div className="rec-subtitle">Mid-term (6–12 months)</div>
            {data.strategic_recommendations.mid_term.map((a, i) => <div key={i} className="rec-row">{i+1}. {a}</div>)}
          </>)}
          {data.strategic_recommendations.long_term?.length > 0 && (<>
            <div className="rec-subtitle">Long-term (12+ months)</div>
            {data.strategic_recommendations.long_term.map((a, i) => <div key={i} className="rec-row">{i+1}. {a}</div>)}
          </>)}
        </div>
      )}

      {data.alerts_and_risks?.financial_alerts?.length > 0 && (
        <div className="alert alert-warning">
          <div>
            <strong>Financial Alerts</strong>
            {data.alerts_and_risks.financial_alerts.map((a, i) => <div key={i} style={{marginTop:4}}>· {a}</div>)}
          </div>
        </div>
      )}

      {data.conclusion && (
        <div className="rec-card" style={{ borderLeftColor: 'var(--emerald)' }}>
          <div className="rec-title">Final Diagnosis</div>
          <div className="rec-row">{data.conclusion.final_diagnosis}</div>
          {data.conclusion.priority_focus_areas?.length > 0 && (<>
            <div className="rec-subtitle">Priority Focus Areas</div>
            {data.conclusion.priority_focus_areas.map((a, i) => <div key={i} className="rec-row">· {a}</div>)}
          </>)}
        </div>
      )}
    </div>
  )
}

// ─── Main ────────────────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'kpis', label: 'KPIs' },
  { id: 'charts', label: 'Charts' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'recommendations', label: 'AI Insights' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { businessData } = useBusinessData()
  const [activeTab, setActiveTab] = useState('overview')
  const [pdfLoading, setPdfLoading] = useState(false)

  if (!businessData?.kpis) {
    return (
      <div className="dashboard-empty">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{marginBottom:20,opacity:0.3}}>
          <rect x="4" y="4" width="40" height="40" rx="8" stroke="white" strokeWidth="2"/>
          <path d="M16 30l8-10 8 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2>No Analysis Found</h2>
        <p>Please go back and upload your business data first.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Start New Analysis</button>
      </div>
    )
  }

  const handleDownloadPdf = async () => {
    setPdfLoading(true)
    try {
      const blob = await generatePdf(businessData.business_id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'business_report.pdf'; a.click()
      URL.revokeObjectURL(url)
    } catch (e) { alert('PDF generation failed: ' + e.message) }
    setPdfLoading(false)
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-business-info">
            <h1 className="dash-biz-name">{businessData.profile?.business_name || 'Business Dashboard'}</h1>
            <div className="dash-biz-meta">
              <span>{businessData.profile?.industry || 'Unknown Industry'}</span>
              <span className="meta-sep">·</span>
              <span>{businessData.profile?.business_type || 'N/A'}</span>
              <span className="meta-sep">·</span>
              <span className="dash-status">Analysis Complete</span>
            </div>
          </div>
          <div className="dash-header-actions">
            <button className="btn-secondary" onClick={handleDownloadPdf} disabled={pdfLoading}>
              {pdfLoading ? <><span className="spinner" /> Generating...</> : 'Download PDF'}
            </button>
          </div>
        </div>

        <div className="dash-tabs">
          {TABS.map(t => (
            <button key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-content">
        {activeTab === 'overview'        && <OverviewSection businessData={businessData} />}
        {activeTab === 'kpis'            && <KPISection kpis={businessData.kpis} />}
        {activeTab === 'charts'          && <ChartsSection charts={businessData.charts} />}
        {activeTab === 'predictions'     && <PredictionsSection predictions={businessData.predictions} />}
        {activeTab === 'recommendations' && <RecommendationsSection recommendations={businessData.recommendations} />}
      </div>
    </div>
  )
}
