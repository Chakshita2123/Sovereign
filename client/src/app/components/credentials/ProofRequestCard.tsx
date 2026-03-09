import { ProofRequest } from '../../data/mockData';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProofRequestCardProps {
  request: ProofRequest;
  onApprove?: () => void;
  onDeny?: () => void;
}

export function ProofRequestCard({ request, onApprove, onDeny }: ProofRequestCardProps) {
  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(request.expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const isUrgent = () => {
    const now = new Date();
    const expiry = new Date(request.expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    return minutes < 120; // Less than 2 hours
  };

  return (
    <div 
      className="glass-card rounded-xl p-4 border-l-4"
      style={{
        borderLeftColor: '#F5A623',
        borderColor: 'rgba(245, 166, 35, 0.3)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Verifier logo */}
        <div className="w-9 h-9 rounded-lg bg-[#0F1E35] flex items-center justify-center text-xl shrink-0">
          {request.verifierLogo}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h4 className="text-[#F0F4FF] font-semibold text-sm mb-0.5">
                {request.verifierName}
              </h4>
              <p className="text-[#7A8FA6] text-xs">Requesting verification</p>
            </div>
            <div className={`flex items-center gap-1.5 ${isUrgent() ? 'text-[#F5A623]' : 'text-[#7A8FA6]'}`}>
              <Clock className="w-4 h-4" />
              <span className="did-text text-sm font-semibold">
                {getTimeRemaining()}
              </span>
            </div>
          </div>

          {/* Requested fields */}
          <div className="flex flex-wrap gap-2 mb-3">
            {request.requestedFields.map((field, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{
                  background: field.zkpPredicate ? 'rgba(0, 255, 136, 0.06)' : 'rgba(0, 194, 255, 0.08)',
                  border: `1px solid ${field.zkpPredicate ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 194, 255, 0.25)'}`,
                  color: field.zkpPredicate ? '#00FF88' : '#00C2FF',
                }}
              >
                {field.zkpPredicate || field.field}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onApprove}
              className="px-4 py-1.5 rounded-lg gradient-cta text-white text-sm font-semibold"
            >
              Approve
            </button>
            <button
              onClick={onDeny}
              className="px-4 py-1.5 rounded-lg border border-[rgba(255,68,68,0.3)] text-[#FF4444] text-sm font-semibold hover:bg-[rgba(255,68,68,0.05)] transition-colors"
            >
              Deny
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
