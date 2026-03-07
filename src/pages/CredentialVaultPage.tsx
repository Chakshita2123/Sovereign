import { useState } from 'react'
import { Search, Filter, Eye, EyeOff, Copy, Share2, ExternalLink, X } from 'lucide-react'
import { CREDENTIALS } from '../data/mock'
import type { Credential } from '../data/mock'
import ShareModal from '../components/modals/ShareModal'

function Badge({ status }: { status: string }) {
  const cfg: Record<string, any> = {
    verified: { bg: 'rgba(0,255,136,0.08)', border: '#00FF88', color: '#00FF88', label: 'VERIFIED', pulse: true },
    pending:  { bg: 'rgba(245,166,35,0.08)', border: '#F5A623', color: '#F5A623', label: 'PENDING' },
    revoked:  { bg: 'rgba(255,68,68,0.08)',  border: '#FF4444', color: '#FF4444', label: 'REVOKED' },
    expiring: { bg: 'rgba(245,166,35,0.1)',  border: '#F5A623', color: '#F5A623', label: 'EXPIRING' },
  }
  const c = cfg[status] || cfg.pending
  return (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold" style={{ letterSpacing: '0.08em', background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
      {c.pulse && <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.color, animation: 'pulse-ring 2s ease-in-out infinite' }} />}
      {c.label}
    </span>
  )
}

