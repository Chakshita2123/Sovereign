import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, QrCode, Nfc, Link, CheckCircle, Share2 } from 'lucide-react'
import type { Credential } from '../../data/mock'

interface Props { credential: Credential; onClose: () => void }
type Step = 1 | 2 | 3

export default function ShareModal({ credential, onClose }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [method, setMethod] = useState<'qr'|'nfc'|'link'>('qr')
  const [sharing, setSharing] = useState(false)
  const [countdown, setCountdown] = useState(900)

  const toggle = (label: string) => setRevealed(p => { const n = new Set(p); n.has(label) ? n.delete(label) : n.add(label); return n })

  const doShare = () => {
    setSharing(true)
    setTimeout(() => { setSharing(false); setStep(3) }, 1600)
  }

  useEffect(() => {
    if (step === 2) {
      const t = setInterval(() => setCountdown(p => Math.max(0, p - 1)), 1000)
      return () => clearInterval(t)
    }
  }, [step])

  const mins = Math.floor(countdown / 60), secs = countdown % 60
  const disclosedCount = credential.fields.filter(f => !f.zkp || revealed.has(f.label)).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,13,26,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div className="w-full max-w-xl rounded-2xl overflow-hidden animate-slide-up"
        style={{ background: '#0A1628', border: '1px solid rgba(0,194,255,0.2)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,194,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <Share2 size={16} color="#00C2FF" />
            <div>
              <h2 className="font-display font-bold text-base text-[#F0F4FF]">Share Credential</h2>
              <p className="text-xs text-[#7A8FA6]">{credential.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7A8FA6] hover:text-[#F0F4FF] hover:bg-white/5 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,194,255,0.06)' }}>
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                style={{ background: step === s ? 'linear-gradient(135deg,#00C2FF,#7B2FFF)' : step > s ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)', color: step === s ? '#fff' : step > s ? '#00FF88' : '#7A8FA6' }}>
                {step > s ? '✓' : s}
              </div>
              <span className="text-xs" style={{ color: step === s ? '#F0F4FF' : '#7A8FA6' }}>
                {['Select Fields','Share Method','Done'][s-1]}
              </span>
              {s < 3 && <div className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />}
            </div>
          ))}
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Step 1 */}
          {step === 1 && (
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <p className="text-xs text-[#7A8FA6] mb-3">Toggle fields you want to <span className="text-[#00C2FF]">disclose</span>. ZKP fields stay hidden by default.</p>
                {credential.fields.map(f => {
                  const isRev = revealed.has(f.label)
                  return (
                    <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                      style={{ background: isRev ? 'rgba(0,194,255,0.05)' : f.zkp ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isRev ? 'rgba(0,194,255,0.18)' : 'rgba(255,255,255,0.04)'}`, borderLeft: `2px solid ${isRev ? '#00C2FF' : 'transparent'}` }}>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-[#7A8FA6]">{f.label}</div>
                        <div className="text-xs font-mono-code mt-0.5" style={{ color: isRev || !f.zkp ? '#F0F4FF' : '#4A5568' }}>
                          {f.zkp && !isRev ? '•••••••••' : f.value}
                        </div>
                        {f.zkp && !isRev && <div className="text-[9px] text-[#7A8FA6] italic">Hidden via ZKP</div>}
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

              {/* Preview panel */}
              <div className="w-36 flex-shrink-0">
                <div className="rounded-xl p-3 h-full" style={{ background: '#0F1E35', border: '1px solid rgba(0,194,255,0.1)' }}>
                  <div className="text-[9px] text-[#7A8FA6] mb-2 uppercase tracking-widest">Verifier sees</div>
                  <div className="space-y-1.5">
                    {credential.fields.filter(f => !f.zkp || revealed.has(f.label)).map(f => (
                      <div key={f.label}>
                        <div className="text-[9px] text-[#7A8FA6]">{f.label}</div>
                        <div className="font-mono-code text-[9px] text-[#00C2FF] truncate">{f.value.slice(0,14)}</div>
                      </div>
                    ))}
                    {credential.fields.filter(f => f.zkp && !revealed.has(f.label)).length > 0 && (
                      <div className="text-[9px] text-[#00FF88] mt-1">
                        +{credential.fields.filter(f => f.zkp && !revealed.has(f.label)).length} ZKP proven
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'qr' as const, icon: QrCode, label: 'QR Code', sub: 'Scan to verify' },
                  { id: 'nfc' as const, icon: Nfc, label: 'NFC Tap', sub: 'Hold near device' },
                  { id: 'link' as const, icon: Link, label: 'Deep Link', sub: 'Copy & share' },
                ].map(({ id, icon: Icon, label, sub }) => (
                  <button key={id} onClick={() => setMethod(id)}
                    className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all"
                    style={{ background: method === id ? 'rgba(0,194,255,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${method === id ? 'rgba(0,194,255,0.4)' : 'rgba(255,255,255,0.06)'}` }}>
                    <Icon size={26} style={{ color: method === id ? '#00C2FF' : '#7A8FA6' }} />
                    <div className="text-sm font-semibold text-[#F0F4FF]">{label}</div>
                    <div className="text-[10px] text-[#7A8FA6]">{sub}</div>
                  </button>
                ))}
              </div>

              {method === 'qr' && (
                <div className="flex flex-col items-center p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,194,255,0.1)' }}>
                  <div className="w-28 h-28 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'rgba(0,194,255,0.06)', border: '2px solid rgba(0,194,255,0.2)' }}>
                    <QrCode size={72} color="rgba(0,194,255,0.45)" />
                  </div>
                  <div className="font-mono-code text-xs text-[#7A8FA6]">Session expires: {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
                </div>
              )}
              {method === 'link' && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(0,194,255,0.04)', border: '1px solid rgba(0,194,255,0.12)' }}>
                  <code className="flex-1 text-[10px] font-mono-code text-[#00C2FF] truncate">sovereign://present?s=sess_7f3a9b&c={credential.id}</code>
                  <button className="btn-ghost text-[10px] px-2 py-1 flex-shrink-0"
                    onClick={() => navigator.clipboard.writeText(`sovereign://present?s=sess_7f3a9b&c=${credential.id}`)}>
                    Copy
                  </button>
                </div>
              )}
              {method === 'nfc' && (
                <div className="flex flex-col items-center py-8 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,194,255,0.1)' }}>
                  <div className="text-5xl mb-3" style={{ animation: 'float 2s ease-in-out infinite' }}>📡</div>
                  <div className="text-sm text-[#7A8FA6]">Hold your device near the NFC reader</div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.3)', boxShadow: '0 0 24px rgba(0,255,136,0.2)' }}>
                <CheckCircle size={32} color="#00FF88" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#F0F4FF] mb-2">Credential Shared!</h3>
              <p className="text-sm text-[#7A8FA6] mb-5">Proof generated and verified successfully.</p>
              <div className="grid grid-cols-3 gap-3 w-full">
                {[['Fields Shared', `${disclosedCount}/${credential.fields.length}`], ['Proof Time', '342ms'], ['Expires', '14:32']].map(([l, v]) => (
                  <div key={l} className="p-3 rounded-xl" style={{ background: 'rgba(0,194,255,0.04)', border: '1px solid rgba(0,194,255,0.1)' }}>
                    <div className="font-display font-bold text-[#00C2FF]">{v}</div>
                    <div className="text-[9px] text-[#7A8FA6] mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,194,255,0.06)' }}>
          {step > 1 && step < 3 ? (
            <button onClick={() => setStep((step - 1) as Step)} className="btn-ghost px-4 py-2 text-sm">Back</button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={step === 2 ? doShare : () => setStep(2)} disabled={sharing} className="btn-primary px-5 py-2 text-sm">
              {sharing ? 'Generating ZKP...' : step === 2 ? 'Share Now' : 'Continue'}
            </button>
          ) : (
            <button onClick={onClose} className="btn-primary px-5 py-2 text-sm">Done</button>
          )}
        </div>
      </div>
    </div>
  )
}
