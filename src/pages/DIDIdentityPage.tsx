import { useState } from 'react'
import { Copy, RotateCcw, Shield, Key, Clock, CheckCircle } from 'lucide-react'
import { USER } from '../data/mock'

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000) }}
      className="text-[#7A8FA6] hover:text-[#00C2FF] transition-colors flex-shrink-0">
      {done ? <span className="text-[#00FF88] text-xs">✓</span> : <Copy size={13} />}
    </button>
  )
}

const DID_DOC = {
  "@context": ["https://www.w3.org/ns/did/v1","https://w3id.org/security/suites/ed25519-2020/v1"],
  "id": "did:indy:Sobr7MFsF5YxNrHzxXpB1aKx9Qerty",
  "verificationMethod": [{
    "id": "did:indy:Sobr7M...#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:indy:Sobr7M...",
    "publicKeyMultibase": "z6MkkWH...xPq9a"
  }],
  "authentication": ["did:indy:Sobr7M...#key-1"],
  "keyAgreement": ["did:indy:Sobr7M...#key-2"]
}

export default function DIDIdentityPage() {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const shortDID = USER.did.slice(0, 32) + '...'

  const copyDID = () => { navigator.clipboard.writeText(USER.did); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="p-6 max-w-5xl space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg,#00C2FF,#7B2FFF)' }} />
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#00C2FF,#7B2FFF)', boxShadow: '0 0 30px rgba(0,194,255,0.35)' }}>
              {USER.initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#050D1A', border: '2px solid #00FF88' }}>
              <CheckCircle size={12} color="#00FF88" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display font-bold text-2xl text-[#F0F4FF]">{USER.name}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid #00FF88', color: '#00FF88', letterSpacing: '0.08em' }}>● VERIFIED IDENTITY</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="font-mono-code text-sm text-[#00C2FF] truncate">{expanded ? USER.did : shortDID}</div>
              <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-[#7A8FA6] hover:text-[#00C2FF] transition-colors flex-shrink-0">{expanded ? 'less' : 'more'}</button>
              <CopyBtn text={USER.did} />
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[#7A8FA6]">
              <span>Key Type: <strong className="text-[#F0F4FF]">{USER.keyType}</strong></span>
              <span>Created: <strong className="text-[#F0F4FF]">{USER.keyCreated}</strong></span>
              <span>Last Rotated: <strong className="text-[#F0F4FF]">{USER.lastRotated}</strong></span>
            </div>
          </div>
          <button className="btn-ghost px-4 py-2 text-sm flex-shrink-0">
            <RotateCcw size={14} /> Rotate Keys
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* DID Document viewer */}
        <div className="md:col-span-2 glass-card overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,194,255,0.08)' }}>
            <h2 className="font-display font-semibold text-[#F0F4FF] text-sm">DID Document</h2>
            <CopyBtn text={JSON.stringify(DID_DOC, null, 2)} />
          </div>
          <div className="p-5 overflow-x-auto" style={{ background: 'rgba(5,10,20,0.5)' }}>
            <pre className="font-mono-code text-[11px] leading-relaxed">
              {JSON.stringify(DID_DOC, null, 2).split('\n').map((line, i) => {
                const isKey = line.includes('": "') || line.includes('":')
                const keyMatch = line.match(/^(\s*)"([^"]+)":/)
                const valMatch = line.match(/:\s*"([^"]+)"/)
                if (keyMatch) {
                  return (
                    <div key={i}>
                      <span style={{ color: '#7A8FA6' }}>{line.slice(0, keyMatch.index! + keyMatch[0].indexOf('"'))}</span>
                      <span style={{ color: '#7B8CEA' }}>"{keyMatch[2]}"</span>
                      <span style={{ color: '#7A8FA6' }}>:</span>
                      {valMatch && <span style={{ color: '#00FF88' }}> "{valMatch[1]}"</span>}
                      {!valMatch && <span style={{ color: '#F0F4FF' }}>{line.slice(keyMatch.index! + keyMatch[0].length)}</span>}
                    </div>
                  )
                }
                return <div key={i} style={{ color: '#7A8FA6' }}>{line}</div>
              })}
            </pre>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* Verification methods */}
          <div className="glass-card p-4">
            <h2 className="font-display font-semibold text-[#F0F4FF] text-sm mb-3">Verification Methods</h2>
            <div className="space-y-2">
              {['Ed25519 — Authentication Key', 'X25519 — Key Agreement'].map((method, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(0,194,255,0.04)', border: '1px solid rgba(0,194,255,0.1)' }}>
                  <Key size={12} color="#00C2FF" className="flex-shrink-0" />
                  <div className="text-xs text-[#F0F4FF] flex-1">{method}</div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,255,136,0.08)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.2)' }}>Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key rotation history */}
          <div className="glass-card p-4">
            <h2 className="font-display font-semibold text-[#F0F4FF] text-sm mb-3">Key History</h2>
            <div className="space-y-3">
              {[
                { date: '2024-08-01', label: 'Current Keys', color: '#00FF88' },
                { date: '2023-11-15', label: 'Previous Keys', color: '#7A8FA6' },
                { date: '2023-01-15', label: 'Initial Keys', color: '#7A8FA6' },
              ].map(({ date, label, color }) => (
                <div key={date} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-[#F0F4FF]">{label}</div>
                    <div className="font-mono-code text-[9px] text-[#7A8FA6]">{date}</div>
                  </div>
                  <Clock size={10} color="#7A8FA6" />
                </div>
              ))}
            </div>
          </div>

          {/* Security stats */}
          <div className="glass-card p-4">
            <h2 className="font-display font-semibold text-[#F0F4FF] text-sm mb-3">Security</h2>
            <div className="space-y-2">
              {[
                { label: 'Secure Enclave', val: 'Bound', ok: true },
                { label: 'Biometric Lock', val: 'Enabled', ok: true },
                { label: 'Backup Status', val: 'Secured', ok: true },
                { label: 'ZKP Engine', val: 'Active', ok: true },
              ].map(({ label, val, ok }) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-[#7A8FA6]">{label}</span>
                  <span style={{ color: ok ? '#00FF88' : '#FF4444' }}>✓ {val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
