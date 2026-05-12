import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BusinessProvider } from './context/BusinessContext'
import Home from './pages/Home'
import Loading from './pages/Loading'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BusinessProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </BusinessProvider>
  )
}
