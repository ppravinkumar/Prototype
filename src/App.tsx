import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ManualDeployment from './pages/ManualDeployment'
import ManualDeploymentCreate from './pages/ManualDeploymentCreate'
import AutonomousDeploymentList from './pages/AutonomousDeploymentList'
import AutonomousDeploymentCreate from './pages/AutonomousDeploymentCreate'
import AutonomousDeploymentStatus from './pages/AutonomousDeploymentStatus'
import Policy from './pages/Policy'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/deployment/manual" replace />} />
          <Route path="/deployment/manual" element={<ManualDeployment />} />
          <Route path="/deployment/manual/create" element={<ManualDeploymentCreate />} />
          <Route path="/deployment/autonomous" element={<AutonomousDeploymentList />} />
          <Route path="/deployment/autonomous/create" element={<AutonomousDeploymentCreate />} />
          <Route path="/deployment/autonomous/:id" element={<AutonomousDeploymentStatus />} />
          <Route path="/policy" element={<Policy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
