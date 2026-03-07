import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Lock, Fingerprint, ChevronRight, Menu, X, Check, ArrowRight, Zap, Globe, Key, Eye, EyeOff } from 'lucide-react'

const FEATURES = [
  { icon: Shield, title: 'Zero-Knowledge Proofs', desc: 'Prove facts about your identity without revealing sensitive data. Share only what each verifier needs.', color: '#00C2FF' },
  { icon: Key, title: 'Self-Sovereign DIDs', desc: 'Your identity lives on a decentralized ledger. No single company owns or controls your credentials.', color: '#7B2FFF' },
  { icon: Lock, title: 'Hardware-Grade Security', desc: 'Private keys locked in your device Secure Enclave. Even Sovereign cannot access your credentials.', color: '#00FF88' },
  { icon: Fingerprint, title: 'Selective Disclosure', desc: 'Show your degree without revealing your GPA. Prove you\'re over 18 without sharing your birthdate.', color: '#F5A623' },
  { icon: Globe, title: 'Universal Standards', desc: 'Built on W3C DID, Verifiable Credentials, and OpenID4VP. Works across any platform or verifier.', color: '#00C2FF' },
  { icon: Zap, title: 'Instant Verification', desc: 'Sub-second ZKP verification. Share credentials with a single QR scan, NFC tap, or deep link.', color: '#7B2FFF' },
]

const ISSUERS = ['MIT','Google','HDFC ERGO','UIDAI','Stripe','Apollo','Zerodha','IIT Delhi','Infosys','ICICI Bank','Ola','PhonePe']

