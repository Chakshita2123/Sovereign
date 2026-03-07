import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Building2, CheckCircle, Clock, AlertTriangle, FileText, TrendingUp, Send } from 'lucide-react'
import { ISSUER_DATA } from '../data/mock'

const TEMPLATES = [
  { id: 't1', name: 'Degree Certificate', issued: 8241, active: true, color: '#00C2FF' },
  { id: 't2', name: 'Employment Record', issued: 2894, active: true, color: '#00FF88' },
  { id: 't3', name: 'Health Insurance', issued: 1201, active: true, color: '#7B2FFF' },
  { id: 't4', name: 'Age Verification', issued: 511, active: false, color: '#F5A623' },
]

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#00FF88', Pending: '#F5A623', Failed: '#FF4444'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#0F1E35', border: '1px solid rgba(0,194,255,0.2)' }}>
      <div className="text-[#7A8FA6] mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

export default function IssuerPortalPage() {
  const [activeTemplate, setActiveTemplate] = useState('t1')
  const [bulkText, setBulkText] = useState('')
  const [bulkStatus, setBulkStatus] = useState<'idle'|'running'|'done'>('idle')
  const [progress, setProgress] = useState(0)

  const runBulk = () => {
    if (!bulkText.trim()) return
    setBulkStatus('running'); setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setBulkStatus('done'); return 100 }
        return p + Math.random() * 12
      })
    }, 200)
  }

  const kpis = [
    { label: 'Total Issued',       value: ISSUER_DATA.totalIssued.toLocaleString(), icon: CheckCircle, color: '#00C2FF' },
    { label: 'Revoked Today',      value: ISSUER_DATA.revokedToday,                 icon: AlertTriangle, color: '#FF4444' },
    { label: 'Pending Delivery',   value: ISSUER_DATA.pendingDelivery,              icon: Clock, color: '#F5A623' },
    { label: 'Active Templates',   value: ISSUER_DATA.activeTemplates,              icon: FileText, color: '#7B2FFF' },
    { label: 'Credential Health',  value: `${ISSUER_DATA.health}%`,                 icon: TrendingUp, color: '#00FF88' },
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,194,255,0.1)', border: '1px solid rgba(0,194,255,0.2)' }}>
          <Building2 size={20} color="#00C2FF" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-[#F0F4FF]">Issuer Portal</h1>
          <p className="text-sm text-[#7A8FA6]">Issue and manage verifiable credentials at scale</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#7A8FA6]">{label}</span>
              <Icon size={14} style={{ color }} />
            </div>
            <div className="font-display font-bold text-2xl" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Area chart */}
        <div className="lg:col-span-3 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[#F0F4FF]">Issuance Activity — Last 30 Days</h2>
            <div className="flex gap-3 text-xs text-[#7A8FA6]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block bg-[#00C2FF]" />Issued</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block bg-[#FF4444]" />Revoked</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ISSUER_DATA.chart}>
              <defs>
                <linearGradient id="issued" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#00C2FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="revoked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#FF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#7A8FA6', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#7A8FA6', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="issued" stroke="#00C2FF" strokeWidth={2} fill="url(#issued)" name="Issued" />
              <Area type="monotone" dataKey="revoked" stroke="#FF4444" strokeWidth={2} fill="url(#revoked)" name="Revoked" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent issuances */}
        <div className="lg:col-span-2 glass-card p-5">
          <h2 className="font-display font-semibold text-[#F0F4FF] mb-4">Recent Issuances</h2>
          <div className="space-y-2">
            {ISSUER_DATA.recent.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex-1 min-w-0">
                  <div className="font-mono-code text-[11px] text-[#00C2FF] truncate">{item.did}</div>
                  <div className="text-xs text-[#7A8FA6] mt-0.5">{item.template}</div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                  <span className="text-[10px] font-semibold" style={{ color: STATUS_COLORS[item.status] || '#7A8FA6' }}>{item.status}</span>
                  <span className="text-[9px] text-[#7A8FA6]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates + Bulk Issue */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Templates */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-[#F0F4FF] mb-4">Credential Templates</h2>
          <div className="space-y-2">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setActiveTemplate(t.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{ background: activeTemplate === t.id ? 'rgba(0,194,255,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${activeTemplate === t.id ? 'rgba(0,194,255,0.25)' : 'rgba(255,255,255,0.05)'}`, borderLeft: `3px solid ${activeTemplate === t.id ? '#00C2FF' : 'transparent'}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
                  <FileText size={14} style={{ color: t.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#F0F4FF]">{t.name}</div>
                  <div className="text-xs text-[#7A8FA6]">{t.issued.toLocaleString()} issued</div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  <span className="text-[10px] font-bold" style={{ color: t.active ? '#00FF88' : '#7A8FA6' }}>
                    {t.active ? '● ACTIVE' : '○ DRAFT'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Issue */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-[#F0F4FF] mb-1">Bulk Issuance</h2>
          <p className="text-xs text-[#7A8FA6] mb-4">Paste recipient DIDs (one per line) to issue credentials in bulk</p>
          <textarea
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            placeholder={`did:indy:7fK3mPq...\ndid:indy:9aR1xNb...\ndid:indy:2jW5vYc...`}
            className="w-full h-28 p-3 rounded-xl text-xs font-mono-code text-[#00C2FF] placeholder-[#4A5568] bg-transparent border outline-none resize-none"
            style={{ background: 'rgba(0,194,255,0.03)', border: '1px solid rgba(0,194,255,0.12)', lineHeight: 1.7 }}
          />
          <div className="flex items-center justify-between mt-3 mb-2">
            <span className="text-xs text-[#7A8FA6]">
              {bulkText.trim() ? `${bulkText.trim().split('\n').filter(Boolean).length} recipients` : 'No recipients'}
            </span>
            <span className="text-xs text-[#7A8FA6]">Template: {TEMPLATES.find(t => t.id === activeTemplate)?.name}</span>
          </div>

          {bulkStatus !== 'idle' && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-[#7A8FA6] mb-1.5">
                <span>{bulkStatus === 'done' ? 'Complete!' : 'Issuing credentials...'}</span>
                <span>{Math.round(Math.min(progress, 100))}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,194,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%`, background: bulkStatus === 'done' ? '#00FF88' : 'linear-gradient(90deg,#00C2FF,#7B2FFF)', boxShadow: '0 0 8px rgba(0,194,255,0.5)' }} />
              </div>
              {bulkStatus === 'done' && (
                <div className="text-xs text-[#00FF88] mt-2 text-center">
                  ✓ {bulkText.trim().split('\n').filter(Boolean).length} credentials issued successfully
                </div>
              )}
            </div>
          )}

          <button
            onClick={bulkStatus === 'done' ? () => { setBulkStatus('idle'); setBulkText(''); setProgress(0) } : runBulk}
            disabled={bulkStatus === 'running'}
            className="btn-primary w-full py-2.5 text-sm"
            style={{ opacity: bulkStatus === 'running' ? 0.7 : 1 }}>
            <Send size={14} />
            {bulkStatus === 'running' ? 'Issuing...' : bulkStatus === 'done' ? 'Issue More' : 'Issue Credentials'}
          </button>
        </div>
      </div>
    </div>
  )
}
