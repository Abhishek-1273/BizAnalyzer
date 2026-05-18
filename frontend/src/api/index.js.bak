// All API calls to Flask backend
// Base URL — change this when deploying
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('File upload failed')
  return res.json()
}

export async function submitProfile(answers) {
  const res = await fetch(`${BASE}/submit-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  })
  if (!res.ok) throw new Error('Profile submission failed')
  return res.json()
}

export async function analyzeData(filename) {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename })
  })
  if (!res.ok) throw new Error('Analysis failed')
  return res.json()
}

export async function getRecommendations(kpis, profile) {
  const res = await fetch(`${BASE}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kpis, profile })
  })
  if (!res.ok) throw new Error('Recommendations failed')
  return res.json()
}

export async function getCharts(filename) {
  const res = await fetch(`${BASE}/charts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      chart_types: ['revenue_trend', 'product_comparison', 'expense_breakdown', 'forecast']
    })
  })
  if (!res.ok) throw new Error('Charts failed')
  return res.json()
}

export async function getPredictions(filename) {
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename })
  })
  if (!res.ok) throw new Error('Predictions failed')
  return res.json()
}

export async function generatePdf(businessId) {
  const res = await fetch(`${BASE}/generate-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business_id: businessId })
  })
  if (!res.ok) throw new Error('PDF generation failed')
  return res.blob()
}