const STATS = [
  { value: '50K+', label: 'Credentials Issued' },
  { value: '200+', label: 'Verified Issuers' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<400ms', label: 'Proof Generation' },
]

const HOW_STEPS = [
  { n: '01', title: 'Create your Vault', desc: 'Install the Sovereign wallet. Your cryptographic identity is generated on your device — never on our servers.' },
  { n: '02', title: 'Receive Credentials', desc: 'Request credentials from verified issuers. They\'re encrypted and stored only on your device.' },
  { n: '03', title: 'Share with Zero-Knowledge', desc: 'When asked to verify, you choose exactly what to disclose. A cryptographic proof is generated — not your raw data.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div style={{ background: '#050D1A', minHeight: '100vh', color: '#F0F4FF' }}>

      {/* ─── NAV ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300" style={{
        background: scrolled ? 'rgba(5,13,26,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,194,255,0.08)' : 'none',
      }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00C2FF,#7B2FFF)' }}>
              <Shield size={16} color="#fff" />
            </div>
            <span className="font-display font-bold text-xl text-white">Sovereign</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features','How It Works','Security','For Issuers'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`} className="text-sm text-[#7A8FA6] hover:text-[#F0F4FF] transition-colors">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="btn-ghost text-sm px-4 py-2" onClick={() => navigate('/dashboard')}>Sign In</button>
            <button className="btn-primary text-sm px-5 py-2" onClick={() => navigate('/dashboard')}>Get Started <ArrowRight size={14} /></button>
          </div>

          <button className="md:hidden text-[#7A8FA6]" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden px-6 py-4 space-y-3" style={{ background: 'rgba(8,15,30,0.98)', borderTop: '1px solid rgba(0,194,255,0.08)' }}>
            {['Features','How It Works','Security','For Issuers'].map(item => (
              <a key={item} href="#" className="block text-sm text-[#7A8FA6] py-2">{item}</a>
            ))}
            <button className="btn-primary w-full py-2.5 text-sm mt-2" onClick={() => navigate('/dashboard')}>
              Enter Dashboard
            </button>
          </div>
        )}
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 60% at 65% 45%, rgba(0,194,255,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 15% 75%, rgba(123,47,255,0.06) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold" style={{
              background: 'rgba(0,194,255,0.08)', border: '1px solid rgba(0,194,255,0.2)', color: '#00C2FF'
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse-ring inline-block" />
              eIDAS 2.0 · W3C DID · ISO 18013-5 Compliant
            </div>

            <h1 className="font-display font-bold leading-tight mb-6" style={{ fontSize: 'clamp(40px,5vw,68px)' }}>
              Your Identity.<br />
              <span className="gradient-text">Your Rules.</span><br />
              Always.
            </h1>

            <p className="text-lg text-[#7A8FA6] mb-8 leading-relaxed max-w-lg">
              Sovereign is the Self-Sovereign Identity wallet that puts you back in control.
              Store credentials, share with zero-knowledge proofs, and verify without revealing.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button className="btn-primary px-7 py-3.5 text-base" onClick={() => navigate('/dashboard')}>
                Launch App <ArrowRight size={16} />
              </button>
              <button className="btn-ghost px-7 py-3.5 text-base" onClick={() => navigate('/dashboard')}>
                View Dashboard Demo
              </button>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-[#7A8FA6]">
              {['Open Protocol','Hardware-Secured','Zero PII on Servers'].map(t => (
                <span key={t} className="flex items-center gap-2">
                  <Check size={14} className="text-[#00FF88]" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — floating credential cards */}
          <div className="relative h-[480px] hidden lg:flex items-center justify-center">
            {/* Main credential card */}
            <div className="animate-float absolute" style={{
              width: 340, height: 210,
              background: 'linear-gradient(135deg,#0A1628,#0F1E35)',
              border: '1px solid rgba(0,194,255,0.25)',
              borderRadius: 20,
              boxShadow: '0 20px 60px rgba(0,194,255,0.1), 0 0 0 1px rgba(0,194,255,0.05) inset',
              top: '50%', left: '50%', transform: 'translate(-50%,-55%)',
            }}>
              <div className="absolute inset-0 hex-pattern opacity-30 rounded-[20px]" />
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,194,255,0.12)', border: '1px solid rgba(0,194,255,0.3)', color: '#00C2FF' }}>MIT</div>
                  <span className="text-[10px] px-2 py-1 rounded font-semibold" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid #00FF88', color: '#00FF88', letterSpacing: '0.08em' }}>● VERIFIED</span>
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-white mb-1">Bachelor of Technology</div>
                  <div className="text-xs text-[#7A8FA6] mb-3">MIT — Massachusetts Institute of Technology</div>
                  <div className="flex justify-between">
                    <span className="font-mono-code text-[10px] text-[#7A8FA6]">Issued 2023-06-15</span>
                    <span className="text-xs text-[#00C2FF]">◆ Education</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary card */}
            <div className="absolute" style={{
              width: 260, height: 160,
              background: 'linear-gradient(135deg,#0A1628,#0F1E35)',
              border: '1px solid rgba(123,47,255,0.25)',
              borderRadius: 16, opacity: 0.85,
              top: '62%', left: '60%',
              animation: 'float 6s ease-in-out infinite 1s',
              boxShadow: '0 12px 40px rgba(123,47,255,0.1)',
            }}>
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(123,47,255,0.12)', border: '1px solid rgba(123,47,255,0.3)', color: '#7B2FFF' }}>IN</div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid #00FF88', color: '#00FF88' }}>VERIFIED</span>
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-white">National Identity</div>
                  <div className="font-mono-code text-[10px] text-[#7A8FA6] mt-1">Identity · 2032-03-01</div>
                </div>
              </div>
            </div>

            {/* ZKP proof badge */}
            <div className="absolute top-16 right-4 px-4 py-3 rounded-xl" style={{
              background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(0,255,136,0.2)',
              backdropFilter: 'blur(12px)',
              animation: 'float 6s ease-in-out infinite 2s',
            }}>
              <div className="text-xs font-semibold text-[#00FF88] mb-1">🔒 ZKP Proof</div>
              <div className="font-mono-code text-[10px] text-[#7A8FA6]">Age ≥ 18 · Proven</div>
              <div className="font-mono-code text-[10px] text-[#7A8FA6]">DOB not disclosed</div>
            </div>

            {/* DID chip */}
            <div className="absolute bottom-20 left-2 px-3 py-2 rounded-lg" style={{
              background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(0,194,255,0.15)',
              backdropFilter: 'blur(12px)',
            }}>
              <div className="font-mono-code text-[10px] text-[#00C2FF]">did:indy:Sobr7M...</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ISSUERS ──────────────────────────────────── */}
      <div className="py-10 overflow-hidden" style={{ borderTop: '1px solid rgba(0,194,255,0.06)', borderBottom: '1px solid rgba(0,194,255,0.06)' }}>
        <div className="text-center text-xs text-[#7A8FA6] mb-6 tracking-widest uppercase">Trusted by leading issuers</div>
        <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...ISSUERS, ...ISSUERS].map((name, i) => (
            <div key={i} className="mx-8 flex items-center gap-2 text-[#7A8FA6]">
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(0,194,255,0.06)', border: '1px solid rgba(0,194,255,0.1)' }}>
                {name.slice(0,2)}
              </div>
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── STATS ────────────────────────────────────────────── */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="glass-card p-6 text-center">
              <div className="font-display font-bold text-3xl gradient-text mb-2">{value}</div>
              <div className="text-sm text-[#7A8FA6]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Identity infrastructure<br /><span className="gradient-text">built different</span>
          </h2>
          <p className="text-[#7A8FA6] text-lg max-w-xl mx-auto">Every component designed for privacy-by-default. Not as an afterthought.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card p-6 group cursor-default">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-display font-semibold text-lg text-white mb-2">{title}</h3>
              <p className="text-sm text-[#7A8FA6] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,47,255,0.04) 0%, transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">How it works</h2>
            <p className="text-[#7A8FA6] text-lg">Three steps to sovereign identity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="relative glass-card p-8">
                <div className="font-display font-bold text-5xl mb-4" style={{ color: 'rgba(0,194,255,0.15)' }}>{n}</div>
                <h3 className="font-display font-bold text-xl text-white mb-3">{title}</h3>
                <p className="text-sm text-[#7A8FA6] leading-relaxed">{desc}</p>
                {i < 2 && <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-[#7A8FA6] z-10">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ZKP INTERACTIVE DEMO ─────────────────────────────── */}
      <section id="security" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Prove it.<br /><span className="gradient-text">Without showing it.</span>
            </h2>
            <p className="text-[#7A8FA6] text-lg mb-8 leading-relaxed">
              Zero-Knowledge Proofs let you share only what a verifier needs.
              Toggle the fields below to see what a verifier actually receives.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Age ≥ 18', desc: 'Verifier learns: TRUE — not your actual birthdate', canToggle: false },
                { label: 'Has active employment', desc: 'Verifier learns: YES — not your salary or company', canToggle: false },
                { label: 'GPA', desc: 'Your actual GPA: 3.92', canToggle: true },
              ].map(({ label, desc, canToggle }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{ background: canToggle && revealed ? 'rgba(255,68,68,0.04)' : 'rgba(0,194,255,0.04)', border: `1px solid ${canToggle && revealed ? 'rgba(255,68,68,0.15)' : 'rgba(0,194,255,0.12)'}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: canToggle && revealed ? 'rgba(255,68,68,0.1)' : 'rgba(0,255,136,0.1)' }}>
                    {canToggle ? (revealed ? <EyeOff size={14} color="#FF4444" /> : <Eye size={14} color="#00FF88" />) : <Check size={14} color="#00FF88" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#F0F4FF]">{label}</div>
                    <div className="text-xs text-[#7A8FA6] mt-0.5">{canToggle && revealed ? '⚠ Actual value exposed' : desc}</div>
                  </div>
                  {canToggle && (
                    <button onClick={() => setRevealed(!revealed)} className="text-xs px-2 py-1 rounded transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#7A8FA6', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {revealed ? 'Hide' : 'Reveal'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-10 translate-x-10"
              style={{ background: 'radial-gradient(circle, rgba(0,194,255,0.06), transparent 70%)' }} />
            <div className="text-sm font-semibold text-[#7A8FA6] mb-4 uppercase tracking-widest">Verifier receives</div>
            <div className="space-y-3">
              {[
                { label: 'age_predicate', value: 'PASSED (≥18)', color: '#00FF88' },
                { label: 'employment_status', value: 'ACTIVE', color: '#00FF88' },
                { label: 'gpa', value: revealed ? '3.92' : 'HIDDEN', color: revealed ? '#FF4444' : '#7A8FA6' },
                { label: 'proof_valid', value: 'TRUE', color: '#00FF88' },
                { label: 'proof_time', value: '342ms', color: '#00C2FF' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center py-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="font-mono-code text-xs text-[#7A8FA6]">{label}</span>
                  <span className="font-mono-code text-xs font-semibold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-[#7A8FA6] italic">
              {revealed ? '⚠ Raw value exposed — not recommended' : '✓ Only minimum required data shared'}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOR ISSUERS ──────────────────────────────────────── */}
      <section id="for-issuers" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #00C2FF, #7B2FFF)' }} />
            <Building size={40} color="#00C2FF" className="mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl mb-4">For Issuers & Enterprises</h2>
            <p className="text-[#7A8FA6] text-lg max-w-2xl mx-auto mb-8">
              Issue tamper-proof credentials at scale. Revoke instantly. Integrate in days via our SDK.
              FIPS 140-2 Level 3 certified key management included.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { n: '200+ VCs/sec', l: 'Issuance throughput' },
                { n: 'HSM-backed', l: 'Issuer key security' },
                { n: '7-year', l: 'Compliance audit log' },
              ].map(({ n, l }) => (
                <div key={l} className="p-4 rounded-xl" style={{ background: 'rgba(0,194,255,0.04)', border: '1px solid rgba(0,194,255,0.1)' }}>
                  <div className="font-display font-bold text-2xl gradient-text">{n}</div>
                  <div className="text-xs text-[#7A8FA6] mt-1">{l}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary px-8 py-3.5 text-base" onClick={() => navigate('/dashboard/issuer')}>
              Try Issuer Portal <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,194,255,0.06) 0%, transparent 70%)',
        }} />
        <div className="relative text-center max-w-3xl mx-auto px-6">
          <h2 className="font-display font-bold text-5xl md:text-6xl mb-6">
            Own your identity.<br /><span className="gradient-text">Start today.</span>
          </h2>
          <p className="text-xl text-[#7A8FA6] mb-10">
            Join thousands of users who have taken back control of their digital identity.
          </p>
          <button className="btn-primary px-10 py-4 text-lg" onClick={() => navigate('/dashboard')}>
            Launch Sovereign <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t py-12 px-6" style={{ borderColor: 'rgba(0,194,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00C2FF,#7B2FFF)' }}>
              <Shield size={16} color="#fff" />
            </div>
            <span className="font-display font-bold text-white">Sovereign</span>
          </div>
          <div className="text-sm text-[#7A8FA6]">© 2025 Sovereign. Built on W3C DID · eIDAS 2.0 · ISO 18013-5</div>
          <div className="flex items-center gap-2 text-xs text-[#7A8FA6]">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse inline-block" />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  )
}

// Icon used in issuers section
function Building({ size = 24, color = 'currentColor', className = '' }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  )
}
