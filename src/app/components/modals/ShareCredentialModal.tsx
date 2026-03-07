import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, Smartphone, Link2, Eye, EyeOff, Check, Shield } from 'lucide-react';
import { Credential } from '../../data/mockData';

interface ShareCredentialModalProps {
  credential: Credential;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareCredentialModal({ credential, isOpen, onClose }: ShareCredentialModalProps) {
  const [step, setStep] = useState(1);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const [shareMethod, setShareMethod] = useState<'qr' | 'nfc' | 'link' | null>(null);

  const toggleField = (fieldLabel: string) => {
    setVisibleFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldLabel)) {
        newSet.delete(fieldLabel);
      } else {
        newSet.add(fieldLabel);
      }
      return newSet;
    });
  };

  const handleShare = () => {
    setStep(3);
    setTimeout(() => {
      setStep(1);
      setVisibleFields(new Set());
      setShareMethod(null);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl glass-card rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-[rgba(0,194,255,0.1)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#7A8FA6]" />
          </button>

          {/* Step 1: Select Fields */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[#F0F4FF] mb-2">Share Credential</h2>
                <p className="text-[#7A8FA6] text-sm">
                  Select which fields to share. Unchecked fields will be hidden via Zero-Knowledge Proofs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left: Field selection */}
                <div className="space-y-2">
                  <h3 className="text-[#F0F4FF] text-sm font-semibold mb-3">
                    Available Fields
                  </h3>
                  {credential.claims.map((claim) => (
                    <div
                      key={claim.label}
                      onClick={() => toggleField(claim.label)}
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-all
                        ${visibleFields.has(claim.label)
                          ? 'bg-[rgba(0,194,255,0.04)] border-[#00C2FF] border-l-2'
                          : 'bg-[rgba(0,0,0,0.2)] border-[rgba(0,194,255,0.12)]'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex-1 ${!visibleFields.has(claim.label) ? 'opacity-60' : ''}`}>
                          <div className="text-[#7A8FA6] text-xs mb-1">{claim.label}</div>
                          <div className="text-[#F0F4FF] text-sm font-medium">
                            {visibleFields.has(claim.label) ? claim.value : '•••••••••'}
                          </div>
                        </div>
                        {visibleFields.has(claim.label) ? (
                          <Eye className="w-4 h-4 text-[#00C2FF]" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-[#7A8FA6]" />
                        )}
                      </div>
                      {!visibleFields.has(claim.label) && (
                        <div className="mt-2 flex items-center gap-1 text-[#7A8FA6] text-xs">
                          <span>🔒</span>
                          <span>Hidden via ZKP</span>
                        </div>
                      )}
                      {claim.zkpCapable && visibleFields.has(claim.label) && (
                        <div className="mt-2 text-[#00FF88] text-xs">
                          ✓ Zero-Knowledge Proof available
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right: Preview */}
                <div className="space-y-3">
                  <h3 className="text-[#F0F4FF] text-sm font-semibold mb-3">
                    Verifier Will See
                  </h3>
                  <div className="glass-card rounded-xl p-4 space-y-3">
                    <div className="text-center mb-4">
                      <div className="text-2xl mb-2">{credential.issuerLogo}</div>
                      <div className="text-[#F0F4FF] font-semibold">{credential.type}</div>
                      <div className="text-[#7A8FA6] text-xs">from {credential.issuer}</div>
                    </div>
                    {credential.claims.map((claim) => (
                      <div key={claim.label} className="pb-2 border-b border-[rgba(0,194,255,0.06)]">
                        <div className="text-[#7A8FA6] text-xs mb-1">{claim.label}</div>
                        <div className="text-[#F0F4FF] text-sm">
                          {visibleFields.has(claim.label) ? claim.value : '[Hidden]'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[#7A8FA6] text-xs text-center">
                    Sharing {visibleFields.size} of {credential.claims.length} fields
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(0,194,255,0.12)]">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg border border-[rgba(0,194,255,0.3)] text-[#7A8FA6] hover:text-[#F0F4FF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={visibleFields.size === 0}
                  className="px-6 py-2 rounded-lg gradient-cta text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Choose Share Method */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[#F0F4FF] mb-2">Choose Share Method</h2>
                <p className="text-[#7A8FA6] text-sm">
                  Select how you want to share your credential proof
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* QR Code */}
                <div
                  onClick={() => setShareMethod('qr')}
                  className={`
                    glass-card rounded-xl p-6 cursor-pointer text-center transition-all
                    ${shareMethod === 'qr' ? 'border-[#00C2FF] border-2' : 'hover:border-[rgba(0,194,255,0.3)]'}
                  `}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(0,194,255,0.1)] flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-[#00C2FF]" />
                  </div>
                  <h3 className="text-[#F0F4FF] font-semibold mb-2">QR Code</h3>
                  <p className="text-[#7A8FA6] text-xs">
                    Display QR code for scanning
                  </p>
                </div>

                {/* NFC */}
                <div
                  onClick={() => setShareMethod('nfc')}
                  className={`
                    glass-card rounded-xl p-6 cursor-pointer text-center transition-all
                    ${shareMethod === 'nfc' ? 'border-[#00C2FF] border-2' : 'hover:border-[rgba(0,194,255,0.3)]'}
                  `}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(0,194,255,0.1)] flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-[#00C2FF]" />
                  </div>
                  <h3 className="text-[#F0F4FF] font-semibold mb-2">NFC Tap</h3>
                  <p className="text-[#7A8FA6] text-xs">
                    Hold near device to share
                  </p>
                </div>

                {/* Deep Link */}
                <div
                  onClick={() => setShareMethod('link')}
                  className={`
                    glass-card rounded-xl p-6 cursor-pointer text-center transition-all
                    ${shareMethod === 'link' ? 'border-[#00C2FF] border-2' : 'hover:border-[rgba(0,194,255,0.3)]'}
                  `}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(0,194,255,0.1)] flex items-center justify-center">
                    <Link2 className="w-8 h-8 text-[#00C2FF]" />
                  </div>
                  <h3 className="text-[#F0F4FF] font-semibold mb-2">Deep Link</h3>
                  <p className="text-[#7A8FA6] text-xs">
                    Copy shareable link
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[rgba(0,194,255,0.12)]">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 rounded-lg border border-[rgba(0,194,255,0.3)] text-[#7A8FA6] hover:text-[#F0F4FF] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleShare}
                  disabled={!shareMethod}
                  className="px-6 py-2 rounded-lg gradient-cta text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share Credential
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00C2FF] flex items-center justify-center"
              >
                <Shield className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-[#F0F4FF] mb-3">Credential Shared Successfully</h2>
              <div className="space-y-2 text-[#7A8FA6] text-sm">
                <p>Shared {visibleFields.size} of {credential.claims.length} fields</p>
                <p className="did-text">Proof generated in 340ms</p>
                <p>Session expires in 15 minutes</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
