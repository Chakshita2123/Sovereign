import { useState } from 'react';
import { motion } from 'motion/react';
import { Credential } from '../../data/mockData';
import { CredentialCard } from './CredentialCard';
import { DIDDisplay } from './DIDDisplay';
import { Eye, EyeOff, Share2, ExternalLink, Ban } from 'lucide-react';
import { ShareCredentialModal } from '../modals/ShareCredentialModal';

interface CredentialDetailPanelProps {
  credential: Credential;
}

export function CredentialDetailPanel({ credential }: CredentialDetailPanelProps) {
  const [flipped, setFlipped] = useState(false);
  const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const toggleFieldReveal = (fieldLabel: string) => {
    setRevealedFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldLabel)) {
        newSet.delete(fieldLabel);
      } else {
        newSet.add(fieldLabel);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* 3D Credential Card */}
      <div className="flex justify-center">
        <div className="relative">
          <CredentialCard credential={credential} size="full" />
          <div className="text-center mt-3">
            <p className="text-[#7A8FA6] text-xs">
              Click card fields below to reveal using Zero-Knowledge Proofs
            </p>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Claim Fields */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-[#F0F4FF] font-semibold mb-4">Claim Fields</h3>
          <div className="space-y-2">
            {credential.claims.map((claim) => {
              const isRevealed = revealedFields.has(claim.label);
              return (
                <div
                  key={claim.label}
                  className={`
                    p-3 rounded-lg transition-all cursor-pointer
                    ${isRevealed
                      ? 'bg-[rgba(0,194,255,0.04)] border-l-2 border-[#00C2FF]'
                      : 'bg-[rgba(0,0,0,0.2)]'
                    }
                  `}
                  onClick={() => toggleFieldReveal(claim.label)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${isRevealed ? 'text-[#7A8FA6]' : 'text-[#7A8FA6] opacity-60'}`}>
                      {claim.label}
                    </span>
                    <button className="p-1 hover:bg-[rgba(0,194,255,0.1)] rounded transition-colors">
                      {isRevealed ? (
                        <Eye className="w-4 h-4 text-[#00C2FF]" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-[#7A8FA6]" />
                      )}
                    </button>
                  </div>
                  <div className={`text-sm ${isRevealed ? 'text-[#F0F4FF]' : 'text-[#7A8FA6]'}`}>
                    {isRevealed ? claim.value : '•••••••••'}
                  </div>
                  {claim.zkpCapable && isRevealed && (
                    <div className="mt-2 text-[#00FF88] text-xs flex items-center gap-1">
                      <span>✓</span>
                      <span>Zero-Knowledge Proof capable</span>
                    </div>
                  )}
                  {!isRevealed && (
                    <div className="mt-2 text-[#7A8FA6] text-xs flex items-center gap-1">
                      <span>🔒</span>
                      <span>Click to reveal</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Metadata */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-[#F0F4FF] font-semibold mb-4">Credential Metadata</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[#7A8FA6] text-xs mb-2 block">Issuer DID</label>
              <DIDDisplay did={credential.metadata.issuerDID} />
            </div>
            <div>
              <label className="text-[#7A8FA6] text-xs mb-1 block">Issue Date</label>
              <div className="text-[#F0F4FF] text-sm">
                {new Date(credential.issueDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            {credential.expiryDate && (
              <div>
                <label className="text-[#7A8FA6] text-xs mb-1 block">Expiry Date</label>
                <div className="text-[#F0F4FF] text-sm">
                  {new Date(credential.expiryDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            )}
            <div>
              <label className="text-[#7A8FA6] text-xs mb-1 block">Schema ID</label>
              <div className="did-text text-xs text-[#00C2FF]">
                {credential.metadata.schemaID}
              </div>
            </div>
            <div>
              <label className="text-[#7A8FA6] text-xs mb-1 block">Proof Type</label>
              <div className="text-[#F0F4FF] text-sm">
                {credential.metadata.proofType}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShareModalOpen(true)}
          className="flex-1 px-6 py-3 rounded-lg gradient-cta text-white font-semibold flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share Credential
        </button>
        <button className="px-6 py-3 rounded-lg border border-[rgba(0,194,255,0.3)] text-[#7A8FA6] hover:text-[#F0F4FF] hover:border-[#00C2FF] transition-colors flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          View on Ledger
        </button>
        <button className="px-6 py-3 rounded-lg border border-[rgba(255,68,68,0.3)] text-[#FF4444] hover:bg-[rgba(255,68,68,0.05)] transition-colors flex items-center gap-2">
          <Ban className="w-5 h-5" />
          Revoke
        </button>
      </div>

      <ShareCredentialModal
        credential={credential}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </motion.div>
  );
}