import { Credential } from '../../data/mockData';

interface StatusBadgeProps {
  status: Credential['status'];
  expiryDate?: string;
}

export function StatusBadge({ status, expiryDate }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          bg: 'rgba(0, 255, 136, 0.08)',
          border: '#00FF88',
          text: '#00FF88',
          label: 'VERIFIED',
          showDot: true,
          pulse: true,
        };
      case 'pending':
        return {
          bg: 'rgba(245, 166, 35, 0.08)',
          border: '#F5A623',
          text: '#F5A623',
          label: 'PENDING',
          showDot: true,
          pulse: true,
        };
      case 'revoked':
        return {
          bg: 'rgba(255, 68, 68, 0.08)',
          border: '#FF4444',
          text: '#FF4444',
          label: 'REVOKED',
          showDot: false,
          pulse: false,
        };
      case 'expiring':
        const daysUntilExpiry = expiryDate ? Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
        return {
          bg: 'rgba(245, 166, 35, 0.12)',
          border: '#F5A623',
          text: '#F5A623',
          label: `EXPIRES IN ${daysUntilExpiry}D`,
          showDot: false,
          pulse: false,
          dashed: true,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded"
      style={{
        background: config.bg,
        border: `1px ${config.dashed ? 'dashed' : 'solid'} ${config.border}`,
      }}
    >
      {config.showDot && (
        <div
          className={`w-1.5 h-1.5 rounded-full ${config.pulse ? 'pulse-dot' : ''}`}
          style={{ background: config.text }}
        />
      )}
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: config.text, fontFamily: 'var(--font-body)' }}
      >
        {config.label}
      </span>
    </div>
  );
}
