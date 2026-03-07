import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, CheckCircle, Clock, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react'
import { CREDENTIALS, ACTIVITIES, PROOF_REQS, USER } from '../data/mock'
import ShareModal from '../components/modals/ShareModal'
import type { Credential } from '../data/mock'

// Status badge
function Badge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; border: string; color: string; label: string; pulse?: boolean }> = {
    verified: { bg: 'rgba(0,255,136,0.08)', border: '#00FF88', color: '#00FF88', label: 'VERIFIED', pulse: true },
    pending:  { bg: 'rgba(245,166,35,0.08)', border: '#F5A623', color: '#F5A623', label: 'PENDING' },
    revoked:  { bg: 'rgba(255,68,68,0.08)',  border: '#FF4444', color: '#FF4444', label: 'REVOKED' },
    expiring: { bg: 'rgba(245,166,35,0.1)',  border: '#F5A623', color: '#F5A623', label: 'EXPIRING' },
  }
  const c = cfg[status] || cfg.pending
  return (
    <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold" style={{ letterSpacing: '0.08em', background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
      {c.pulse && <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.color, animation: 'pulse-ring 2s ease-in-out infinite' }} />}
      {c.label}
    </span>
  )
}

// Security score ring
function ScoreRing({ score }: { score: number }) {
  const r = 32, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#00FF88' : score >= 60 ? '#00C2FF' : '#F5A623'
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width={80} height={80} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(0,194,255,0.1)" strokeWidth={6} />
        <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
      </svg>
      <div className="text-center">
        <div className="font-display font-bold text-xl" style={{ color }}>{score}</div>
        <div className="text-[8px] text-[#7A8FA6]">/ 100</div>
      </div>
    </div>
  )
}

// Proof request timer
function ProofCard({ req, onApprove, onDeny }: { req: typeof PROOF_REQS[0]; onApprove: () => void; onDeny: () => void }) {
  const [secs, setSecs] = useState(req.expiresIn)
  useEffect(() => { const t = setInterval(() => setSecs(p => Math.max(0, p - 1)), 1000); return () => clearInterval(t) }, [])
  const m = Math.floor(secs / 60), s = secs % 60, urgent = secs < 120
  return (
    <div className="rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
      style={{ background: '#0A1628', border: '1px solid rgba(245,166,35,0.25)', borderLeft: '4px solid #F5A623' }}>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: req.verifierColor }}>{req.verifierInitials}</div>
        <div>
          <div className="text-sm font-semibold text-[#F0F4FF]">{req.verifier}</div>
          <div className="text-xs text-[#7A8FA6]">{req.purpose}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1.5 mt-1">
          {req.fields.map(f => <span key={f} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,194,255,0.08)', border: '1px solid rgba(0,194,255,0.2)', color: '#00C2FF' }}>{f}</span>)}
          {req.zkpFields.map(f => <span key={f} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.25)', color: '#00FF88' }}>🔒 {f}</span>)}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="font-mono-code text-base font-bold" style={{ color: urgent ? '#FF4444' : '#F5A623' }}>
          {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
        </div>
        <button onClick={onApprove} className="btn-primary px-3 py-1.5 text-xs">Approve</button>
        <button onClick={onDeny} className="btn-ghost px-3 py-1.5 text-xs" style={{ borderColor: 'rgba(255,68,68,0.25)', color: '#FF4444' }}>Deny</button>
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const navigate = useNavigate()
  const [shareTarget, setShareTarget] = useState<Credential | null>(null)
  const [dismissed, setDismissed] = useState<string[]>([])
  const pending = PROOF_REQS.filter(r => !dismissed.includes(r.id))

  const kpis = [
    { label: 'Total Credentials', value: CREDENTIALS.length, icon: Shield, color: '#00C2FF', trend: '+1 this week' },
    { label: 'Verified Today', value: 3, icon: CheckCircle, color: '#00FF88', trend: '↑ Active' },
    { label: 'Expiring Soon', value: 1, icon: AlertTriangle, color: '#F5A623', trend: '14 days left' },
    { label: 'Pending Requests', value: pending.length, icon: Clock, color: '#7B2FFF', trend: 'Action needed' },
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#F0F4FF]">Good morning, {USER.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-[#7A8FA6] mt-1">Here's your identity overview</p>
        </div>
        <ScoreRing score={USER.securityScore} />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#7A8FA6]">{label}</span>
              <Icon size={16} style={{ color }} />
            </div>
            <div className="font-display font-bold text-3xl text-[#F0F4FF] mb-1">{value}</div>
            <div className="text-xs font-semibold" style={{ color }}>{trend}</div>
          </div>
        ))}
      </div>

      {/* Proof requests */}
      {pending.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-[#F0F4FF]">Pending Verification Requests</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}>{pending.length} pending</span>
          </div>
          <div className="space-y-3">
            {pending.map(req => (
              <ProofCard key={req.id} req={req}
                onApprove={() => setDismissed(p => [...p, req.id])}
                onDeny={() => setDismissed(p => [...p, req.id])} />
            ))}
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Credential preview */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[#F0F4FF]">Recent Credentials</h2>
            <button onClick={() => navigate('/dashboard/vault')} className="text-xs text-[#00C2FF] hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {CREDENTIALS.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                style={{ border: '1px solid rgba(0,194,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,194,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => navigate('/dashboard/vault')}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: `${c.color}15`, border: `1px solid ${c.color}30`, color: c.color }}>
                  {c.issuerInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#F0F4FF] truncate">{c.title}</div>
                  <div className="text-xs text-[#7A8FA6] truncate">{c.issuer.split('—')[0].trim()}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge status={c.status} />
                  <button onClick={e => { e.stopPropagation(); setShareTarget(c) }} className="text-[10px] text-[#00C2FF] hover:underline">Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-[#F0F4FF] mb-4">Activity</h2>
          <div className="space-y-0">
            {ACTIVITIES.map((act, i) => {
              const dotColors: Record<string, string> = { received: '#00FF88', shared: '#00C2FF', expiring: '#F5A623', revoked: '#FF4444', rotated: '#7B2FFF' }
              const dc = dotColors[act.type]
              return (
                <div key={act.id} className="flex gap-3 py-2 hover:bg-[rgba(255,255,255,0.015)] rounded-lg px-1 transition-colors -mx-1">
                  <div className="flex flex-col items-center flex-shrink-0 pt-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: dc, boxShadow: act.type === 'received' ? `0 0 6px ${dc}` : 'none' }} />
                    {i < ACTIVITIES.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.05)', minHeight: 16 }} />}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="text-xs font-medium text-[#F0F4FF] leading-tight">{act.title}</div>
                    <div className="text-[10px] text-[#7A8FA6] mt-0.5 truncate">{act.subtitle}</div>
                  </div>
                  <div className="font-mono-code text-[9px] text-[#7A8FA6] flex-shrink-0 mt-0.5">{act.timestamp}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {shareTarget && <ShareModal credential={shareTarget} onClose={() => setShareTarget(null)} />}
    </div>
  )
}
