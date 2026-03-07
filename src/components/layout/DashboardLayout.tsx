import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Shield, Fingerprint, Building2, Settings, LogOut, Bell, Search, ChevronLeft, ChevronRight, Wifi } from 'lucide-react'
import { USER } from '../../data/mock'

const NAV = [
  { to: '/dashboard/overview',  icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/vault',     icon: Shield,          label: 'Credential Vault' },
  { to: '/dashboard/identity',  icon: Fingerprint,     label: 'DID Identity' },
  { to: '/dashboard/issuer',    icon: Building2,        label: 'Issuer Portal' },
]

const CRUMBS: Record<string, string> = {
  '/dashboard/overview': 'Overview',
  '/dashboard/vault':    'Credential Vault',
  '/dashboard/identity': 'DID Identity',
  '/dashboard/issuer':   'Issuer Portal',
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const crumb = CRUMBS[location.pathname] || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#050D1A' }}>

      {/* ── SIDEBAR ── */}
      <aside className="relative flex flex-col h-full flex-shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 64 : 260, background: '#080F1E', borderRight: '1px solid rgba(0,194,255,0.07)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-[52px] flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#00C2FF,#7B2FFF)' }}>
            <Shield size={15} color="#fff" />
          </div>
          {!collapsed && <span className="font-display font-bold text-lg text-white tracking-tight whitespace-nowrap">Sovereign</span>}
        </div>

        {/* Collapse btn */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[14px] w-6 h-6 rounded-full flex items-center justify-center z-20 transition-colors"
          style={{ background: '#0A1628', border: '1px solid rgba(0,194,255,0.2)', color: '#00C2FF' }}>
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-hidden">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `nav-item flex items-center rounded-lg transition-all duration-150 ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} ${isActive ? 'nav-active' : 'text-[#7A8FA6]'}`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={19} style={{ color: isActive ? '#00C2FF' : undefined, flexShrink: 0 }} />
                  {!collapsed && (
                    <span className="text-sm whitespace-nowrap" style={{ fontWeight: isActive ? 600 : 400, color: isActive ? '#F0F4FF' : undefined }}>
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-3 space-y-0.5 flex-shrink-0">
          <button className={`nav-item w-full flex rounded-lg py-2.5 text-[#7A8FA6] ${collapsed ? 'justify-center px-2' : 'items-center gap-3 px-3'}`}>
            <Settings size={18} />
            {!collapsed && <span className="text-sm">Settings</span>}
          </button>
          <button onClick={() => navigate('/')}
            className={`nav-item w-full flex rounded-lg py-2.5 text-[#7A8FA6] hover:text-[#FF4444] ${collapsed ? 'justify-center px-2' : 'items-center gap-3 px-3'}`}>
            <LogOut size={18} />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </button>

          {/* Identity card */}
          <div className="mt-2">
            {!collapsed ? (
              <div className="p-3 rounded-xl" style={{ background: 'rgba(0,194,255,0.04)', border: '1px solid rgba(0,194,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#00C2FF,#7B2FFF)', boxShadow: '0 0 10px rgba(0,194,255,0.35)' }}>
                    {USER.initials}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00FF88] border-2 border-[#080F1E]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#F0F4FF] truncate">{USER.name}</div>
                    <div className="text-[10px] text-[#00FF88]">● Active Identity</div>
                  </div>
                </div>
                <div className="font-mono-code text-[10px] text-[#00C2FF] opacity-60 truncate">{USER.did.slice(0,30)}...</div>
              </div>
            ) : (
              <div className="flex justify-center py-1">
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#00C2FF,#7B2FFF)' }}>
                  {USER.initials}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00FF88]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center px-5 gap-4"
          style={{ height: 52, background: 'rgba(5,13,26,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,194,255,0.06)' }}>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-[#7A8FA6]">Sovereign</span>
            <span className="text-[#7A8FA6] text-xs">/</span>
            <span className="text-[#F0F4FF] font-medium">{crumb}</span>
          </div>
          <div className="flex-1 max-w-sm mx-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,194,255,0.03)', border: '1px solid rgba(0,194,255,0.08)' }}>
              <Search size={13} className="text-[#7A8FA6] flex-shrink-0" />
              <input type="text" placeholder="Search credentials, DIDs..." className="bg-transparent border-none outline-none w-full text-[#7A8FA6] placeholder-[#4A5568]" style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }} />
              <span className="text-[9px] text-[#4A5568] border border-[rgba(255,255,255,0.08)] rounded px-1 flex-shrink-0">⌘K</span>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5">
              <Wifi size={11} className="text-[#00FF88]" />
              <span className="font-mono-code text-[10px] text-[#00FF88]">ONLINE</span>
            </div>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#7A8FA6] hover:text-[#F0F4FF] transition-colors">
              <Bell size={15} />
              <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF4444]" />
            </button>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#00C2FF,#7B2FFF)' }}>
              {USER.initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
