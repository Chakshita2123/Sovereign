import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './components/layout/DashboardLayout'
import OverviewPage from './pages/OverviewPage'
import CredentialVaultPage from './pages/CredentialVaultPage'
import DIDIdentityPage from './pages/DIDIdentityPage'
import IssuerPortalPage from './pages/IssuerPortalPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="overview"  element={<OverviewPage />} />
        <Route path="vault"     element={<CredentialVaultPage />} />
        <Route path="identity"  element={<DIDIdentityPage />} />
        <Route path="issuer"    element={<IssuerPortalPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
