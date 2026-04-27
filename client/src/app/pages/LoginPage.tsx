import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/AuthContext';
import { Shield, Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isRegister) {
        if (!name.trim()) { setError('Name is required'); setBusy(false); return; }
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@sovereign.dev');
    setPassword('demo123');
    setIsRegister(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050D1A' }}>
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00C2FF 0%, #7B2FFF 60%, transparent 80%)' }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)' }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#F0F4FF]" style={{ fontFamily: 'var(--font-heading)' }}>
            Sovereign
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: 'rgba(10, 22, 40, 0.8)',
            borderColor: 'rgba(0, 194, 255, 0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h2 className="text-xl font-bold text-[#F0F4FF] text-center mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {isRegister ? 'Create Your Vault' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-[#7A8FA6] text-center mb-6">
            {isRegister ? 'Start managing your digital identity' : 'Sign in to your identity vault'}
          </p>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg text-sm text-[#FF4444] border border-[rgba(255,68,68,0.2)] bg-[rgba(255,68,68,0.06)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8FA6]" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm text-[#F0F4FF] placeholder:text-[#7A8FA6] focus:outline-none transition-colors"
                  style={{
                    background: '#0A1628',
                    border: '1px solid rgba(0,194,255,0.12)',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#00C2FF'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,194,255,0.12)'}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8FA6]" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-4 rounded-lg text-sm text-[#F0F4FF] placeholder:text-[#7A8FA6] focus:outline-none transition-colors"
                style={{
                  background: '#0A1628',
                  border: '1px solid rgba(0,194,255,0.12)',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#00C2FF'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,194,255,0.12)'}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8FA6]" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-11 pl-10 pr-10 rounded-lg text-sm text-[#F0F4FF] placeholder:text-[#7A8FA6] focus:outline-none transition-colors"
                style={{
                  background: '#0A1628',
                  border: '1px solid rgba(0,194,255,0.12)',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#00C2FF'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,194,255,0.12)'}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8FA6] hover:text-[#F0F4FF] transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_24px_rgba(0,194,255,0.3)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)' }}
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-5 text-center text-sm text-[#7A8FA6]">
            {isRegister ? 'Already have a vault?' : "Don't have a vault?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-[#00C2FF] hover:underline font-medium"
            >
              {isRegister ? 'Sign In' : 'Create One'}
            </button>
          </p>

          {/* Demo user button */}
          {!isRegister && (
            <button
              onClick={fillDemo}
              className="mt-4 w-full h-9 rounded-lg text-xs text-[#7A8FA6] hover:text-[#F0F4FF] border border-[rgba(0,194,255,0.1)] hover:border-[rgba(0,194,255,0.3)] transition-all flex items-center justify-center gap-2"
              style={{ background: 'transparent' }}
            >
              <Shield className="w-3.5 h-3.5" />
              Use Demo Account
            </button>
          )}
        </div>

        <p className="text-center text-xs text-[#7A8FA6] mt-6 opacity-60">
          W3C DID Compliant / Zero-Knowledge Proofs / Self-Sovereign Identity
        </p>
      </div>
    </div>
  );
}