function CredDetail({ cred, onShare, onClose }: { cred: Credential; onShare: () => void; onClose: () => void }) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const toggle = (label: string) => setRevealed(p => { const n = new Set(p); n.has(label) ? n.delete(label) : n.add(label); return n })
  const copy = () => { navigator.clipboard.writeText(cred.did); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="flex flex-col h-full animate-slide-up">
      {/* Credential card visual */}
      <div className="flex-shrink-0 p-5">
        <div className="relative rounded-2xl overflow-hidden" style={{ height: 180, background: 'linear-gradient(135deg,#0A1628,#0F1E35)', border: `1px solid ${cred.color}30` }}>
          <div className="absolute inset-0 hex-pattern opacity-25" />
          <div className="absolute top-0 right-0 w-32 h-32 -translate-y-8 translate-x-8 rounded-full opacity-10"
            style={{ background: `radial-gradient(circle,${cred.color},transparent 70%)` }} />
          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                style={{ background: `${cred.color}18`, border: `1px solid ${cred.color}40`, color: cred.color }}>
                {cred.issuerInitials}
              </div>
              <div className="flex items-center gap-2">
                <Badge status={cred.status} />
                <button onClick={onClose} className="text-[#7A8FA6] hover:text-[#F0F4FF]"><X size={14} /></button>
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-lg text-white">{cred.title}</div>
              <div className="text-xs text-[#7A8FA6] truncate mt-0.5">{cred.issuer}</div>
              <div className="flex justify-between mt-2">
                <span className="font-mono-code text-[10px] text-[#7A8FA6]">Issued {cred.issuedDate}</span>
                <span className="text-xs" style={{ color: cred.color }}>◆ {cred.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
        {/* Fields */}
        <div>
          <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-widest mb-3">Credential Fields</h3>
          <div className="space-y-2">
            {cred.fields.map(f => {
              const isRev = revealed.has(f.label)
              return (
                <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ background: isRev ? 'rgba(0,194,255,0.04)' : f.zkp ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isRev ? 'rgba(0,194,255,0.15)' : 'rgba(255,255,255,0.04)'}`, borderLeft: isRev ? '2px solid #00C2FF' : '2px solid transparent' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[#7A8FA6] font-medium">{f.label}</div>
                    <div className="text-sm mt-0.5 font-mono-code" style={{ color: isRev || !f.zkp ? '#F0F4FF' : '#4A5568' }}>
                      {f.zkp && !isRev ? '•••••••••' : f.value}
                    </div>
                    {f.zkp && !isRev && <div className="text-[9px] text-[#7A8FA6] italic mt-0.5">Hidden via ZKP</div>}
                  </div>
                  {f.zkp && (
                    <button onClick={() => toggle(f.label)} className="text-[#7A8FA6] hover:text-[#00C2FF] transition-colors">
                      {isRev ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Metadata */}
        <div>
          <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-widest mb-3">Credential Metadata</h3>
          <div className="space-y-2 text-xs">
            {[
              ['Issuer DID', cred.did.slice(0,30) + '...'],
              ['Schema ID', cred.schemaId],
              ['Proof Type', cred.proofType],
              ['Issue Date', cred.issuedDate],
              ['Expiry Date', cred.expiryDate],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[#7A8FA6] flex-shrink-0">{k}</span>
                <span className="font-mono-code text-[#00C2FF] text-right truncate">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DID display */}
        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(0,194,255,0.04)', borderLeft: '3px solid #00C2FF', borderRadius: '0 8px 8px 0' }}>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-[#7A8FA6] mb-0.5">Holder DID</div>
            <div className="font-mono-code text-[11px] text-[#00C2FF] truncate">{cred.did}</div>
          </div>
          <button onClick={copy} className="text-[#7A8FA6] hover:text-[#00C2FF] transition-colors flex-shrink-0">
            {copied ? <span className="text-[#00FF88] text-xs">✓</span> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,194,255,0.08)' }}>
        <button onClick={onShare} className="btn-primary flex-1 py-2.5 text-sm">
          <Share2 size={14} /> Share Credential
        </button>
        <button className="btn-ghost px-4 py-2.5 text-sm">
          <ExternalLink size={14} /> Ledger
        </button>
      </div>
    </div>
  )
}

export default function CredentialVaultPage() {
  const [selected, setSelected] = useState<Credential | null>(CREDENTIALS[0])
  const [filter, setFilter] = useState<'all'|'verified'|'expiring'|'revoked'>('all')
  const [search, setSearch] = useState('')
  const [sharing, setSharing] = useState(false)

  const filtered = CREDENTIALS.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.issuer.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-full animate-fade-in" style={{ height: 'calc(100vh - 52px)' }}>
      {/* Left panel */}
      <div className="w-[320px] flex-shrink-0 flex flex-col" style={{ borderRight: '1px solid rgba(0,194,255,0.07)' }}>
        <div className="p-4 space-y-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,194,255,0.07)' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(0,194,255,0.04)', border: '1px solid rgba(0,194,255,0.1)' }}>
            <Search size={13} className="text-[#7A8FA6]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vault..." className="bg-transparent border-none outline-none text-sm text-[#F0F4FF] placeholder-[#4A5568] w-full" />
          </div>
          <div className="flex gap-1.5">
            {(['all','verified','expiring','revoked'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all"
                style={{ background: filter === f ? 'rgba(0,194,255,0.12)' : 'rgba(255,255,255,0.03)', color: filter === f ? '#00C2FF' : '#7A8FA6', border: `1px solid ${filter === f ? 'rgba(0,194,255,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#7A8FA6] text-sm">No credentials found</div>
          ) : filtered.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} className="w-full text-left rounded-xl px-3 py-3 transition-all"
              style={{ background: selected?.id === c.id ? 'rgba(0,194,255,0.06)' : 'transparent', border: `1px solid ${selected?.id === c.id ? 'rgba(0,194,255,0.25)' : 'rgba(0,194,255,0.06)'}`, borderLeft: `3px solid ${selected?.id === c.id ? '#00C2FF' : 'transparent'}` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: `${c.color}15`, border: `1px solid ${c.color}30`, color: c.color }}>
                  {c.issuerInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#F0F4FF] truncate">{c.title}</div>
                  <div className="text-[11px] text-[#7A8FA6] truncate">{c.issuer.split('—')[0].trim()}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge status={c.status} />
                  <span className="font-mono-code text-[9px] text-[#7A8FA6]">{c.issuedDate}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {selected ? (
          <CredDetail cred={selected} onShare={() => setSharing(true)} onClose={() => setSelected(null)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,194,255,0.06)', border: '1px solid rgba(0,194,255,0.12)' }}>
              <Shield size={28} style={{ color: 'rgba(0,194,255,0.4)' }} />
            </div>
            <div className="font-display font-semibold text-lg text-[#7A8FA6]">Select a credential</div>
            <div className="text-sm text-[#4A5568] mt-2">Choose from the vault to view details</div>
          </div>
        )}
      </div>

      {sharing && selected && <ShareModal credential={selected} onClose={() => setSharing(false)} />}
    </div>
  )
}
