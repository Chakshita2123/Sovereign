import { Credential } from '../../data/mockData';
import { StatusBadge } from './StatusBadge';
import { ChevronRight } from 'lucide-react';

interface CredentialCardProps {
  credential: Credential;
  size?: 'full' | 'medium' | 'compact';
  onClick?: () => void;
}

export function CredentialCard({ credential, size = 'medium', onClick }: CredentialCardProps) {
  if (size === 'full') {
    return (
      <div
        className={`
          relative w-[360px] h-[220px] rounded-[20px] p-7 cursor-pointer
          transition-all duration-300
          ${credential.status === 'revoked' ? 'grayscale' : ''}
        `}
        style={{
          background: 'linear-gradient(135deg, #0A1628, #0F1E35)',
          border: `1px solid ${
            credential.status === 'expiring' 
              ? 'rgba(245, 166, 35, 0.4)' 
              : credential.status === 'revoked'
              ? 'rgba(255, 68, 68, 0.3)'
              : 'rgba(0, 194, 255, 0.2)'
          }`,
          boxShadow: credential.status === 'expiring' 
            ? '0 8px 40px rgba(245, 166, 35, 0.15)'
            : '0 8px 40px rgba(0, 194, 255, 0.08)',
        }}
        onClick={onClick}
      >
        {/* Hexagonal pattern overlay */}
        <div 
          className="absolute inset-0 rounded-[20px] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L15 5L10 10L5 5Z' fill='%2300C2FF'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl">
            {credential.issuerLogo}
          </div>
          <div className="text-2xl">
            {credential.type === 'University Degree' ? '🎓' :
             credential.type === 'Professional License' ? '⚕️' :
             credential.type === 'Employment Verification' ? '💼' :
             credential.type === 'Government ID' ? '🪪' : '🌐'}
          </div>
        </div>

        {/* Middle content */}
        <div className="mb-8">
          <h3 className="text-white text-[20px] font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {credential.type}
          </h3>
          <p className="text-[#7A8FA6] text-sm">{credential.holderName}</p>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div className="did-text text-[11px]">
            {new Date(credential.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
          <StatusBadge status={credential.status} expiryDate={credential.expiryDate} />
        </div>

        {/* Revoked stamp */}
        {credential.status === 'revoked' && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FF4444] text-3xl font-bold opacity-40 -rotate-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            REVOKED
          </div>
        )}
      </div>
    );
  }

  if (size === 'compact') {
    return (
      <div
        className="w-40 h-[100px] rounded-xl p-4 glass-card glass-card-hover cursor-pointer"
        onClick={onClick}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            <div className="text-xl">{credential.issuerLogo}</div>
            <StatusBadge status={credential.status} expiryDate={credential.expiryDate} />
          </div>
          <div className="text-[#F0F4FF] text-xs font-semibold truncate">
            {credential.type}
          </div>
        </div>
      </div>
    );
  }

  // Medium size (list item)
  return (
    <div
      className="flex items-center gap-4 py-4 px-4 border-b border-[rgba(0,194,255,0.06)] hover:bg-[rgba(0,194,255,0.04)] cursor-pointer transition-colors group"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-lg bg-[#0F1E35] flex items-center justify-center text-xl shrink-0">
        {credential.issuerLogo}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[#F0F4FF] font-semibold text-sm mb-0.5">{credential.type}</div>
        <div className="text-[#7A8FA6] text-xs">{credential.issuer}</div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={credential.status} expiryDate={credential.expiryDate} />
        <div className="text-[#7A8FA6] text-xs did-text">
          {new Date(credential.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <ChevronRight className="w-4 h-4 text-[#7A8FA6] group-hover:text-[#00C2FF] transition-colors" />
      </div>
    </div>
  );
}
