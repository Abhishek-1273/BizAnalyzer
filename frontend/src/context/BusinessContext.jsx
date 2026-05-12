import { createContext, useContext, useState, useEffect } from 'react'

const BusinessContext = createContext(null)

export function BusinessProvider({ children }) {
  const [businessData, setBusinessData] = useState(() => {
    // On load, check sessionStorage first, then localStorage
    try {
      const session = sessionStorage.getItem('businessData')
      if (session) return JSON.parse(session)
      const local = localStorage.getItem('businessAnalysis')
      if (local) return JSON.parse(local)
    } catch {}
    return null
  })

  // Auto-save to both storages whenever data changes
  useEffect(() => {
    if (businessData) {
      try {
        sessionStorage.setItem('businessData', JSON.stringify(businessData))
        localStorage.setItem('businessAnalysis', JSON.stringify({
          ...businessData,
          savedAt: new Date().toISOString()
        }))
      } catch (e) {
        console.warn('Storage save failed:', e)
      }
    }
  }, [businessData])

  const clearData = () => {
    sessionStorage.removeItem('businessData')
    localStorage.removeItem('businessAnalysis')
    setBusinessData(null)
  }

  return (
    <BusinessContext.Provider value={{ businessData, setBusinessData, clearData }}>
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusinessData() {
  return useContext(BusinessContext)
}
