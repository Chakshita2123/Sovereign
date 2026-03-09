import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { FileCheck, Eye, EyeOff, ChevronRight } from 'lucide-react';

interface CredentialField {
  label: string;
  value: string;
  revealed: boolean;
}

interface Credential {
  id: number;
  title: string;
  issuer: string;
  status: string;
  fields: CredentialField[];
}

export function InteractiveWallet() {
  const [selectedCredential, setSelectedCredential] = useState<number | null>(null);
  const [credentials] = useState<Credential[]>([
    {
      id: 1,
      title: 'University Degree',
      issuer: 'MIT',
      status: 'Verified',
      fields: [
        { label: 'Full Name', value: 'Sarah Chen', revealed: true },
        { label: 'Degree', value: 'B.S. Computer Science', revealed: true },
        { label: 'Graduation Date', value: '2024-06-15', revealed: false },
        { label: 'GPA', value: '3.85', revealed: false },
        { label: 'Student ID', value: '12345678', revealed: false }
      ]
    },
    {
      id: 2,
      title: 'Passport',
      issuer: 'US Government',
      status: 'Verified',
      fields: [
        { label: 'Full Name', value: 'Sarah Chen', revealed: true },
        { label: 'Nationality', value: 'United States', revealed: true },
        { label: 'Passport Number', value: '123456789', revealed: false },
        { label: 'Date of Birth', value: '1995-04-12', revealed: false },
        { label: 'Expiry Date', value: '2030-03-20', revealed: false }
      ]
    },
    {
      id: 3,
      title: 'Driver License',
      issuer: 'CA DMV',
      status: 'Verified',
      fields: [
        { label: 'Full Name', value: 'Sarah Chen', revealed: true },
        { label: 'License Number', value: 'D1234567', revealed: false },
        { label: 'Expiry Date', value: '2028-04-12', revealed: false },
        { label: 'Class', value: 'C', revealed: true }
      ]
    }
  ]);

  const selectedCred = credentials.find(c => c.id === selectedCredential);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #050D1A 0%, #0A1628 100%)' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="font-mono text-[#00C2FF] text-sm tracking-[0.2em] uppercase">
            INTERACTIVE DEMO
          </span>
          <h2 className="mt-4 text-5xl font-bold">Explore Selective Disclosure</h2>
          <p className="mt-4 text-xl text-[#7A8FA6] max-w-2xl mx-auto">
            Click on a credential to see how you can control exactly what information you share
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Phone mockup */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative rounded-[48px] overflow-hidden"
                 style={{
                   background: 'rgba(10, 22, 40, 0.9)',
                   border: '2px solid rgba(0, 194, 255, 0.2)',
                   boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 194, 255, 0.1)',
                   backdropFilter: 'blur(20px)'
                 }}>
              
              {/* Phone header */}
              <div className="p-6 border-b border-[rgba(0,194,255,0.1)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">My Credentials</h3>
                    <p className="text-sm text-[#7A8FA6]">{credentials.length} verified</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#00FF88] animate-pulse" />
                </div>
              </div>

              {/* Credentials list */}
              <div className="p-4 space-y-3 min-h-[500px]">
                <AnimatePresence mode="wait">
                  {selectedCredential === null ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {credentials.map((credential) => (
                        <motion.button
                          key={credential.id}
                          onClick={() => setSelectedCredential(credential.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-4 rounded-2xl text-left"
                          style={{
                            background: 'rgba(15, 30, 53, 0.6)',
                            border: '1px solid rgba(0, 194, 255, 0.15)',
                            boxShadow: '0 0 20px rgba(0, 194, 255, 0.05)'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                   style={{
                                     background: 'rgba(0, 194, 255, 0.1)',
                                     border: '1px solid rgba(0, 194, 255, 0.3)'
                                   }}>
                                <FileCheck className="w-5 h-5 text-[#00C2FF]" />
                              </div>
                              <div>
                                <div className="font-semibold text-sm">{credential.title}</div>
                                <div className="text-xs text-[#7A8FA6] font-mono">{credential.issuer}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                              <ChevronRight className="w-4 h-4 text-[#7A8FA6]" />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : selectedCred ? (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Back button */}
                      <button
                        onClick={() => setSelectedCredential(null)}
                        className="text-[#00C2FF] text-sm font-medium flex items-center gap-1"
                      >
                        ← Back to credentials
                      </button>

                      {/* Credential header */}
                      <div className="p-4 rounded-2xl"
                           style={{
                             background: 'rgba(15, 30, 53, 0.6)',
                             border: '1px solid rgba(0, 194, 255, 0.15)'
                           }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold">{selectedCred.title}</h4>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                            <span className="text-xs font-mono text-[#00FF88]">{selectedCred.status}</span>
                          </div>
                        </div>
                        <div className="text-xs text-[#7A8FA6] font-mono">Issued by {selectedCred.issuer}</div>
                      </div>

                      {/* Selective disclosure section */}
                      <div className="space-y-2">
                        <div className="text-xs text-[#7A8FA6] px-2">Select fields to share:</div>
                        
                        {selectedCred.fields.map((field, i) => (
                          <FieldToggle key={i} field={field} />
                        ))}
                      </div>

                      {/* Share button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-lg font-semibold text-sm mt-4"
                        style={{
                          background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)',
                          color: 'white'
                        }}
                      >
                        Share Selected Fields
                      </motion.button>

                      {/* Info */}
                      <div className="p-3 rounded-lg bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)]">
                        <div className="text-xs text-[#00FF88]">
                          ✓ Only selected fields will be shared with the verifier
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* Phone glow */}
            <div className="absolute inset-0 rounded-[48px] opacity-20 blur-2xl -z-10"
                 style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldToggle({ field }: { field: CredentialField }) {
  const [isRevealed, setIsRevealed] = useState(field.revealed);

  return (
    <motion.div
      layout
      className="p-3 rounded-lg flex items-center justify-between"
      style={{
        background: isRevealed ? 'rgba(0, 194, 255, 0.05)' : 'rgba(15, 30, 53, 0.4)',
        border: `1px solid ${isRevealed ? 'rgba(0, 194, 255, 0.3)' : 'rgba(0, 194, 255, 0.1)'}`,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="flex-1">
        <div className="text-xs text-[#7A8FA6] mb-1">{field.label}</div>
        <div className="text-sm font-mono flex items-center gap-2">
          <span style={{
            filter: isRevealed ? 'none' : 'blur(4px)',
            opacity: isRevealed ? 1 : 0.4,
            transition: 'all 0.3s ease'
          }}>
            {field.value}
          </span>
          {isRevealed ? (
            <Eye className="w-3 h-3 text-[#00C2FF]" />
          ) : (
            <EyeOff className="w-3 h-3 text-[#7A8FA6]" />
          )}
        </div>
      </div>
      
      <motion.button
        onClick={() => setIsRevealed(!isRevealed)}
        whileTap={{ scale: 0.95 }}
        className={`w-11 h-6 rounded-full relative transition-all ${
          isRevealed ? 'bg-[#00C2FF]' : 'bg-[rgba(122,143,166,0.2)]'
        }`}
      >
        <motion.div
          layout
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
          animate={{
            left: isRevealed ? '22px' : '4px'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );
}
