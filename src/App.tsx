import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ManualDeployment from './pages/ManualDeployment'
import AutonomousDeployment from './pages/AutonomousDeployment'
import Policy from './pages/Policy'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/deployment/manual" replace />} />
          <Route path="/deployment/manual" element={<ManualDeployment />} />
          <Route path="/deployment/autonomous" element={<AutonomousDeployment />} />
          <Route path="/policy" element={<Policy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
