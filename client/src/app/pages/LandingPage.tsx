import { useNavigate } from 'react-router';
import { HeroSection } from '../components/marketing/hero-section';
import { ProblemSection } from '../components/marketing/problem-section';
import { HowItWorksSection } from '../components/marketing/how-it-works-section';
import { BentoFeatures } from '../components/marketing/bento-features';
import { TrustSecuritySection } from '../components/marketing/trust-security-section';
import { InteractiveWallet } from '../components/marketing/interactive-wallet';
import { StatsSection } from '../components/marketing/stats-section';
import { CTASection } from '../components/marketing/cta-section';
import { Footer } from '../components/marketing/footer';
import { Shield, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

function MarketingNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,13,26,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,194,255,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)' }}
          >
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-lg font-bold text-[#F0F4FF]"
            style={{ fontFamily: 'var(--font-display, var(--font-heading))' }}
          >
            VaultID
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Security', href: '#security' },
            { label: 'For Issuers', href: '#issuers' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-[#7A8FA6] hover:text-[#F0F4FF] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden md:flex items-center gap-1 text-sm text-[#7A8FA6] hover:text-[#F0F4FF] transition-colors px-4 py-2 rounded-lg border border-[rgba(0,194,255,0.15)] hover:border-[rgba(0,194,255,0.35)]"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(0,194,255,0.3)] hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)' }}
          >
            Launch App <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  // Intercept CTA clicks that reference '#' or the vault creation
  // We render the marketing sections as-is and overlay a nav
  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-primary, #050D1A)' }}
    >
      <MarketingNav />

      {/* Add padding-top to push hero content below fixed nav */}
      <div className="pt-0">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <BentoFeatures />
        <TrustSecuritySection />
        <InteractiveWallet />
        <StatsSection />

        {/* Custom CTA section that bridges to the dashboard */}
        <section className="relative py-32 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #050D1A 0%, #0A1628 50%, #050D1A 100%)' }}
          />
          {/* Animated glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
            style={{ background: 'radial-gradient(circle, #00C2FF 0%, #7B2FFF 50%, transparent 70%)' }}
          />

          <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
            <span className="font-mono text-[#00C2FF] text-sm tracking-[0.2em] uppercase">
              GET STARTED TODAY
            </span>
            <h2
              className="mt-4 text-[56px] font-bold leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Your Identity,
              <br />
              <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2FFF] bg-clip-text text-transparent">
                Your Vault
              </span>
            </h2>
            <p className="mt-6 text-xl text-[#7A8FA6] max-w-2xl mx-auto leading-relaxed">
              Take complete ownership of your personal data. Zero-knowledge proofs. No central servers.
              Just you and your credentials.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)',
                  boxShadow: '0 0 40px rgba(0, 194, 255, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(0, 194, 255, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 194, 255, 0.25)';
                }}
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/dashboard/issuer')}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-[#F0F4FF] font-semibold text-lg transition-all hover:-translate-y-px"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(0,194,255,0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,194,255,0.5)';
                  e.currentTarget.style.background = 'rgba(0,194,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,194,255,0.25)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                For Issuers & Enterprises
              </button>
            </div>

            <p className="mt-6 text-sm text-[#7A8FA6]">
              Free to start · No credit card required · W3C & eIDAS 2.0 compliant
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
